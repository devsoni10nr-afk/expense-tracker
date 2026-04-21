// ================= LOGIN =================
function checkLogin(){
  if(localStorage.getItem("login") !== "true"){
    window.location.href = "login.html";
  }
}

function logout(){
  localStorage.removeItem("login");
  window.location.href = "login.html";
}

// ================= DARK MODE =================
function toggleDark(){
  document.body.classList.toggle("dark");

  localStorage.setItem("dark",
    document.body.classList.contains("dark") ? "on" : "off"
  );
}

// ================= GLOBAL =================
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let income = parseFloat(localStorage.getItem("income")) || 0;

// charts
let pieChart, barChart, incomeChart;

// ================= INIT =================
window.onload = function(){
  checkLogin();

  if(localStorage.getItem("dark") === "on"){
    document.body.classList.add("dark");
  }

  loadData();
}

// ================= ADD EXPENSE =================
function add(){
  let title = document.getElementById("title").value;
  let amount = parseFloat(document.getElementById("amount").value);
  let date = document.getElementById("date").value;
  let category = document.getElementById("category").value;

  if(!title || !amount || !date){
    alert("Fill all fields");
    return;
  }

  transactions.push({title, amount, date, category});
  localStorage.setItem("transactions", JSON.stringify(transactions));

  loadData();

  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("date").value = "";
}

// ================= SET INCOME =================
function setIncome(){
  let val = parseFloat(document.getElementById("income").value);

  if(!val){
    alert("Enter valid income");
    return;
  }

  income = val;
  localStorage.setItem("income", income);

  loadData();
  document.getElementById("income").value = "";
}

// ================= LOAD DATA =================
function loadData(){

  let totalExpense = 0;
  let categoryData = {};
  let monthlyData = new Array(12).fill(0);

  transactions.forEach(t => {
    totalExpense += t.amount;

    // category
    categoryData[t.category] =
      (categoryData[t.category] || 0) + t.amount;

    // month
    let month = new Date(t.date).getMonth();
    if(!isNaN(month)){
      monthlyData[month] += t.amount;
    }
  });

  let balance = income - totalExpense;

  // UI
  document.getElementById("incomeDisplay").innerText = income;
  document.getElementById("expenseDisplay").innerText = totalExpense;
  document.getElementById("balance").innerText = balance;
  document.getElementById("savingDisplay").innerText = balance;

  // LIST
  let list = document.getElementById("list");
  list.innerHTML = "";

  transactions.forEach((t, i) => {
    let li = document.createElement("li");
    li.innerHTML = `${t.title} ₹${t.amount} (${t.date})
    <button onclick="removeItem(${i})">X</button>`;
    list.appendChild(li);
  });

  // RECENT
  let recent = document.getElementById("recent");
  recent.innerHTML = "";

  transactions.slice(-3).reverse().forEach(t=>{
    let li = document.createElement("li");
    li.innerText = `${t.title} ₹${t.amount}`;
    recent.appendChild(li);
  });

  // AI
  let keys = Object.keys(categoryData);
  let top = keys.length
    ? keys.reduce((a,b)=>categoryData[a]>categoryData[b]?a:b)
    : null;

  document.getElementById("ai").innerText =
    top ? `Top: ${top}\nTry to reduce spending` : "No data";

  // UPDATE CHARTS
  updateCharts(categoryData, monthlyData, totalExpense, balance);
}

// ================= DELETE =================
function removeItem(i){
  transactions.splice(i,1);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  loadData();
}

// ================= CHARTS =================
function updateCharts(categoryData, monthlyData, totalExpense, balance){

  // destroy old charts
  if(pieChart) pieChart.destroy();
  if(barChart) barChart.destroy();
  if(incomeChart) incomeChart.destroy();

  // PIE (category)
  pieChart = new Chart(document.getElementById("pie"), {
    type: "pie",
    data: {
      labels: Object.keys(categoryData),
      datasets: [{
        data: Object.values(categoryData)
      }]
    }
  });

  // BAR (monthly)
  barChart = new Chart(document.getElementById("bar"), {
    type: "bar",
    data: {
      labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      datasets: [{
        label: "Monthly Expenses",
        data: monthlyData
      }]
    }
  });

  // DOUGHNUT (income vs expense)
  incomeChart = new Chart(document.getElementById("incomeChart"), {
    type: "doughnut",
    data: {
      labels: ["Income","Expense","Saving"],
      datasets: [{
        data: [income, totalExpense, balance]
      }]
    }
  });
}

// ================= EXPORT =================
function exportExcel(){
  let data = transactions;

  if(!data.length){
    alert("No data");
    return;
  }

  let csv = "Title,Amount,Category,Date\n";

  data.forEach(t=>{
    csv += `${t.title},${t.amount},${t.category},${t.date}\n`;
  });

  let blob = new Blob([csv], {type:"text/csv"});
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();
}
function toggleMenu(){
  let menu = document.getElementById("dropdown");
  menu.classList.toggle("show");
}
function searchExpense() {
  let input = document.getElementById("search").value.toLowerCase();
  let items = document.querySelectorAll("#list li");

  items.forEach(item => {
    if (item.innerText.toLowerCase().includes(input)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}