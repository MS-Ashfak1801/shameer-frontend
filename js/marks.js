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
  const table = document.getElementById("marksTable");

  if (!table) {
    console.error("❌ marksTable not found in HTML");
    return;
  }

  table.innerHTML =
    `<tr><td colspan="4">Loading marks...</td></tr>`;

  /* ======================
     1️⃣ LOAD FROM CACHE FIRST
  ====================== */
  const cachedMarks = localStorage.getItem("myMarks");
  if (cachedMarks) {
    renderMarks(JSON.parse(cachedMarks));
  }

  /* ======================
     2️⃣ FETCH STUDENT INFO + MARKS PARALLEL
  ====================== */
  Promise.all([
    fetch(`${API_BASE}/api/students/me`, {
      headers:{ Authorization:"Bearer "+token }
    }).then(r=>r.json()),

    fetch(`${API_BASE}/api/marks/my`, {
      headers:{ Authorization:"Bearer "+token }
    }).then(r=>r.json())
  ])
  .then(([stu, data]) => {

    // STUDENT INFO
    document.getElementById("stuName").innerText = stu.name;
    document.getElementById("stuReg").innerText = stu.regNo;
    document.getElementById("stuSem").innerText = stu.semester;

    // MARKS DATA (backend may send { marks: [] })
    const marksList = Array.isArray(data)
      ? data
      : data.marks || [];

    localStorage.setItem("myMarks", JSON.stringify(marksList));
    renderMarks(marksList);
  })
  .catch(err => {
    console.error("Marks page error:", err);
    table.innerHTML =
      `<tr><td colspan="4">Error loading marks</td></tr>`;
  });

  /* ======================
     RENDER FUNCTION
  ====================== */
  function renderMarks(list){
    table.innerHTML = "";

    if (!list.length) {
      table.innerHTML =
        `<tr><td colspan="4">No marks available</td></tr>`;
      return;
    }

    list.forEach(m => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m.semester}</td>
        <td>${m.subjectCode || "-"}</td>
        <td>${m.grade || "-"}</td>
        <td class="${m.result === "Fail" ? "fail" : "pass"}">
          ${m.result}
        </td>
      `;
      table.appendChild(tr);
    });
  }

  /* ======================
     LOGOUT
  ====================== */
  document.getElementById("logout").onclick = () => {
    localStorage.clear();
    location.href="../auth/login.html";
  };

});
