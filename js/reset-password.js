// 🔥 API BASE (LOCAL / RENDER AUTO)
const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://shameer-backend-4.onrender.com";

/* ======================
   SEND OTP
====================== */
async function sendOtp() {
  const phone = document.getElementById("phone").value.trim();
  const msg = document.getElementById("msg");
  const btn = document.getElementById("sendOtpBtn");

  msg.innerText = "";
  msg.style.color = "red";

  if (!phone || phone.length !== 10) {
    msg.innerText = "Enter valid 10-digit phone number";
    return;
  }

  btn.disabled = true;
  btn.innerText = "Sending...";

  try {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.innerText = data.message || "Failed to send OTP";
      return;
    }

    msg.style.color = "green";
    msg.innerText = "OTP sent successfully";

  } catch (err) {
    msg.innerText = "Server not reachable";
    console.error("SEND OTP ERROR:", err);
  } finally {
    btn.disabled = false;
    btn.innerText = "Send OTP";
  }
}

/* ======================
   RESET PASSWORD
====================== */
async function resetPassword() {
  const phone = document.getElementById("phone").value.trim();
  const otp = document.getElementById("otp").value.trim();
  const newPassword = document.getElementById("newPassword").value;
  const msg = document.getElementById("msg");
  const btn = document.getElementById("resetBtn");

  msg.innerText = "";
  msg.style.color = "red";

  if (!phone || !otp || !newPassword) {
    msg.innerText = "All fields required";
    return;
  }

  if (newPassword.length < 6) {
    msg.innerText = "Password must be at least 6 characters";
    return;
  }

  btn.disabled = true;
  btn.innerText = "Resetting...";

  try {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp, newPassword })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.innerText = data.message || "Reset failed";
      return;
    }

    msg.style.color = "green";
    msg.innerText = "Password reset successful ✔️";

    setTimeout(() => {
      window.location.href = "../auth/login.html";
    }, 1200);

  } catch (err) {
    msg.innerText = "Server error";
    console.error("RESET PASSWORD ERROR:", err);
  } finally {
    btn.disabled = false;
    btn.innerText = "Reset Password";
  }
}
