import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const name = document.getElementById("name");
const father = document.getElementById("father");
const category = document.getElementById("category");
const gender = document.getElementById("gender");

const saveBtn = document.getElementById("saveBtn");
const editedStudent = document.getElementById("editedStudent");
const cancelBtn = document.getElementById("cancelBtn");
const studentList = document.getElementById("studentList");
const search = document.getElementById("search");

async function loadStudents() {

    const snap = await getDocs(collection(db, "students"));

    studentList.innerHTML = "";

    const keyword = search.value.toLowerCase();

    snap.forEach((studentDoc) => {

        const student = studentDoc.data();

        if (!student.name.toLowerCase().includes(keyword)) return;

        studentList.innerHTML += `
        <tr>
            <td>${student.name}</td>
            <td>${student.father}</td>
            <td>${student.category}</td>
            <td>${student.gender || "-"}</td>

            <td>
                <button onclick="editStudent(
                    '${studentDoc.id}',
                    '${student.name}',
                    '${student.father}',
                    '${student.category}',
                    '${student.gender || ""}'
                )">
                    Edit
                </button>

                <button onclick="deleteStudent('${studentDoc.id}')">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });

}

saveBtn.addEventListener("click", async () => {

    if (
        name.value.trim() === "" ||
        father.value.trim() === "" ||
        category.value === "" ||
        gender.value === ""
    ) {
        alert("Fill all fields");
        return;
    }

    if (editedStudent.value === "") {

        await addDoc(collection(db, "students"), {
            name: name.value,
            father: father.value,
            category: category.value,
            gender: gender.value
        });

        alert("Student Added");

    } else {

        await updateDoc(doc(db, "students", editedStudent.value), {
            name: name.value,
            father: father.value,
            category: category.value,
            gender: gender.value
        });

        alert("Student Updated");

        editedStudent.value = "";
        saveBtn.textContent = "Save Student";
        cancelBtn.style.display = "none";
    }

    name.value = "";
    father.value = "";
    category.selectedIndex = 0;
    gender.selectedIndex = 0;

    loadStudents();

});

window.deleteStudent = async function (id) {

    if (!confirm("Delete this student?")) return;

    await deleteDoc(doc(db, "students", id));

    loadStudents();

};

window.editStudent = function (
    id,
    studentName,
    studentFather,
    studentCategory,
    studentGender
) {

    editedStudent.value = id;

    name.value = studentName;
    father.value = studentFather;
    category.value = studentCategory;
    gender.value = studentGender;

    saveBtn.textContent = "Update Student";
    cancelBtn.style.display = "inline-block";

};

cancelBtn.addEventListener("click", () => {

    editedStudent.value = "";

    name.value = "";
    father.value = "";
    category.selectedIndex = 0;
    gender.selectedIndex = 0;

    saveBtn.textContent = "Save Student";
    cancelBtn.style.display = "none";

});

search.addEventListener("keyup", loadStudents);

loadStudents();