import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const studentSelect = document.getElementById("student");
const programSelect = document.getElementById("program");
const markInput = document.getElementById("mark");
const saveMark = document.getElementById("saveMark");
const marksList = document.getElementById("marksList");

const edited = document.getElementById("edited");
const cancelBtn = document.getElementById("cancelBtn");
const searchMark = document.getElementById("searchMark");
const adminMarks = document.getElementById("adminMarks");

const isAdmin = sessionStorage.getItem("adminLoggedIn") === "true";

if (adminMarks) {
    adminMarks.style.display = isAdmin ? "block" : "none";
}

const studentsMap = {};
const programsMap = {};
const allPrograms = [];

async function loadStudents() {

    const snap = await getDocs(collection(db, "students"));

    studentSelect.innerHTML = "";

    snap.forEach((studentDoc) => {

        const student = studentDoc.data();

        studentsMap[studentDoc.id] = {
            name: student.name,
            category: student.category,
            gender: student.gender
        };

        studentSelect.innerHTML += `
        <option value="${studentDoc.id}">
            ${student.name}
        </option>`;
    });

}


async function loadPrograms() {

    const snap = await getDocs(collection(db, "programs"));

    allPrograms.length = 0;


    snap.forEach((programDoc) => {

        const program = programDoc.data();

        allPrograms.push({
            id: programDoc.id,
            name: program.name,
            category: program.category,
            group: program.group
        });

        programsMap[programDoc.id] = program.name;

    });

    filterPrograms();

}

function filterPrograms() {

    const student = studentsMap[studentSelect.value];

    if (!student) return;

    programSelect.innerHTML = "";

    allPrograms.forEach((program) => {

        if (program.category !== student.category) return;

        if (
            student.gender === "Boy" &&
            program.group === "Girls"
        ) return;

        if (
            student.gender === "Girl" &&
            program.group === "Boys"
        ) return;

        programSelect.innerHTML += `
            <option value="${program.id}">
                ${program.name}
            </option>
        `;

    });

}
async function loadMarks() {

    const snap = await getDocs(collection(db, "marks"));

    marksList.innerHTML = "";

    const keyword = searchMark ? searchMark.value.toLowerCase() : "";

    snap.forEach((markDoc) => {

        const mark = markDoc.data();

        const studentName = studentsMap[mark.studentId]?.name || "";
const programName = programsMap[mark.programId] || "";
        if (
            !studentName.toLowerCase().includes(keyword) &&
            !programName.toLowerCase().includes(keyword)
        ) return;

        let actions = "";

        if (isAdmin) {
            actions = `
                <button onclick="editMark('${markDoc.id}','${mark.studentId}','${mark.programId}','${mark.mark}')">Edit</button>
                <button onclick="deleteMark('${markDoc.id}')">Delete</button>
            `;
        }

        marksList.innerHTML += `
        <tr>
            <td>${studentName}</td>
            <td>${programName}</td>
            <td>${mark.mark}</td>
            <td>${actions}</td>
        </tr>`;
    });

}

if (saveMark) {

saveMark.addEventListener("click", async () => {

    if (!isAdmin) {
        alert("Only Admin can add marks.");
        return;
    }

    if (markInput.value === "") {
        alert("Enter Mark");
        return;
    }

    if (edited.value === "") {

        await addDoc(collection(db, "marks"), {
            studentId: studentSelect.value,
            programId: programSelect.value,
            mark: Number(markInput.value)
        });

        alert("Mark Saved Successfully!");

    } else {

        await updateDoc(doc(db, "marks", edited.value), {
            studentId: studentSelect.value,
            programId: programSelect.value,
            mark: Number(markInput.value)
        });

        alert("Mark Updated Successfully!");

        edited.value = "";
        saveMark.textContent = "Save Mark";
        cancelBtn.style.display = "none";
    }

    markInput.value = "";

    loadMarks();

});

}

window.editMark = function(id, studentId, programId, mark) {

    if (!isAdmin) return;

    edited.value = id;

    studentSelect.value = studentId;


filterPrograms();

programSelect.value = programId;

    saveMark.textContent = "Update Mark";

    cancelBtn.style.display = "inline-block";

}

window.deleteMark = async function(id) {

    if (!isAdmin) return;

    if (!confirm("Delete this mark?")) return;

    await deleteDoc(doc(db, "marks", id));

    loadMarks();

}

cancelBtn.addEventListener("click", () => {

    edited.value = "";

    markInput.value = "";

    saveMark.textContent = "Save Mark";

    cancelBtn.style.display = "none";

});

if (searchMark) {
    searchMark.addEventListener("keyup", loadMarks);
}

async function start() {

    await loadStudents();
    await loadPrograms();
    await loadMarks();

}

studentSelect.addEventListener("change", filterPrograms);

start();