let transactions = [];
let myChart;

const form = document.getElementById('transaction-form');
const textInput = document.getElementById('text-input');
const amountInput = document.getElementById('amount-input');
const typeInput = document.getElementById('type-input');
const transactionList = document.getElementById('transaction-list');
const balance = document.getElementById('total-balance');
const income = document.getElementById('total-income');
const expense = document.getElementById('total-expense');


function updateChart(income, expense) {
    const ctx = document.getElementById('expense-chart').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#22c55e', '#ef4444'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
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
        li.innerHTML = `
            ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
            <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">X</button>
        `;
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

    updateChart(totalIncome, totalExpense);
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (textInput.value.trim() === '' || Number(amountInput.value) <= 0) {
        alert('Please enter valid details and amount greater than 0.');
        return;
    }

    const newTransaction = {
        id: Date.now(),
        text: textInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value
    };

    transactions.push(newTransaction);
    updateDOM();
    textInput.value = '';
    amountInput.value = '';
});

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateDOM();
}

updateDOM();