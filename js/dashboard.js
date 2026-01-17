// 🔥 API BASE (LOCAL / RENDER AUTO)
const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://shameer-backend-4.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  if (!token || role !== "student") {
    location.href = "../auth/login.html";
    return;
  }

  const headers = { Authorization: "Bearer " + token };

  // 🎯 ELEMENTS
  const stuName  = document.getElementById("stuName");
  const stuReg   = document.getElementById("stuReg");
  const stuSem   = document.getElementById("stuSem");
  const attVal   = document.getElementById("attVal");
  const marksVal = document.getElementById("marksVal");
  const feesVal  = document.getElementById("feesVal");
  const feesNote = document.getElementById("feesNote");
  const logout   = document.getElementById("logout");

  /* =========================
     ⚡ 1️⃣ INSTANT CACHE RENDER
  ========================= */
  let cached = {};
  try {
    cached = JSON.parse(localStorage.getItem("dashboardCache")) || {};
  } catch {
    cached = {};
  }

  if (cached.student) {
    stuName.innerText = cached.student.name || "-";
    stuReg.innerText  = cached.student.regNo || "-";
    stuSem.innerText  = cached.student.semester || "-";
  }

  if (cached.attendance != null)
    attVal.innerText = cached.attendance + "%";

  if (cached.marks != null)
    marksVal.innerText = cached.marks + "%";

  if (cached.fees != null) {
    feesVal.innerText  = "₹" + cached.fees;
    feesNote.innerText = cached.fees === 0 ? "Paid" : "Due";
    feesNote.style.color =
      cached.fees === 0 ? "green" : "#dc2626";
  }

  /* =========================
     ⚡ 2️⃣ PARALLEL API FETCH
  ========================= */
  Promise.allSettled([
    fetch(`${API_BASE}/api/students/me`, { headers }).then(r=>r.json()),
    fetch(`${API_BASE}/api/attendance/my`, { headers }).then(r=>r.json()),
    fetch(`${API_BASE}/api/marks/my`, { headers }).then(r=>r.json()),
    fetch(`${API_BASE}/api/fees/my`, { headers }).then(r=>r.json())
  ])
  .then(([stuRes, attRes, marksRes, feesRes]) => {

    /* 🧑 STUDENT */
    if (stuRes.status === "fulfilled") {
      const student = stuRes.value;
      stuName.innerText = student.name;
      stuReg.innerText  = student.regNo;
      stuSem.innerText  = student.semester;
      cached.student = student;
    }

    /* 📊 ATTENDANCE */
    let attPercent = 0;
    if (attRes.status === "fulfilled" && attRes.value?.length) {
      let t=0,a=0;
      attRes.value.forEach(x=>{
        t += x.totalHours || 0;
        a += x.attendedHours || 0;
      });
      if (t > 0) attPercent = Math.round((a/t)*100);
    }
    attVal.innerText = attPercent + "%";
    cached.attendance = attPercent;

    /* 📝 MARKS */
    const marksData =
      marksRes.status === "fulfilled"
        ? (Array.isArray(marksRes.value)
            ? marksRes.value
            : marksRes.value?.marks || [])
        : [];

    let marksPercent = 0;
    if (marksData.length) {
      let s=0,m=0;
      marksData.forEach(x=>{
        s += x.total || 0;
        m += 100;
      });
      if (m > 0) marksPercent = Math.round((s/m)*100);
    }
    marksVal.innerText = marksPercent + "%";
    cached.marks = marksPercent;

    /* 💰 FEES */
    let balance = 0;
    if (feesRes.status === "fulfilled") {
      feesRes.value?.forEach(f => balance += f.balance || 0);
    }
    feesVal.innerText  = "₹" + balance;
    feesNote.innerText = balance === 0 ? "Paid" : "Due";
    feesNote.style.color =
      balance === 0 ? "green" : "#dc2626";
    cached.fees = balance;

    /* 💾 SAVE CACHE */
    localStorage.setItem("dashboardCache", JSON.stringify(cached));
  })
  .catch(err => {
    console.error("Dashboard load error:", err);
  });

  /* =========================
     LOGOUT
  ========================= */
  logout.onclick = () => {
    localStorage.clear();
    location.href="../auth/login.html";
  };
});
