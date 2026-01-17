// 🔥 API BASE URL (AUTO – LOCAL / RENDER)
const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://shameer-backend-4.onrender.com";

document.addEventListener("DOMContentLoaded", () => {

  console.log("✅ add-course.js LOADED");

  /* =========================
     ENTER KEY NAVIGATION
  ========================= */
  const inputs = Array.from(document.querySelectorAll("input"));

  inputs.forEach((input, index) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (input.value.trim() === "") return;

        const nextInput = inputs[index + 1];
        if (nextInput) nextInput.focus();
      }
    });
  });

  /* =========================
     AUTH CHECK (ADMIN)
  ========================= */
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    console.warn("❌ Not admin – redirecting");
    window.location.href = "../auth/login.html";
    return;
  }

  /* =========================
     ADD COURSE
  ========================= */
  const addBtn = document.getElementById("addCourseBtn");
  const msg = document.getElementById("msg");
  const form = document.getElementById("courseForm");

  if (!addBtn || !form) {
    console.error("❌ Button / Form not found in HTML");
    return;
  }

  // 🔥 IMPORTANT: prevent form default submit
  addBtn.type = "button";

  addBtn.addEventListener("click", async () => {
    console.log("🔥 ADD COURSE CLICKED");

    const courseCode = document.getElementById("courseCode").value.trim();
    const courseName = document.getElementById("courseName").value.trim();
    const department = document.getElementById("department").value.trim();
    const year = document.getElementById("year").value.trim();
    const semester = document.getElementById("semester").value.trim();

    msg.innerText = "";

    if (!courseCode || !courseName || !department || !year || !semester) {
      msg.style.color = "red";
      msg.innerText = "All fields required";
      return;
    }

    try {
      // 🔥 CACHE BUSTER INCLUDED
      const res = await fetch(
        `${API_BASE}/api/courses?ts=${Date.now()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({
            courseCode,
            courseName,
            department,
            year,
            semester: Number(semester)
          })
        }
      );

      console.log("STATUS:", res.status);

      const data = await res.json();
      console.log("RESPONSE:", data);

      if (!res.ok) {
        msg.style.color = "red";
        msg.innerText = data.message || "Failed to add course";
        return;
      }

      msg.style.color = "green";
      msg.innerText = "✅ Course added successfully 🎉";
      form.reset();

    } catch (err) {
      console.error("❌ ADD COURSE ERROR:", err);
      msg.style.color = "red";
      msg.innerText = "Server not reachable";
    }
  });

});
