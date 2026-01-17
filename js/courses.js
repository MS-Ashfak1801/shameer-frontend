const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://shameer-backend-4.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "student") {
    location.href = "../auth/login.html";
    return;
  }

  const list = document.getElementById("courseList");
  if (!list) return;

  // ⚡ STEP 1: SHOW CACHED DATA INSTANTLY
  const cached = localStorage.getItem("myCourses");
  if (cached) {
    const courses = JSON.parse(cached);
    renderCourses(courses);
  } else {
    list.innerHTML = "<li>Loading...</li>";
  }

  // ⚡ STEP 2: FETCH IN BACKGROUND
  try {
    const res = await fetch(`${API_BASE}/api/courses/my`, {
      headers: { Authorization: "Bearer " + token }
    });

    if (!res.ok) return;

    const data = await res.json();

    if (Array.isArray(data)) {
      localStorage.setItem("myCourses", JSON.stringify(data));
      renderCourses(data);
    }

  } catch (err) {
    console.error("Courses fetch error:", err);
  }

  function renderCourses(data) {
    list.innerHTML = "";

    if (!data.length) {
      list.innerHTML = "<li>No courses found</li>";
      return;
    }

    data.forEach(c => {
      const li = document.createElement("li");
      li.innerText = `${c.courseCode} - ${c.courseName}`;
      list.appendChild(li);
    });
  }

});
