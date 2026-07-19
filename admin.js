import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const nameInput = document.getElementById("name");
const fatherInput = document.getElementById("father");
const categoryInput = document.getElementById("category");
const saveBtn = document.getElementById("saveBtn");
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("search");

const edited = document.getElementById("edited");
const cancelBtn = document.getElementById("cancelBtn");

saveBtn.addEventListener("click", async () => {

    if (nameInput.value.trim() === "") {
        alert("Enter Student Name");
        return;
    }

    if (edited.value === "") {

        await addDoc(collection(db, "students"), {
            name: nameInput.value,
            father: fatherInput.value,
            category: categoryInput.value
        });

        alert("Student Saved Successfully!");

    } else {

        await updateDoc(doc(db, "students", edited.value), {
            name: nameInput.value,
            father: fatherInput.value,
            category: categoryInput.value
        });

        alert("Student Updated Successfully!");

        edited.value = "";
        saveBtn.textContent = "Save Student";
        cancelBtn.style.display = "none";
    }

    nameInput.value = "";
    fatherInput.value = "";
    categoryInput.selectedIndex = 0;

    loadStudents();

});

async function loadStudents() {

    const snap = await getDocs(collection(db, "students"));

    studentList.innerHTML = "";

    snap.forEach((studentDoc) => {

        const s = studentDoc.data();

        studentList.innerHTML += `
        <tr>
            <td>${s.name ?? ""}</td>
            <td>${s.father ?? ""}</td>
            <td>${s.category ?? ""}</td>
            <td>
                <button onclick="editStudent('${studentDoc.id}','${s.name ?? ""}','${s.father ?? ""}','${s.category ?? ""}')">Edit</button>

                <button onclick="deleteStudent('${studentDoc.id}')">Delete</button>
            </td>
        </tr>
        `;
    });

}

window.deleteStudent = async function(id) {

    if (!confirm("Delete this student?")) return;

    await deleteDoc(doc(db, "students", id));

    loadStudents();

}

window.editStudent = function(id, name, father, category) {

    edited.value = id;

    nameInput.value = name;
    fatherInput.value = father;
    categoryInput.value = category;

    saveBtn.textContent = "Update Student";

    cancelBtn.style.display = "block";

}

cancelBtn.addEventListener("click", () => {

    edited.value = "";

    nameInput.value = "";
    fatherInput.value = "";
    categoryInput.selectedIndex = 0;

    saveBtn.textContent = "Save Student";

    cancelBtn.style.display = "none";

});

loadStudents();

searchInput.addEventListener("keyup", () => {

    const text = searchInput.value.toLowerCase();

    const rows = studentList.getElementsByTagName("tr");

    for (let row of rows) {

        if (row.innerText.toLowerCase().includes(text)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    }

});