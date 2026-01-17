/* ========= AUTH ========= */
function logout(){ localStorage.clear(); }

const token = localStorage.getItem("token");
const role  = localStorage.getItem("role");

if (!token || role !== "admin") {
  location.href = "../auth/login.html";
}

/* ========= CONFIG ========= */
const BASE_URL = "https://shameer-backend-4.onrender.com/api";
const COLORS = ["#38bdf8","#22c55e","#f59e0b","#ef4444"];

/* ========= SAFE FETCH ========= */
async function fetchJSON(url){
  const res = await fetch(url,{
    headers:{ Authorization:"Bearer " + token }
  });

  const data = await res.json();
  if(!res.ok){
    console.error("API ERROR:", url, data);
    return null;
  }
  return data;
}

/* ========= STUDENTS ========= */
(async ()=>{
  const d = await fetchJSON(`${BASE_URL}/admin/stats/students`);
  if(!Array.isArray(d)) return;

  totalStudents.innerText = d.reduce((s,x)=>s+x.count,0);

  new Chart(studentChart,{
    type:"bar",
    data:{
      labels:d.map(x=>x.department),
      datasets:[{
        data:d.map(x=>x.count),
        backgroundColor:COLORS
      }]
    },
    options:{plugins:{legend:{display:false}}}
  });
})();

/* ========= ATTENDANCE ========= */
(async ()=>{
  const d = await fetchJSON(`${BASE_URL}/admin/stats/attendance`);
  if(!Array.isArray(d)) return;

  new Chart(attendanceChart,{
    type:"bar",
    data:{
      labels:d.map(x=>x.department),
      datasets:[{
        data:d.map(x=>x.percentage),
        backgroundColor:COLORS
      }]
    },
    options:{scales:{y:{beginAtZero:true,max:100}}}
  });
})();

/* ========= PASS / FAIL ========= */
(async ()=>{
  const d = await fetchJSON(`${BASE_URL}/admin/stats/pass-fail`);
  if(!d) return;

  new Chart(passFailChart,{
    type:"doughnut",
    data:{
      labels:["Pass","Fail"],
      datasets:[{
        data:[d.pass||0,d.fail||0],
        backgroundColor:["#22c55e","#ef4444"]
      }]
    },
    options:{cutout:"70%"}
  });
})();

/* ========= FEES ========= */
(async ()=>{
  const d = await fetchJSON(`${BASE_URL}/admin/stats/fees`);
  if(!d) return;

  new Chart(feesChart,{
    type:"doughnut",
    data:{
      labels:["Paid","Pending"],
      datasets:[{
        data:[d.paid||0,d.pending||0],
        backgroundColor:["#22c55e","#ef4444"]
      }]
    },
    options:{cutout:"70%"}
  });
})();
