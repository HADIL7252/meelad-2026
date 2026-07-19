if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
}

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const studentCount = document.getElementById("studentCount");
const programCount = document.getElementById("programCount");

async function loadCounts() {

    const students = await getDocs(collection(db, "students"));
    studentCount.textContent = students.size;

    const programs = await getDocs(collection(db, "programs"));
    programCount.textContent = programs.size;

    const marks = await getDocs(collection(db, "marks"));
    document.getElementById("marksCount").textContent = marks.size;

    const winners = await getDocs(collection(db, "marks"));
    document.getElementById("winnerCount").textContent = winners.size;
}

loadCounts();

function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
}