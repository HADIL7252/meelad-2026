import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {

    const adminSection = document.getElementById("adminSchedule");
    const saveBtn = document.getElementById("saveSchedule");
    const scheduleList = document.getElementById("scheduleList");

    const isAdmin = sessionStorage.getItem("adminLoggedIn") === "true";

    // Hide Admin Form
    if (adminSection) {
        adminSection.style.display = isAdmin ? "block" : "none";
    }

    async function loadSchedules() {

        scheduleList.innerHTML = "";

        const q = query(
            collection(db, "schedules"),
            orderBy("programTime")
        );

        const snapshot = await getDocs(q);

        snapshot.forEach((scheduleDoc) => {

            const data = scheduleDoc.data();

            scheduleList.innerHTML += `
                <div class="schedule-card">

                    <div class="schedule-time">
                        🕒 ${data.programTime}
                    </div>

                    <div class="schedule-program">
                        ${data.programName}
                    </div>

                    ${
                        isAdmin
                        ? `
                        <button
                            onclick="deleteSchedule('${scheduleDoc.id}')"
                            style="margin-top:12px;background:#dc2626;">
                            Delete
                        </button>
                        `
                        : ""
                    }

                </div>
            `;

        });

    }

    window.deleteSchedule = async function(id){

        if(!confirm("Delete this schedule?")) return;

        await deleteDoc(doc(db,"schedules",id));

        loadSchedules();

    }

    await loadSchedules();

    if(saveBtn){

        saveBtn.addEventListener("click", async ()=>{

            if(!isAdmin){
                alert("Only Admin can add schedules.");
                return;
            }

            const programName=document.getElementById("programName").value.trim();
            const programTime=document.getElementById("programTime").value;

            if(programName==="" || programTime===""){
                alert("Please fill all fields.");
                return;
            }

            await addDoc(collection(db,"schedules"),{
                programName,
                programTime
            });

            document.getElementById("programName").value="";
            document.getElementById("programTime").value="";

            await loadSchedules();

            alert("✅ Schedule Saved Successfully");

        });

    }

});