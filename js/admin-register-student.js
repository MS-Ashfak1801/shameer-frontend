/* ================= AUTH CHECK ================= */
const token = localStorage.getItem("token");
const role  = localStorage.getItem("role");

if (!token || role !== "admin") {
  window.location.href = "../auth/login.html";
}

function logout(){ localStorage.clear(); }

/* ================= ENTER KEY NAVIGATION ================= */
document.addEventListener("DOMContentLoaded", () => {

  const inputs = Array.from(document.querySelectorAll("input, select"));

  inputs.forEach((input, index) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        if (input.value.trim() === "") {
          input.focus();
          return;
        }

        const next = inputs[index + 1];
        if (next) next.focus();
      }
    });
  });

  // 🔥 BUTTON CLICK BIND
  document
    .getElementById("registerBtn")
    .addEventListener("click", registerStudent);
});

/* ================= CONFIG ================= */
const BASE_URL = "https://shameer-backend-4.onrender.com/api";

/* ================= REGISTER ================= */
async function registerStudent() {
  const msg = document.getElementById("msg");
  msg.innerText = "";
  msg.style.color = "red";

  const body = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value.trim(),
    regNo: document.getElementById("regNo").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    department: document.getElementById("department").value,
    year: Number(document.getElementById("year").value),
    semester: Number(document.getElementById("semester").value)
  };

  // 🔒 VALIDATION
  for (let k in body) {
    if (!body[k]) {
      msg.innerText = "All fields are required";
      return;
    }
  }

  try {
    const res = await fetch(
      `${BASE_URL}/auth/register-student`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(body)
      }
    );

    const data = await res.json();

    if (!res.ok) {
      msg.innerText = data.message || "Registration failed";
      return;
    }

    msg.style.color = "green";
    msg.innerText = "Student registered successfully 🎉";

    // OPTIONAL: clear form
    document
      .querySelectorAll("input, select")
      .forEach(el => el.value = "");

  } catch (err) {
    msg.innerText = "Server not reachable";
  }
}
