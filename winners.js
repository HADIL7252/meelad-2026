import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const winnersList = document.getElementById("winnersList");

const studentsMap = {};

async function loadStudents() {

    const snap = await getDocs(collection(db, "students"));

    snap.forEach((doc) => {

        const student = doc.data();

        studentsMap[doc.id] = {
            name: student.name,
            category: student.category
        };

    });

}

loadStudents();

async function loadWinners() {

    const totals = {};

    const snap = await getDocs(collection(db, "marks"));

    snap.forEach((doc) => {

        const mark = doc.data();

        if (!totals[mark.studentId]) {
            totals[mark.studentId] = 0;
        }

        totals[mark.studentId] += mark.mark;

    });

    

const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
let rank = 1;

sorted.forEach(([id, total]) => {

   winnersList.innerHTML += `
<div class="winner-card">
    <div class="rank">
        ${
            rank === 1 ? "🥇" :
            rank === 2 ? "🥈" :
            rank === 3 ? "🥉" :
            "🏅"
        }
    </div>

    <div class="winner-info">
        <h3>${studentsMap[id].name}</h3>
        <p>${studentsMap[id].category}</p>
    </div>

    <div class="winner-score">
        ${total} Marks
    </div>

    `;

    rank++;

});
}

loadWinners();