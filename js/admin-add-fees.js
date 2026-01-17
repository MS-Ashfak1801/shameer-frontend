/* ================= AUTH ================= */
const token = localStorage.getItem("token");
const role  = localStorage.getItem("role");

if (!token || role !== "admin") {
  window.location.href = "../auth/login.html";
}

/* ================= CONFIG ================= */
const BASE_URL = "https://shameer-backend-4.onrender.com/api";

/* ================= DOM ================= */
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("addFeesForm");
  const msg  = document.getElementById("addMsg");

  if (!form) {
    console.error("addFeesForm not found in HTML");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const regNo      = document.getElementById("addRegNo")?.value.trim();
    const semester   = Number(document.getElementById("addSemester")?.value);
    const totalFees  = Number(document.getElementById("addTotalFees")?.value);
    const submitBtn  = form.querySelector("button");

    // 🔐 VALIDATION
    if (!regNo || !semester || !totalFees || totalFees <= 0) {
      showMsg("Please enter valid details", "red");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Adding...";

    try {
      const res = await fetch(`${BASE_URL}/fees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          regNo,
          semester,
          totalFees
        })
      });

      const data = await res.json();

      if (!res.ok) {
        showMsg(data.message || "Failed to add fees", "red");
        return;
      }

      showMsg("Fees added successfully ✅", "green");
      form.reset();

    } catch (err) {
      console.error("Add fees error:", err);
      showMsg("Server not reachable", "red");

    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = "Add Fees";
    }
  });

  function showMsg(text, color) {
    if (!msg) return alert(text);
    msg.innerText = text;
    msg.style.color = color;
  }

});
