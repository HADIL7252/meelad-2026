import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function loadChampion() {

    try {

        const studentsSnap = await getDocs(collection(db, "students"));
        const marksSnap = await getDocs(collection(db, "marks"));

        const studentMap = {};

        studentsSnap.forEach((studentDoc) => {
            studentMap[studentDoc.id] = studentDoc.data().name;
        });

        const totals = {};

        marksSnap.forEach((markDoc) => {

            const data = markDoc.data();

            if (!studentMap[data.studentId]) return;

            totals[data.studentId] =
                (totals[data.studentId] || 0) + Number(data.mark);

        });

        let champion = "No Data";
        let highest = 0;

        for (const id in totals) {

            if (totals[id] > highest) {
                highest = totals[id];
                champion = studentMap[id];
            }

        }

        document.getElementById("champion").textContent = champion;

    } catch (error) {

        console.error(error);

        document.getElementById("champion").textContent = "Error";

    }

}

loadChampion();