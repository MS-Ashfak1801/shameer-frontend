/* ================= AUTH ================= */
const token = localStorage.getItem("token");
const role  = localStorage.getItem("role");

if (!token || role !== "admin") {
  window.location.href = "../auth/login.html";
}

/* ================= CONFIG ================= */
const BASE_URL = "https://shameer-backend-4.onrender.com/api";

/* ================= DOM READY ================= */
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("marksForm");
  const msg  = document.getElementById("msg");

  if (!form) {
    console.error("marksForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.innerText = "";
    msg.style.color = "red";

    const regNo = document.getElementById("regNo").value.trim();
    const semester = Number(document.getElementById("semester").value);
    const subject = document.getElementById("subject").value.trim();
    const subjectCode = document.getElementById("subjectCode").value.trim();
    const internal = Number(document.getElementById("internal").value);
    const external = Number(document.getElementById("external").value);

    // 🔒 VALIDATION
    if (!regNo || !semester || !subject || !subjectCode) {
      msg.innerText = "All fields are required";
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/marks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          regNo,
          semester,
          subject,
          subjectCode,
          internal,
          external
        })
      });

      const data = await res.json();

      if (!res.ok) {
        msg.innerText = data.message || "❌ Error adding marks";
        return;
      }

      msg.style.color = "green";
      msg.innerText = "✅ Marks added successfully";
      form.reset();

    } catch (err) {
      console.error("Add marks error:", err);
      msg.innerText = "❌ Server not reachable";
    }
  });

});
