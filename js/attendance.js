// 🔥 API BASE (LOCAL / RENDER AUTO)
const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://shameer-backend-4.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔐 AUTH CHECK
  if (!token || role !== "student") {
    location.href = "../auth/login.html";
    return;
  }

  /* ======================
     ELEMENT REFERENCES
  ====================== */
  const table = document.getElementById("attendanceTable");
  if (!table) {
    console.error("❌ attendanceTable not found");
    return;
  }

  table.innerHTML =
    `<tr><td colspan="5">Loading attendance...</td></tr>`;

  /* ======================
     1️⃣ LOAD FROM CACHE FIRST
  ====================== */
  const cached = localStorage.getItem("myAttendance");
  if (cached) {
    renderAttendance(JSON.parse(cached));
  }

  /* ======================
     2️⃣ FETCH STUDENT + ATTENDANCE (PARALLEL)
  ====================== */
  Promise.all([
    fetch(`${API_BASE}/api/students/me`, {
      headers:{ Authorization:"Bearer "+token }
    }).then(r=>r.json()),

    fetch(`${API_BASE}/api/attendance/my`, {
      headers:{ Authorization:"Bearer "+token }
    }).then(r=>r.json())
  ])
  .then(([student, data]) => {

    // STUDENT INFO
    stuName.innerText = student.name;
    stuReg.innerText = student.regNo;
    stuSem.innerText = student.semester;

    if (!Array.isArray(data)) data = [];

    localStorage.setItem("myAttendance", JSON.stringify(data));
    renderAttendance(data);
  })
  .catch(err => {
    console.error("Attendance error:", err);
    table.innerHTML =
      `<tr><td colspan="5">Error loading attendance</td></tr>`;
  });

  /* ======================
     RENDER FUNCTION
  ====================== */
  function renderAttendance(list){
    table.innerHTML = "";

    if (!list.length) {
      table.innerHTML =
        `<tr><td colspan="5">No attendance data</td></tr>`;
      return;
    }

    list.forEach(a => {
      const percent =
        a.totalHours > 0
          ? Math.round((a.attendedHours / a.totalHours) * 100)
          : 0;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${a.subject}</td>
        <td>${a.subjectCode || "-"}</td>
        <td>${a.totalHours}</td>
        <td>${a.attendedHours}</td>
        <td class="${percent < 75 ? "low" : ""}">
          ${percent}%
        </td>
      `;
      table.appendChild(tr);
    });
  }

  /* ======================
     LOGOUT
  ====================== */
  logout.onclick = () => {
    localStorage.clear();
    location.href="../auth/login.html";
  };
});
