/* ================= AUTH ================= */
function logout(){ localStorage.clear(); }

const token = localStorage.getItem("token");
const role  = localStorage.getItem("role");

if (!token || role !== "admin") {
  location.href = "../auth/login.html";
}

/* ================= CONFIG ================= */
const BASE_URL = "https://shameer-backend-4.onrender.com/api";
const id = new URLSearchParams(location.search).get("id");

/* ================= DOM READY ================= */
document.addEventListener("DOMContentLoaded", () => {

  // 🔥 GET ELEMENTS AFTER DOM LOAD
  const nameInput = document.getElementById("name");
  const deptInput = document.getElementById("department");
  const yearInput = document.getElementById("year");
  const semInput  = document.getElementById("semester");
  const phoneInput= document.getElementById("phone");
  const msg       = document.getElementById("msg");
  const updateBtn = document.getElementById("updateBtn");

  /* ===== LOAD STUDENT ===== */
  fetch(`${BASE_URL}/admin/students/${id}/details`,{
    headers:{ Authorization:"Bearer " + token }
  })
  .then(res=>res.json())
  .then(data=>{
    const s = data.student;
    nameInput.value  = s.name;
    deptInput.value  = s.department;
    yearInput.value  = s.year;
    semInput.value   = s.semester;
    phoneInput.value = s.phone;
  });

  /* ===== UPDATE ===== */
  updateBtn.addEventListener("click", () => {
    msg.innerText = "";
    msg.style.color = "red";

    const body = {
      name: nameInput.value.trim(),
      department: deptInput.value.trim(),
      year: yearInput.value,
      semester: semInput.value,
      phone: phoneInput.value.trim()
    };

    for (let k in body) {
      if (!body[k]) {
        msg.innerText = "All fields required";
        return;
      }
    }

    fetch(`${BASE_URL}/admin/students/${id}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer " + token
      },
      body: JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(data=>{
      msg.style.color = "green";
      msg.innerText = data.message || "Updated successfully";

      setTimeout(()=>{
        location.href = "admin-students.html";
      },1000);
    });
  });

});
