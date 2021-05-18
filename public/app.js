let form = document.querySelector("#form");
let inputAmount = document.querySelector("#inputAmount");
let inputDescription = document.querySelector("#inputDesc");
let finalBalance = document.querySelector("#totalBalance");
let finalIncome = document.querySelector("#totalIncome");
let finalExpense = document.querySelector("#totalExpense");
let table = document.querySelector("#expenseTable");
let signOutBtn = document.querySelector("#signout");
let type = document.querySelector("#type");
let allTransfers = document.querySelector("#all");
let expenseOnly = document.querySelector("#expenseOnly");
let incomeOnly = document.querySelector("#incomeOnly");
let chart = document.querySelector("#chart");



let totalBalance = 0;
let totalIncome = 0;
let totalExpense = 0;

displayFinalAmount();
const allExpenses = [];

function addExpense(e) {
  e.preventDefault();
  const expenseItem = {};

  const amount = inputAmount.value;
  const expense = parseInt(amount, 10);
  const description = inputDescription.value;

  expenseItem.amount = expense;
  expenseItem.description = description;
  expenseItem.momen = getDatetoString(new Date());
  expenseItem.id = new Date().valueOf();
  expenseItem.type = type.value;

  allExpenses.push(expenseItem);

  if (expenseItem.type === "INCOME") {
    totalIncome = totalIncome + expense;
    totalBalance = totalBalance + expense;
  } else {
    totalExpense = totalExpense + expense;
    totalBalance = totalBalance - expense;
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .update({
          data: [...allExpenses],
          totalBalance: totalBalance,
          totalIncome: totalIncome,
          totalExpense: totalExpense,
        })
        .then(() => {
          console.log("added");
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      console.log("user is not signed in to add todos");
    }
  });

  form.reset();
  displayFinalAmount();
  showAll();
  console.log(allExpenses);
}

function deleteItem(moment) {
  allExpenses.map((item) => {
    if (item.id === moment) {
      let position = allExpenses.indexOf(item);
      allExpenses.splice(position, 1);

      if (item.type === "INCOME") {
        totalIncome = totalIncome - item.amount;
        totalBalance = totalBalance - item.amount;
      } else {
        totalExpense = totalExpense - item.amount;
        totalBalance = totalBalance + item.amount;
      }
    }
  });

  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .update({
          data: [...allExpenses],
          totalBalance: totalBalance,
          totalIncome: totalIncome,
          totalExpense: totalExpense,
        })
        .then(() => {
          console.log("removed");
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  });
 
  displayFinalAmount();
  showAll();
  console.log(allExpenses);
}

function signOut() {
  auth.signOut();
}

auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((snap) => {
        snap?.data()?.data.map((item) => {
          allExpenses.push(item);
        });
        console.log(allExpenses);
        displayList(allExpenses);
        totalBalance = snap.data().totalBalance;
        totalIncome = snap.data().totalIncome;
        totalExpense = snap.data().totalExpense;
        allExpensesChart();
        displayFinalAmount();
      });
  } else {
    location = "index.html";
  }
});

function getDatetoString(moment) {
  return moment.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

function percentage(percent, total){
  if(isNaN(percent) || isNaN(total)){
    return 0
  }else{
    return ((percent/total) * 100).toFixed(3)
  }
   
}

function displayList(array) {
  const expenseArray = array.map((item) => createList(item));
  const joinedHtml = expenseArray.join("");
  table.innerHTML = joinedHtml;
}

function displayFinalAmount() {
  finalBalance.textContent = "₹ " + totalBalance;
  finalIncome.textContent = "₹ " + totalIncome;
  finalExpense.textContent = "₹ " + totalExpense;
}

function showAll(){
  displayList(allExpenses);
  allExpensesChart();
  }

function allExpensesChart(){
  let data1 = percentage(totalBalance,totalIncome)
  let data2 = percentage(totalExpense,totalIncome)
  let data =[data1,data2];
  let labels = ["BALANCE","EXPENSES"];
  addData(chart1,labels,data);
}
function addData(chart,labels, data) {
  chart.data.labels= [...labels]
  chart.data.datasets.forEach((dataset) => {
      dataset.data = [...data]
  });
  chart.update();
}

function showExpense(){
  const filteredExpense = allExpenses.filter((item)=> item.type ==="EXPENSE")
  displayList(filteredExpense);
  
}

function showIncome(){
  const filteredExpense = allExpenses.filter((item)=> item.type ==="INCOME")
  displayList(filteredExpense);
}




const labels = ["Balance","Expense"]
const datas =[100,0];
const colors =[ "#49A9EA","#36CAAB", "#FBBF24"]

  let chart1 = new Chart(chart,{
    type :"doughnut",
    data:{
      labels: labels,
      datasets : [{
        data : datas,
        backgroundColor:colors
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color:"white"
        }
        },
      }
    },
  })


function createList({ description, amount, momen, id }) {
  return `<li class="list-group-item d-flex justify-content-between">
    <div class="d-flex flex-column">
        ${description}
        <small class="text-muted">${momen}</small>
    </div>
    <div>
        <span class="px-5">
            ${amount}
        </span>
        <button type="button" class="btn btn-outline-danger btn-sm" onClick="deleteItem(${id})">
            <i class="fas fa-trash-alt"></i>
        </button>
    </div>
</li>`;
}



form.addEventListener("submit", addExpense, false);
signOutBtn.addEventListener("click", signOut, false);
expenseOnly.addEventListener("click", showExpense, false);
incomeOnly.addEventListener("click", showIncome, false);
allTransfers.addEventListener("click", showAll, false);
