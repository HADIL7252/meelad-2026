import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const resultsList = document.getElementById("resultsList");
const topWinners = document.getElementById("topWinners");
const categoryFilter = document.getElementById("categoryFilter");
const searchStudent = document.getElementById("searchStudent");

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

async function loadResults() {

    const totals = {};

    const snap = await getDocs(collection(db, "marks"));

    snap.forEach((doc) => {

        const mark = doc.data();

        if (!totals[mark.studentId]) {
            totals[mark.studentId] = 0;
        }

        totals[mark.studentId] += Number(mark.mark);

    });

    resultsList.innerHTML = "";
    topWinners.innerHTML = "";

    const selectedCategory = categoryFilter.value;
    const searchText = searchStudent.value.toLowerCase();

    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);

    // No Results
    if (sorted.length === 0) {

        resultsList.innerHTML = `
            <tr>
                <td colspan="4">
                    No Results Available
                </td>
            </tr>
        `;

        return;
    }

    // ===== Top 3 Winners =====

    sorted.slice(0, 3).forEach(([id, total], index) => {

        if (!studentsMap[id]) return;

        const cardClass =
            index === 0 ? "gold-card" :
            index === 1 ? "silver-card" :
            "bronze-card";

        const title =
            index === 0 ? "🥇 Champion" :
            index === 1 ? "🥈 Runner Up" :
            "🥉 Third Place";

        topWinners.innerHTML += `
            <div class="winner-card ${cardClass}">
                <h3>${title}</h3>
                <h2>${studentsMap[id].name}</h2>
                <p>${studentsMap[id].category}</p>
                <h3>${total} Marks</h3>
            </div>
        `;

    });

    // ===== Results Table =====

    let rank = 1;

    sorted.forEach(([id, total]) => {

        if (!studentsMap[id]) return;

        if (
            selectedCategory !== "All" &&
            studentsMap[id].category !== selectedCategory
        ) {
            return;
        }

        if (
            !studentsMap[id].name.toLowerCase().includes(searchText)
        ) {
            return;
        }

        resultsList.innerHTML += `
            <tr>
                <td>${
                    rank === 1 ? "🥇" :
                    rank === 2 ? "🥈" :
                    rank === 3 ? "🥉" :
                    rank
                }</td>

                <td>${studentsMap[id].name}</td>

                <td>${studentsMap[id].category}</td>

                <td>${total}</td>
            </tr>
        `;

        rank++;

    });

}

async function init() {

    await loadStudents();
    await loadResults();

}

init();

categoryFilter.addEventListener("change", loadResults);
searchStudent.addEventListener("input", loadResults);

