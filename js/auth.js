// 🔥 BASE API
const BASE_URL = "https://shameer-backend-4.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {

  const emailEl = document.getElementById("email");
  const passEl  = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const msg = document.getElementById("msg");

  if (!emailEl || !passEl || !loginBtn) {
    console.error("❌ Login elements missing");
    return;
  }

  /* =========================
     ⚡ ENTER KEY NAVIGATION
  ========================= */
  const inputs = [emailEl, passEl];

  inputs.forEach((input, index) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        // empty na stop
        if (!input.value.trim()) return;

        // last input na → login
        if (index === inputs.length - 1) {
          login();
        } else {
          inputs[index + 1].focus();
        }
      }
    });
  });

  /* =========================
     LOGIN CLICK
  ========================= */
  loginBtn.addEventListener("click", login);

  async function login() {
    msg.innerText = "";
    msg.style.color = "red";

    const email = emailEl.value.trim();
    const password = passEl.value.trim();

    if (!email || !password) {
      msg.innerText = "Please enter email and password";
      return;
    }

    // ⚡ instant UI feedback
    loginBtn.disabled = true;
    loginBtn.innerText = "Logging in...";

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      let data = {};
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        msg.innerText = data.message || "Invalid email or password";
        return;
      }

      // 💾 SAVE AUTH
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);

      msg.style.color = "green";
      msg.innerText = "Login successful ✔️";

      // 🚀 FAST REDIRECT
      setTimeout(() => {
        if (data.role === "admin") {
          window.location.href = "/admin/admin-dashboard.html";
        } else {
          window.location.href = "/dashboard/student-dashboard.html";
        }
      }, 400);

    } catch (err) {
      msg.innerText = "Server not reachable";
    } finally {
      loginBtn.disabled = false;
      loginBtn.innerText = "Login";
    }
  }

});
