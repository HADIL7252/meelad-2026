import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const printTable = document.getElementById("printTable");

async function loadResults() {

    const snapshot = await getDocs(collection(db, "marks"));

    let data = [];

    snapshot.forEach((doc) => {
        data.push(doc.data());
    });

    data.sort((a, b) => b.totalMarks - a.totalMarks);

    let rank = 1;

    data.forEach((student) => {

        printTable.innerHTML += `
        <tr>
            <td>${rank}</td>
            <td>${student.studentName}</td>
            <td>${student.totalMarks}</td>
        </tr>
        `;

        rank++;

    });

}

loadResults();