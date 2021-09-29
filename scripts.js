const Modal = {
    toogle() {
        document.querySelector('#modal-background')
        .classList
        .toggle('active');
    }
};

const webStorage = {
    get() {
        return JSON.parse(localStorage.getItem('dev.finances-transactions')) || []
    },

    set(transactions) {
        localStorage.setItem('dev.finances-transactions', JSON.stringify(transactions));
    }
}

const Transactions = [
    {
        description: 'Desenvolvimento de site',
        value: 1200000,
        date: '13/04/2021'
    },
    {
        description: 'Hambúrguer',
        value: -5900,
        date: '10/04/2021'
    },
    {
        description: 'Aluguel do apartamento',
        value: -120000,
        date: '27/03/2021'
    },
    {
        description: 'Computador',
        value: 540000,
        date: '15/03/2021'
    },
    {
        description: 'Santander',
        value: -612000,
        date: '15/03/2021'
    }
];

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100;
        return value;
    },

    formatDate(date) {
        const splitedDate = date.split("-")
        return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
    },

    formatValue(value, noSignal=false) {

        if (noSignal) {
            value = -(value)
        }

        let decimalValue = value / 100;

        let format = decimalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});

        return format
    }
};

const Balance = {
    income() {
        let incomeValue = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.value > 0) {
                incomeValue += transaction.value;
            }
        })
        return incomeValue;
    },

    expense() {
        let expenseValue = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.value < 0) {
                expenseValue += transaction.value;
            }
        })
        if (expenseValue === 0) {
            expenseValue = -expenseValue;
        }

        return expenseValue;
    },

    total() {
        const total = Balance.income() + Balance.expense();
        if (total < 0 ) {
            DOM.totalRed();
        } else if (total > 0){
            DOM.totalGreen();
        } else {
            DOM.totalZero();
        }

        return Balance.income() + Balance.expense()
    },

};

const Transaction = {

    all: webStorage.get(),

    add(object) {
        Transaction.all.push(object)
        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload();
    },

    clear() {
        DOM.transactionsContainer.innerHTML = ""
    }
};

const DOM = {
    addBalance() {
        document.querySelector('#income-value').innerHTML = Utils.formatValue(Balance.income());
        document.querySelector('#expense-value').innerHTML = Utils.formatValue(Balance.expense(), true);
        document.querySelector('#total-value').innerHTML = Utils.formatValue(Balance.total());
    }, 
    
    transactionsContainer: document.querySelector('#table-body'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        let innerClass = (transaction.value > 0 ? "income" : "expense")

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${innerClass}">${Utils.formatValue(transaction.value)}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Icone de deletar transação" draggable="false">
        </td>`

        return html
    },

    totalRed() {
        document.querySelector('#total')
        .classList
        .add('total-red');
        document.querySelector('#total')
        .classList
        .remove('total-green');
    },

    totalGreen() {
        document.querySelector('#total')
        .classList
        .remove('total-red');
        document.querySelector('#total')
        .classList
        .add('total-green');
    },

    totalZero() {
        document.querySelector('#total')
        .classList
        .remove('total-red');
        document.querySelector('#total')
        .classList
        .remove('total-green');
    }
};

const Form = {

    description: document.querySelector('#input-description'),
    value: document.querySelector('#input-value'),
    date: document.querySelector('#input-date'),

    getValues() {
        return {
            description: Form.description.value,
            value: Form.value.value,
            date: Form.date.value,
         }
    },

    formatValues() {
        let { description, value, date } = Form.getValues()
        
        value = Utils.formatAmount(value)

        date = Utils.formatDate(date)     

        return {
            description,
            value,
            date
        }
    },
    
    validateFields() {
        const {description, value, date} = Form.getValues()
        if (description.trim() === "" || 
            value.trim() === "" || 
            date.trim() === "") {
                throw new Error("Por favor, preencha todos os campos!")
            }
    },

    clearFields() {
        Form.description.value = "";
        Form.value.value = "";
        Form.date.value = "";
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields();
            const transaction = Form.formatValues();
            Transaction.add(transaction)
            Form.clearFields();
            Modal.toogle();
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach(function(transaction, index) {
            DOM.addTransaction(transaction, index);
        });
        DOM.addBalance();
        webStorage.set(Transaction.all);
    },

    reload() {
        Transaction.clear();
        App.init()
    }
};

App.init()