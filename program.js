import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const programInput = document.getElementById("programName");
const category = document.getElementById("category");
const group = document.getElementById("group");

const saveBtn = document.getElementById("saveProgram");
const programList = document.getElementById("programList");

const edited = document.getElementById("edited");
const cancelBtn = document.getElementById("cancelBtn");
const searchProgram = document.getElementById("searchProgram");

saveBtn.addEventListener("click", async () => {

    if (
        programInput.value.trim() === "" ||
        category.value === "" ||
        group.value === ""
    ) {
        alert("Fill all fields");
        return;
    }

    if (edited.value === "") {

        await addDoc(collection(db, "programs"), {
            name: programInput.value,
            category: category.value,
            group: group.value
        });

        alert("Program Saved Successfully!");

    } else {

        await updateDoc(doc(db, "programs", edited.value), {
            name: programInput.value,
            category: category.value,
            group: group.value
        });

        alert("Program Updated Successfully!");

        edited.value = "";
        saveBtn.textContent = "Save Program";
        cancelBtn.style.display = "none";
    }

    programInput.value = "";
    category.selectedIndex = 0;
    group.selectedIndex = 0;

    loadPrograms();

});

async function loadPrograms() {

    const snap = await getDocs(collection(db, "programs"));

    programList.innerHTML = "";

    const keyword = searchProgram.value.toLowerCase();

    snap.forEach((programDoc) => {

        const p = programDoc.data();

        if (!p.name.toLowerCase().includes(keyword)) return;

        programList.innerHTML += `
        <tr>
            <td>${p.name}</td>
            <td>${p.category || "-"}</td>
            <td>${p.group || "-"}</td>
            <td>

                <button onclick="editProgram(
                    '${programDoc.id}',
                    '${p.name}',
                    '${p.category || ""}',
                    '${p.group || ""}'
                )">
                    Edit
                </button>

                <button onclick="deleteProgram('${programDoc.id}')">
                    Delete
                </button>

            </td>
        </tr>
        `;

    });

}

window.deleteProgram = async function(id) {

    if (!confirm("Delete this program?")) return;

    await deleteDoc(doc(db, "programs", id));

    loadPrograms();

}

window.editProgram = function(
    id,
    name,
    programCategory,
    programGroup
) {

    edited.value = id;

    programInput.value = name;
    category.value = programCategory;
    group.value = programGroup;

    saveBtn.textContent = "Update Program";

    cancelBtn.style.display = "block";

}

cancelBtn.addEventListener("click", () => {

    edited.value = "";

    programInput.value = "";
    category.selectedIndex = 0;
    group.selectedIndex = 0;

    saveBtn.textContent = "Save Program";

    cancelBtn.style.display = "none";

});

searchProgram.addEventListener("keyup", loadPrograms);

loadPrograms();