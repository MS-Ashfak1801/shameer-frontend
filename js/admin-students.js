/* ===== AUTH ===== */
function logout(){ localStorage.clear(); }

const token = localStorage.getItem("token");
const role  = localStorage.getItem("role");

if (!token || role !== "admin") {
  location.href = "../auth/login.html";
}

/* ===== CONFIG ===== */
const BASE_URL = "https://shameer-backend-4.onrender.com/api";
let students = [];

/* ===== LOAD STUDENTS ===== */
fetch(`${BASE_URL}/admin/students`, {
  headers:{ Authorization:"Bearer " + token }
})
.then(res => res.json())
.then(data => {
  if(!Array.isArray(data)) return;
  students = data;
  populateDeptFilter(data);
  renderTable(data);
});

/* ===== RENDER ===== */
function renderTable(list){
  studentTable.innerHTML = list.map(s=>`
    <tr>
      <td>${s.regNo}</td>
      <td>${s.name}</td>
      <td>${s.department}</td>
      <td>${s.semester}</td>
      <td>
        <button class="action-btn view" onclick="viewStudent('${s._id}')">View</button>
        <button class="action-btn edit" onclick="editStudent('${s._id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteStudent('${s._id}','${s.name}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

/* ===== FILTER ===== */
searchInput.addEventListener("input", applyFilters);
deptFilter.addEventListener("change", applyFilters);

function applyFilters(){
  const q = searchInput.value.toLowerCase();
  const dept = deptFilter.value;

  const filtered = students.filter(s=>{
    const textMatch =
      s.name.toLowerCase().includes(q) ||
      s.regNo.toLowerCase().includes(q);
    const deptMatch = dept ? s.department === dept : true;
    return textMatch && deptMatch;
  });

  renderTable(filtered);
}

/* ===== DEPT DROPDOWN ===== */
function populateDeptFilter(data){
  const depts=[...new Set(data.map(s=>s.department))];
  depts.forEach(d=>{
    const opt=document.createElement("option");
    opt.value=d; opt.textContent=d;
    deptFilter.appendChild(opt);
  });
}

/* ===== ACTIONS ===== */
function viewStudent(id){
  location.href=`admin-student-view.html?id=${id}`;
}
function editStudent(id){
  location.href=`admin-student-edit.html?id=${id}`;
}
function deleteStudent(id,name){
  if(!confirm(`Delete student "${name}"?`)) return;

  fetch(`${BASE_URL}/admin/students/${id}`,{
    method:"DELETE",
    headers:{ Authorization:"Bearer " + token }
  })
  .then(res=>res.json())
  .then(d=>{
    alert(d.message);
    location.reload();
  });
}
