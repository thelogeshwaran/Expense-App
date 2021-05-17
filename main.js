let button = document.querySelector("#btnContainer")
let inputAmount = document.querySelector("#inputAmount")
let inputDescription = document.querySelector("#inputDesc")
let finalExpense = document.querySelector("#totalExpense")
let table = document.querySelector("#expenseTable")

let totalExpense = 0;
finalExpense.textContent = totalExpense;
const allExpenses = [];

function addExpense(){
    const expenseItem={};

    const amount = inputAmount.value;
    const expense = parseInt(amount,10);
    const description = inputDescription.value

    expenseItem.amount = expense;
    expenseItem.description = description;
    expenseItem.moment = new Date();

    allExpenses.push(expenseItem);

    totalExpense = totalExpense + expense;
    finalExpense.textContent = totalExpense;

    console.log(allExpenses)
    
    const expenseArray = allExpenses.map((item) => createList(item))

    const joinedHtml = expenseArray.join("")
    table.innerHTML = joinedHtml

}
button.addEventListener("click", addExpense,false);

function getDatetoString(moment){
    return moment.toLocaleDateString("en-US",{year: 'numeric', month: 'long', day: 'numeric'})
}


function createList({description, amount, moment}){
    return `<li class="list-group-item d-flex justify-content-between">
    <div class="d-flex flex-column">
        ${description}
        <small class="text-muted">${getDatetoString(moment)}</small>
    </div>
    <div>
        <span class="px-5">
            ${amount}
        </span>
        <button type="button" class="btn btn-outline-danger btn-sm">
            <i class="fas fa-trash-alt"></i>
        </button>
    </div>
</li>`
}