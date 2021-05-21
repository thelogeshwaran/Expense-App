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
let category = document.querySelector("#category");
let statistics = document.querySelector("#stats-header");

let total = {};
total.totalBalance = 0;
total.totalIncome = 0;
total.totalExpense = 0;

displayFinalAmount();
let allData = [];
let allIncome = {};
let allExpenses = {};
categories = [
  "Cloths",
  "Fuel",
  "Entertainment",
  "Gifts",
  "Holidays",
  "Kids",
  "Shopping",
  "Sports",
  "Travel",
  "Misc",
  "Eating Out",
];

incomeCategories = ["Allowance", "Salary", "Bonus", "Petty Cash", "Other"];

function addExpense(e) {
  e.preventDefault();
  const expenseItem = {};

  const amount = inputAmount.value;
  const expense = parseInt(amount, 10);
  const description = inputDescription.value;
  const categoryValue = category.value;

  expenseItem.amount = expense;
  expenseItem.description = description;
  expenseItem.moment = new Date().toLocaleString();
  expenseItem.id = new Date().valueOf();
  expenseItem.type = type.value;
  expenseItem.category = categoryValue;

  addExpenseData(expenseItem);
  allData.push(expenseItem);
  changeExpense(expenseItem, "ADD");
  updateBackend();
  displayFinalAmount();
  showAll();
  form.reset();
}

function deleteItem(id) {
  allData.map((item) => {
    if (item.id === id) {
      let position = allData.indexOf(item);
      allData.splice(position, 1);
      changeExpense(item, "DELETE");
      removeExpenseData(item);
    }
  });
  updateBackend();
  displayFinalAmount();
  showAll();
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
        const document = snap.data();
        updateFrontEnd(document);
      });
  } else {
    location = "index.html";
  }
});

function addExpenseData(expenseItem) {
  switch (expenseItem.type) {
    case "INCOME":
      allIncome[expenseItem.category] && allIncome[expenseItem.category].data
        ? allIncome[expenseItem.category].data.push(expenseItem)
        : ((obj = {}),
          (obj.data = [expenseItem]),
          (allIncome[expenseItem.category] = obj));
      break;
    case "EXPENSE":
      allExpenses[expenseItem.category] &&
      allExpenses[expenseItem.category].data
        ? allExpenses[expenseItem.category].data.push(expenseItem)
        : ((obj = {}),
          (obj.data = [expenseItem]),
          (allExpenses[expenseItem.category] = obj));
    default:
      break;
  }
}

function removeExpenseData(item) {
  switch (item.type) {
    case "INCOME":
      const data = allIncome[item.category].data.filter(
        (data) => data.id !== item.id
      );
      allIncome[item.category].data = [...data];
      break;

    case "EXPENSE":
      const filteredData = allExpenses[item.category].data.filter(
        (data) => data.id !== item.id
      );
      allExpenses[item.category].data = [...filteredData];
    default:
      break;
  }
}

function changeExpense(expenseItem, type) {
  switch (type) {
    case "ADD":
      expenseItem.type === "INCOME"
        ? ((total.totalIncome = total.totalIncome + expenseItem.amount),
          (total.totalBalance = total.totalBalance + expenseItem.amount))
        : ((total.totalExpense = total.totalExpense + expenseItem.amount),
          (total.totalBalance = total.totalBalance - expenseItem.amount));
      break;
    case "DELETE":
      expenseItem.type === "INCOME"
        ? ((total.totalIncome = total.totalIncome - expenseItem.amount),
          (total.totalBalance = total.totalBalance - expenseItem.amount))
        : ((total.totalExpense = total.totalExpense - expenseItem.amount),
          (total.totalBalance = total.totalBalance + expenseItem.amount));
      break;
    default:
      break;
  }
}

function updateBackend() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .update({
          data: total,
          allIncome: allIncome,
          allExpenses: allExpenses,
        })
        .then(() => {})
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      console.log("user is not signed in to add todos");
    }
  });
}

function updateFrontEnd(data) {
  incomeCategories.map(
    (item) =>
      data.allIncome &&
      data.allIncome[item] &&
      data.allIncome[item]?.data?.map((item) => {
        allData.push(item);
      })
  );
  categories.map(
    (item) =>
      data.allExpenses &&
      data.allExpenses[item] &&
      data.allExpenses[item]?.data?.map((item) => {
        allData.push(item);
        moment = parseInt(item.moment);
      })
  );

  allIncome = data.allIncome ? data?.allIncome : allIncome;
  allExpenses = data.allExpenses ? data?.allExpenses : allExpenses;
  total = Object.keys(data.data).length > 0 ? data?.data : total;

  allData.sort((a, b) => {
    return new Date(a.moment) - new Date(b.moment);
  });

  showAll();
  displayFinalAmount();
  displayCategory(categories);
}

function getDatetoString(moment) {
  return moment.toLocaleString();
}

function percentage(percent, total) {
  if (isNaN(percent) || isNaN(total)) {
    return 0;
  } else {
    return ((percent / total) * 100).toFixed(3);
  }
}

function displayList(array) {
  const expenseArray = array.map((item) => createList(item));
  const joinedHtml = expenseArray.join("");
  table.innerHTML = joinedHtml;
}

function displayFinalAmount() {
  if (total) {
    finalBalance.textContent =
      "₹ " + total.totalBalance ? total.totalBalance : 0;
    finalIncome.textContent = "₹ " + total.totalIncome ? total.totalIncome : 0;
    finalExpense.textContent =
      "₹ " + total.totalExpense ? total.totalExpense : 0;
  }
}

function displayCategory(item) {
  const categoryArray = item.map((item) => createCategory(item));
  categoryArray.unshift(`<option value="">Category</option>`);
  const joinedHtml = categoryArray.join("");
  category.innerHTML = joinedHtml;
}

function categoryChange() {
  switch (type.value) {
    case "INCOME":
      displayCategory(incomeCategories);
      break;
    case "EXPENSE":
      displayCategory(categories);
    default:
      break;
  }
}

function showAll() {
  displayList(allData);
  allDataChart();
  statistics.textContent = "All";
}

function allDataChart() {
  let data1 = percentage(total?.totalBalance, total?.totalIncome);
  let data2 = percentage(total?.totalExpense, total?.totalIncome);
  let data = [data1, data2];
  let labels = ["BALANCE", "EXPENSES"];
  let colors = ["#36CAAB", "#FBBF24"];
  addData(chart1, labels, data, colors);
}

function addData(chart, labels, data, colors) {
  chart.data.labels = [...labels];
  chart.data.datasets.forEach((dataset) => {
    dataset.data = [...data];
    dataset.backgroundColor = [...colors];
  });

  chart.update();
}

function showIncome() {
  const filteredExpense = allData.filter((item) => item.type === "INCOME");
  displayList(filteredExpense);
  allIncomeChart();
  statistics.textContent = "Income";
}

function allIncomeChart() {
  let data = [];
  let labels = [];
  let colors = [];
  incomeCategories.map((item) => {
    allIncome[item] &&
      allIncome[item].data.length > 0 &&
      ((amountData = 0),
      (amountData = allIncome[item].data.map((data) => data.amount)),
      (singlecategory = amountData.reduce((a, b) => a + b, 0)),
      (percentageData = percentage(singlecategory, total.totalIncome)),
      data.push(percentageData),
      labels.push(item));
    colors.push(randomColor());
  });
  addData(chart1, labels, data, colors);
}

function showExpense() {
  const filteredExpense = allData.filter((item) => item.type === "EXPENSE");
  displayList(filteredExpense);
  allExpensesChart();
  statistics.textContent = "Expense";
}

function allExpensesChart() {
  let data = [];
  let labels = [];
  let colors = [];

  categories.map((item) => {
    allExpenses[item] &&
      allExpenses[item].data.length > 0 &&
      ((amountData = 0),
      (amountData = allExpenses[item].data.map((data) => data.amount)),
      (singlecategory = amountData.reduce((a, b) => a + b, 0)),
      (percentageData = percentage(singlecategory, total.totalExpense)),
      data.push(percentageData),
      labels.push(item));
    colors.push(randomColor());
  });
  addData(chart1, labels, data, colors);
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

const labels = ["Balance", "Expense"];
const datas = [100, 0];
const colors = ["#49A9EA", "#36CAAB", "#FBBF24"];

let chart1 = new Chart(chart, {
  type: "doughnut",
  data: {
    labels: labels,
    datasets: [
      {
        data: datas,
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
    },
  },
});

function createCategory(item) {
  return `<option value="${item}">${item}</option>`;
}
function createList({ description, category, amount, moment, id, type }) {
  return `<li class="list-group-item d-flex justify-content-between">
    <div class="d-flex flex-column info">
        ${category}
        <small class="text-muted">${description}</small>
        <small class="text-muted">${moment}</small>
    </div>
    <div class="delete-body">
        <span class="amount" style="color:${
          type === "INCOME" ? "green" : "red"
        };">
        ₹ ${amount}
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
type.addEventListener("change", categoryChange, false);
