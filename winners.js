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
            name: student.name || "Unknown",
            category: student.category || "-"
        };

    });

}

async function loadWinners() {

    winnersList.innerHTML = "";

    const totals = {};

    const snap = await getDocs(collection(db, "marks"));

    snap.forEach((doc) => {

        const mark = doc.data();

        if (!totals[mark.studentId]) {
            totals[mark.studentId] = 0;
        }

        totals[mark.studentId] += Number(mark.mark);

    });

    const categoryWinners = {};

    Object.entries(totals).forEach(([id, total]) => {

        if (!studentsMap[id]) return;

        const category = studentsMap[id].category;

        if (
            !categoryWinners[category] ||
            total > categoryWinners[category].total
        ) {

            categoryWinners[category] = {
                name: studentsMap[id].name,
                total: total
            };

        }

    });

    Object.entries(categoryWinners).forEach(([category, winner]) => {

        winnersList.innerHTML += `
            <div class="winner-card">

                <div class="rank">🏆</div>

                <div class="winner-info">
                    <h3>${winner.name}</h3>
                    <p>${category}</p>
                </div>

                <div class="winner-score">
                    ${winner.total} Marks
                </div>

            </div>
        `;

    });

}

async function init() {

    await loadStudents();
    await loadWinners();

}

init();