const Modal = {
    toogle() {
        document.querySelector('#modal-background')
        .classList
        .toggle('active');
    }
}

/* ------------- TRANSACTIONS ------------ */

const Transactions = [
    {
        id: 1,
        description: 'Desenvolvimento de site',
        value: 1200000,
        data: '13/04/2021'
    },
    {
        id: 2,
        description: 'Hambúrguer',
        value: -5900,
        data: '10/04/2021'
    },
    {
        id: 3,
        description: 'Aluguel do apartamento',
        value: -120000,
        data: '27/03/2021'
    },
    {
        id: 4,
        description: 'Computador',
        value: 540000,
        data: '15/03/2021'
    },
    {
        id: 5,
        description: 'Santander',
        value: -612000,
        data: '15/03/2021'
    }
]

/* ------------- UTILS ------------ */

const Utils = {
    formatValue(value, noSignal=false) {

        if (noSignal) {
            value = -(value)
        }

        let decimalValue = value / 100;

        let format = decimalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});

        return format
    }
}

/* ------------- BALANCE ------------ */


const Balance = {
    income() {
        let incomeValue = 0;
        Transactions.forEach(transaction => {
            if (transaction.value > 0) {
                incomeValue += transaction.value;
            }
        })
        return incomeValue;
    },

    expense() {
        let expenseValue = 0;
        Transactions.forEach(transaction => {
            if (transaction.value < 0) {
                expenseValue += transaction.value;
            }
        })
        return expenseValue;
    },

    total() {
        return Balance.income() + Balance.expense()
    },

}

/* ------------- TRANSACTION ------------ */


const Transaction = {
 
}

/* ------------- DOM ------------ */


const DOM = {
    addBalance() {
        document.querySelector('#income-value').innerHTML = Utils.formatValue(Balance.income());
        document.querySelector('#expense-value').innerHTML = Utils.formatValue(Balance.expense(), true);
        document.querySelector('#total-value').innerHTML = Utils.formatValue(Balance.total());
    }, 
    
    transactionsContainer: document.querySelector('#table-body'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction);

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction) {
        let innerClass = (transaction.value > 0 ? "income" : "expense")

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${innerClass}">${Utils.formatValue(transaction.value)}</td>
        <td class="date">${transaction.data}</td>
        <td>
            <img src="./assets/minus.svg" alt="Icone de deletar transação" draggable="false">
        </td>`

        return html
    }
}

/* ------------- CHAMADAS ------------ */

DOM.addBalance()

Transactions.forEach(function(transaction) {
    DOM.addTransaction(transaction);
});
