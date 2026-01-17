// 🔥 API BASE (LOCAL / RENDER AUTO)
const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://shameer-backend-4.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "student") {
    location.href = "../auth/login.html";
    return;
  }

  /* ======================
     ELEMENT REFERENCES
  ====================== */
  const feesTable = document.getElementById("feesTableBody");
  const historyTable = document.getElementById("paymentHistoryBody");
  const logoutBtn = document.getElementById("logout");

  if (!feesTable || !historyTable) {
    console.error("❌ Fees table elements missing in HTML");
    return;
  }

  /* ======================
     1️⃣ INSTANT CACHE LOAD
  ====================== */
  const cachedFees = localStorage.getItem("myFees");
  const cachedHistory = localStorage.getItem("myFeesHistory");

  if (cachedFees) renderFees(JSON.parse(cachedFees));
  if (cachedHistory) renderHistory(JSON.parse(cachedHistory));

  /* ======================
     2️⃣ FETCH EVERYTHING PARALLEL
  ====================== */
  Promise.all([
    fetch(`${API_BASE}/api/students/me`, {
      headers:{ Authorization:"Bearer "+token }
    }).then(r=>r.json()),

    fetch(`${API_BASE}/api/fees/my`, {
      headers:{ Authorization:"Bearer "+token }
    }).then(r=>r.json()),

    fetch(`${API_BASE}/api/fees/history`, {
      headers:{ Authorization:"Bearer "+token }
    }).then(r=>r.json())
  ])
  .then(([stu, fees, history]) => {

    // STUDENT INFO
    document.getElementById("stuName").innerText = stu.name;
    document.getElementById("stuReg").innerText = stu.regNo;
    document.getElementById("stuSem").innerText = stu.semester;

    // FEES
    if (Array.isArray(fees)) {
      localStorage.setItem("myFees", JSON.stringify(fees));
      renderFees(fees);
    }

    // PAYMENT HISTORY
    if (Array.isArray(history)) {
      localStorage.setItem("myFeesHistory", JSON.stringify(history));
      renderHistory(history);
    }
  })
  .catch(err => {
    console.error("Fees page error:", err);
  });

  /* ======================
     RENDER FUNCTIONS
  ====================== */
  function renderFees(list){
    feesTable.innerHTML = "";

    if (!list.length) {
      feesTable.innerHTML =
        `<tr><td colspan="4">No fees records</td></tr>`;
      return;
    }

    list.forEach(f => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${f.semester}</td>
        <td>₹${f.totalFees}</td>
        <td>₹${f.paidFees}</td>
        <td>₹${f.balance}</td>
      `;
      feesTable.appendChild(tr);
    });
  }

  function renderHistory(list){
    historyTable.innerHTML = "";

    if (!list.length) {
      historyTable.innerHTML =
        `<tr><td colspan="3">No payments found</td></tr>`;
      return;
    }

    list.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.semester}</td>
        <td>₹${p.amount}</td>
        <td>${new Date(p.date).toLocaleDateString()}</td>
      `;
      historyTable.appendChild(tr);
    });
  }

  /* ======================
     LOGOUT
  ====================== */
  logoutBtn.onclick = () => {
    localStorage.clear();
    location.href="../auth/login.html";
  };

});
