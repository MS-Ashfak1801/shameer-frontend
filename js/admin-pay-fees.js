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

  const form = document.getElementById("payFeesForm");
  const msg  = document.getElementById("payMsg");

  if (!form) {
    console.error("payFeesForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.innerText = "";

    const regNo    = document.getElementById("payRegNo").value.trim();
    const semester = Number(document.getElementById("paySemester").value);
    const amount   = Number(document.getElementById("payAmount").value);
    const btn      = form.querySelector("button");

    if (!regNo || !semester || !amount || amount <= 0) {
      msg.style.color = "red";
      msg.innerText = "Enter valid details";
      return;
    }

    btn.disabled = true;
    btn.innerText = "Processing...";

    try {
      const res = await fetch(`${BASE_URL}/fees/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          regNo,
          semester,
          amount
        })
      });

      const data = await res.json();

      if (!res.ok) {
        msg.style.color = "red";
        msg.innerText = data.message || "Payment failed";
        return;
      }

      msg.style.color = "green";
      msg.innerText = "Fees paid successfully ✅";
      form.reset();

    } catch (err) {
      console.error("Pay fees error:", err);
      msg.style.color = "red";
      msg.innerText = "Server error";
    } finally {
      btn.disabled = false;
      btn.innerText = "Pay Fees";
    }
  });

});
