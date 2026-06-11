let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let myChart;
let editId = null;

const form = document.getElementById('transaction-form');
const textInput = document.getElementById('text-input');
const amountInput = document.getElementById('amount-input');
const typeInput = document.getElementById('type-input');
const transactionList = document.getElementById('transaction-list');
const balance = document.getElementById('total-balance');
const income = document.getElementById('total-income');
const expense = document.getElementById('total-expense');
const submitBtn = form.querySelector('.btn');

function updateChart(income, expense, balance) {
    const ctx = document.getElementById('expense-chart').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses', 'Current Balance'],
            datasets: [{
                data: [income, expense, balance],
                backgroundColor: ['#10b981', '#ef4444', '#6366f1'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

        }
    });
}

function updateDOM() {
    transactionList.innerHTML = '';

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {
        const sign = transaction.type === 'income' ? '+' : '-';
        const itemClass = transaction.type === 'income' ? 'income-item' : 'expense-item';

        const li = document.createElement('li');
        li.classList.add(itemClass);

        const textSpan = document.createElement('span');
        textSpan.classList.add('transaction-text');
        textSpan.innerText = transaction.text;

        const amountSpan = document.createElement('span');
        amountSpan.classList.add('transaction-amount');
        amountSpan.innerText = `${sign}$${Math.abs(transaction.amount).toFixed(2)}`;

        const btnContainer = document.createElement('div');
        btnContainer.classList.add('action-btns');

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerText = '✏️';
        editBtn.onclick = function () {
            startEdit(transaction.id);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerText = 'X';
        deleteBtn.onclick = function () {
            deleteTransaction(transaction.id);
        };

        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);

        li.appendChild(textSpan);
        li.appendChild(amountSpan);
        li.appendChild(btnContainer);

        transactionList.appendChild(li);

        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    const netBalance = totalIncome - totalExpense;

    balance.innerText = `$${netBalance.toFixed(2)}`;
    income.innerText = `$${totalIncome.toFixed(2)}`;
    expense.innerText = `$${totalExpense.toFixed(2)}`;

    localStorage.setItem('transactions', JSON.stringify(transactions));

    // FIX: Yahan netBalance pass nahi ho raha tha, ab yeh totalIncome aur totalExpense ke saath chart me dikhega
    updateChart(totalIncome, totalExpense, netBalance);
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (textInput.value.trim() === '' || Number(amountInput.value) <= 0) {
        alert('Please enter valid details and amount greater than 0.');
        return;
    }

    if (editId !== null) {
        transactions = transactions.map(t => {
            if (t.id === editId) {
                return {
                    id: t.id,
                    text: textInput.value,
                    amount: parseFloat(amountInput.value),
                    type: typeInput.value
                };
            }
            return t;
        });
        editId = null;
        submitBtn.innerText = 'Add Transaction';
    } else {
        const newTransaction = {
            id: Date.now(),
            text: textInput.value,
            amount: parseFloat(amountInput.value),
            type: typeInput.value
        };
        transactions.push(newTransaction);
    }

    updateDOM();
    textInput.value = '';
    amountInput.value = '';
});

function startEdit(id) {
    const transactionToEdit = transactions.find(t => t.id === id);
    if (transactionToEdit) {
        textInput.value = transactionToEdit.text;
        amountInput.value = transactionToEdit.amount;
        typeInput.value = transactionToEdit.type;

        editId = id;
        submitBtn.innerText = 'Update Transaction';
    }
}

function deleteTransaction(id) {
    if (editId === id) {
        editId = null;
        submitBtn.innerText = 'Add Transaction';
        form.reset();
    }
    transactions = transactions.filter(t => t.id !== id);
    updateDOM();
}

updateDOM();