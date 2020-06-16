const $month = document.querySelector('.budget__title--month');

const $budgetValue = document.querySelector('.budget__value');

const $budgetIncome = document.querySelector('.budget__income--value');

const $budgetExpenses = document.querySelector('.budget__expenses--value');
const $budgetExpensesPercentage = document.querySelector('.budget__expenses--percentage');

const $type = document.querySelector('.add__type');
const $description = document.querySelector('.add__description');
const $value = document.querySelector('.add__value');
const $addBtn = document.querySelector('.add__btn');

const $incomeList = document.querySelector('.income__list');
const $expensesList = document.querySelector('.expenses__list');

let $incomeDeleteBtn = document.querySelectorAll('.income__list .item__delete--btn');
let $expensesDeleteBtn = document.querySelectorAll('.expenses__list .item__delete--btn');

const Expense = function (description, value) {
    this.description = description,
        this.value = value
};

const Income = function (description, value) {
    this.description = description,
        this.value = value
};

// localStorage.setItem('budgetValue', JSON.stringify(0));
// localStorage.setItem('income', JSON.stringify([]));
// localStorage.setItem('expenses', JSON.stringify([]));

// Get current month and display it
function displayMonth() {
    const monthNum = new Date().getMonth();
    switch (monthNum) {
        case 0:
            return $month.innerHTML = "January";
        case 1:
            return $month.innerHTML = "February";
        case 2:
            return $month.innerHTML = "March";
        case 3:
            return $month.innerHTML = "April";
        case 4:
            return $month.innerHTML = "May";
        case 5:
            return $month.innerHTML = "June";
        case 6:
            return $month.innerHTML = "July";
        case 7:
            return $month.innerHTML = "August";
        case 8:
            return $month.innerHTML = "September";
        case 9:
            return $month.innerHTML = "October";
        case 10:
            return $month.innerHTML = "November";
        case 11:
            return $month.innerHTML = "December";
        default:
            return;
    }
}

displayMonth();

// Inite the UI controller
UIController();

function saveDataToLocalStorage(budgetValue, income, expenses) {
    localStorage.setItem('budgetValue', JSON.stringify(budgetValue));
    localStorage.setItem('income', JSON.stringify(income));
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function updateList(list, arr) {
    list.innerHTML = '';

    arr.forEach(el => {
        el.value = String(el.value);
        if (el.value.length > 3) {
            el.value = el.value.substr(0, el.value.length - 3) + ',' + el.value.substr(el.value.length - 3, 3); 
        }

        list.innerHTML +=
            `<div class="item clearfix">
                <div class="item__description">${el.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${el.value}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;
    })
}

// UI controller
function UIController() {
    // Get data from local storage
    let budgetValue;
    let income = JSON.parse(localStorage.getItem('income'));
    let expenses = JSON.parse(localStorage.getItem('expenses'));

    // Calculate budget income, budget expenses and budgetExpensesPercentage
    let budgetIncome = 0;
    let budgetExpenses = 0;
    let budgetExpensesPercentage = 0;

    income.forEach(element => {
        budgetIncome += element.value;
    });

    expenses.forEach(element => {
        budgetExpenses += element.value;
    });

    budgetValue = budgetIncome - budgetExpenses;

    budgetExpensesPercentage = budgetExpenses / (budgetIncome);
    budgetExpensesPercentage = Math.round(budgetExpensesPercentage * 100)

    // Display data
    budgetValue = String(budgetValue);
    budgetIncome = String(budgetIncome);
    budgetExpenses = String(budgetExpenses);
    
    if (budgetValue.length > 3) {
        budgetValue = budgetValue.substr(0, budgetValue.length - 3) + ',' + budgetValue.substr(budgetValue.length - 3, 3); 
    }
    
    if (budgetIncome.length > 3) {
        budgetIncome = budgetIncome.substr(0, budgetIncome.length - 3) + ',' + budgetIncome.substr(budgetIncome.length - 3, 3); 
    }
    
    if (budgetExpenses.length > 3) {
        budgetExpenses = budgetExpenses.substr(0, budgetExpenses.length - 3) + ',' + budgetExpenses.substr(budgetExpenses.length - 3, 3); 
    }
    

    $budgetValue.innerHTML = budgetValue;
    $budgetIncome.innerHTML = budgetIncome;
    $budgetExpenses.innerHTML = '-' + budgetExpenses;
    $budgetExpensesPercentage.innerHTML = budgetExpensesPercentage + '%';

    updateList($incomeList, income);
    updateList($expensesList, expenses);

    // Update $incomeDeleteBtn and $expensesDeleteBtn
    $incomeDeleteBtn = document.querySelectorAll('.income__list .item__delete--btn');
    $expensesDeleteBtn = document.querySelectorAll('.expenses__list .item__delete--btn');

    // Set up event listener
    setupEventListenter();
}

// Budget controller
function addNew() {

    // Get input type, description and value
    let type = $type.value;
    let description = $description.value;
    let value = parseInt($value.value);

    // Create new Income or Expense Object
    let data;
    if (type === 'inc') {
        data = new Income(description, value);
    } else if (type === 'exp') {
        data = new Expense(description, value);
    }

    // Calculate new budget value
    let budgetValue = parseInt(JSON.parse(localStorage.getItem('budgetValue')));
    if (type === 'inc') {
        budgetValue += value;
    } else if (type === 'exp') {
        budgetValue -= value;
    }

    // Add new data to income or expenses
    income = JSON.parse(localStorage.getItem('income'));
    expenses = JSON.parse(localStorage.getItem('expenses'));


    if (type === 'inc') {
        if (income !== null) {
            income = [...income, data];
        } else {
            income = data;
        }
    } else if (type === 'exp') {
        if (expenses !== null) {
            expenses = [...expenses, data];
        } else {
            expenses = data;
        }
    }

    // Save input details to local storage
    saveDataToLocalStorage(budgetValue, income, expenses);

    // Update $incomeDeleteBtn and $expensesDeleteBtn
    $incomeDeleteBtn = document.querySelectorAll('.income__list .item__delete--btn');
    $expensesDeleteBtn = document.querySelectorAll('.expenses__list .item__delete--btn');

    // Set up event listener
    setupEventListenter();
}


function delIncomeItem(item) {

    const container = item.parentElement.parentElement.parentElement;

    // Get the delete item data
    let description = container.querySelector('.item__description').innerHTML;
    let value = parseInt(container.querySelector('.item__value').innerHTML);

    // Retrieve data from local storage
    let budgetValue = parseInt(JSON.parse(localStorage.getItem('budgetValue')));
    let income = Array.from(JSON.parse(localStorage.getItem('income')));
    let expenses = Array.from(JSON.parse(localStorage.getItem('expenses')));

    // Delete data from local storage
    income = income.filter(el => (el.description !== description && el.value !== value));

    budgetValue = budgetValue - value;

    saveDataToLocalStorage(budgetValue, income, expenses);

    // Update UI
    UIController();

    // Set up event listener
    setupEventListenter();
}

function delExpenseItem(item) {

    const container = item.parentElement.parentElement.parentElement;

    // Get the delete item data
    let description = container.querySelector('.item__description').innerHTML;
    let value = parseInt(container.querySelector('.item__value').innerHTML);

    // Retrieve data from local storage
    let budgetValue = parseInt(JSON.parse(localStorage.getItem('budgetValue')));
    let income = Array.from(JSON.parse(localStorage.getItem('income')));
    let expenses = Array.from(JSON.parse(localStorage.getItem('expenses')));

    // Delete data from local storage
    expenses = expenses.filter(el => (el.description !== description && el.value !== value));

    budgetValue = budgetValue + value;

    saveDataToLocalStorage(budgetValue, income, expenses);

    // Update UI
    UIController();

    // Set up event listener
    setupEventListenter();
}

function setupEventListenter() {
    $incomeDeleteBtn.forEach(el => {
        el.addEventListener('click', () => {
            delIncomeItem(el);
        })
    });
    
    $expensesDeleteBtn.forEach(el => {
        el.addEventListener('click', () => {
            delExpenseItem(el);
        })
    });  
}


// Add event listener
$addBtn.addEventListener('click', () => {
    addNew();
    UIController();
})

setupEventListenter();