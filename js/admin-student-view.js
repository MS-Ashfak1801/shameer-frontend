function logout(){ localStorage.clear(); }

const token = localStorage.getItem("token");
const role  = localStorage.getItem("role");

if (!token || role !== "admin") {
  location.href = "../auth/login.html";
}

const BASE_URL = "https://shameer-backend-4.onrender.com/api";
const studentId = new URLSearchParams(location.search).get("id");

/* ===== STUDENT BASIC ===== */
fetch(`${BASE_URL}/admin/students`,{
  headers:{ Authorization:"Bearer " + token }
})
.then(r=>r.json())
.then(list=>{
  if(!Array.isArray(list)) return;

  const s = list.find(x=>x._id === studentId);
  if(!s) return;

  studentName.innerText = s.name;
  studentInfo.innerText =
    `Reg: ${s.regNo} | Dept: ${s.department} | Sem: ${s.semester ?? "-"}`;

  detailsGrid.innerHTML = `
    <div class="info-box"><span>Phone</span><strong>${s.phone}</strong></div>
    <div class="info-box"><span>Year</span><strong>${s.year}</strong></div>
    <div class="info-box"><span>Department</span><strong>${s.department}</strong></div>
    <div class="info-box"><span>Semester</span><strong>${s.semester ?? "-"}</strong></div>
  `;
});

/* ===== MARKS ===== */
fetch(`${BASE_URL}/admin/marks/${studentId}`,{
  headers:{ Authorization:"Bearer " + token }
})
.then(r=>r.json())
.then(data=>{
  if(!Array.isArray(data)) return;
  marksTable.innerHTML = data.map(m=>`
    <tr>
      <td>${m.semester}</td>
      <td>${m.subject}</td>
      <td><input id="i-${m._id}" value="${m.internal}"></td>
      <td><input id="e-${m._id}" value="${m.external}"></td>
      <td>${m.total}</td>
      <td>${m.result}</td>
      <td>
        <button class="save" onclick="saveMark('${m._id}')">Save</button>
        <button class="del" onclick="deleteMark('${m._id}')">Del</button>
      </td>
    </tr>
  `).join("");
});

/* ===== ATTENDANCE ===== */
fetch(`${BASE_URL}/admin/attendance/${studentId}`,{
  headers:{ Authorization:"Bearer " + token }
})
.then(r=>r.json())
.then(data=>{
  if(!Array.isArray(data)) return;
  attendanceTable.innerHTML = data.map(a=>{
    const p = Math.round((a.attendedHours/a.totalHours)*100);
    return `
    <tr>
      <td>${a.subject}</td>
      <td><input id="th-${a._id}" value="${a.totalHours}"></td>
      <td><input id="ah-${a._id}" value="${a.attendedHours}"></td>
      <td>${p}%</td>
      <td>
        <button class="save" onclick="saveAttendance('${a._id}')">Save</button>
        <button class="del" onclick="deleteAttendance('${a._id}')">Del</button>
      </td>
    </tr>`;
  }).join("");
});

/* ===== FEES ===== */
fetch(`${BASE_URL}/admin/fees/${studentId}`,{
  headers:{ Authorization:"Bearer " + token }
})
.then(r=>r.json())
.then(data=>{
  if(!Array.isArray(data)) return;
  feesTable.innerHTML = data.map(f=>{
    const paid = f.payments.reduce((s,p)=>s+p.amount,0);
    const bal  = f.totalFees - paid;
    return `
    <tr>
      <td>${f.semester}</td>
      <td>${f.totalFees}</td>
      <td>${paid}</td>
      <td>${bal}</td>
      <td>
        <input id="pay-${f._id}" placeholder="Amt">
        <button class="pay" onclick="addPayment('${f._id}')">Pay</button>
        <button class="del" onclick="deleteFees('${f._id}')">Del</button>
      </td>
    </tr>`;
  }).join("");
});

/* ===== ACTIONS ===== */
function saveMark(id){
  fetch(`${BASE_URL}/admin/marks/${id}`,{
    method:"PUT",
    headers:{
      Authorization:"Bearer "+token,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      internal:document.getElementById(`i-${id}`).value,
      external:document.getElementById(`e-${id}`).value
    })
  }).then(()=>location.reload());
}

function deleteMark(id){
  if(confirm("Delete mark?"))
    fetch(`${BASE_URL}/admin/marks/${id}`,{
      method:"DELETE",
      headers:{Authorization:"Bearer "+token}
    }).then(()=>location.reload());
}

function saveAttendance(id){
  fetch(`${BASE_URL}/admin/attendance/${id}`,{
    method:"PUT",
    headers:{
      Authorization:"Bearer "+token,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      totalHours:document.getElementById(`th-${id}`).value,
      attendedHours:document.getElementById(`ah-${id}`).value
    })
  }).then(()=>location.reload());
}

function deleteAttendance(id){
  if(confirm("Delete attendance?"))
    fetch(`${BASE_URL}/admin/attendance/${id}`,{
      method:"DELETE",
      headers:{Authorization:"Bearer "+token}
    }).then(()=>location.reload());
}

function addPayment(id){
  const amt = document.getElementById(`pay-${id}`).value;
  if(!amt || amt<=0) return alert("Enter valid amount");

  fetch(`${BASE_URL}/admin/fees/payment/${id}`,{
    method:"PUT",
    headers:{
      Authorization:"Bearer "+token,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({amount:amt})
  }).then(()=>location.reload());
}

function deleteFees(id){
  if(confirm("Delete fees record?"))
    fetch(`${BASE_URL}/admin/fees/${id}`,{
      method:"DELETE",
      headers:{Authorization:"Bearer "+token}
    }).then(()=>location.reload());
}
