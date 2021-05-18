let button = document.querySelector("#btnContainer");
let inputAmount = document.querySelector("#inputAmount");
let inputDescription = document.querySelector("#inputDesc");
let finalExpense = document.querySelector("#totalExpense");
let table = document.querySelector("#expenseTable");
let signOutBtn = document.querySelector("#signout");

let totalExpense = 0;
finalExpense.textContent = totalExpense;
const allExpenses = [];


function addExpense() {
  const expenseItem = {};

  const amount = inputAmount.value;
  const expense = parseInt(amount, 10);
  const description = inputDescription.value;

  expenseItem.amount = expense;
  expenseItem.description = description;
  expenseItem.momen = new Date().toDateString();
  expenseItem.id = new Date().valueOf();

  allExpenses.push(expenseItem);

  totalExpense = totalExpense + expense;

  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .update({ data: [...allExpenses], totalExpense: totalExpense })
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

  displayFinalAmount(totalExpense);
  displayList(allExpenses);
  console.log(allExpenses);
}

function signOut() {
  auth.signOut();
}

button.addEventListener("click", addExpense, false);
signOutBtn.addEventListener("click", signOut, false);

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((snap) => {
        snap?.data()?.data.map((item) => {
          allExpenses.push(item);
        });
        console.log(allExpenses);
        displayList(allExpenses);
        totalExpense = snap.data().totalExpense;
        displayFinalAmount(snap.data().totalExpense);
      });
  } else {
    location = "signin.html";
  }
});

function getDatetoString(moment) {
  return moment.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function deleteItem(moment) {
  allExpenses.map((item) => {
    if (item.id === moment) {
      let position = allExpenses.indexOf(item);
      allExpenses.splice(position, 1);
      totalExpense = totalExpense - item.amount;
    }
  });

  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .update({ data: [...allExpenses], totalExpense: totalExpense })
        .then(() => {
          console.log("removed");
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  });
  displayList(allExpenses);
  displayFinalAmount(totalExpense);
  console.log(allExpenses);
}

function displayList(array) {
  const expenseArray = array.map((item) => createList(item));
  const joinedHtml = expenseArray.join("");
  table.innerHTML = joinedHtml;
}

function displayFinalAmount(amount) {
  finalExpense.textContent = amount;
}

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
