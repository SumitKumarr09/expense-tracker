let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

const form = document.getElementById("transactionForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const description =
        document.getElementById("description").value;

    const amount =
        Number(document.getElementById("amount").value);

    const type =
        document.getElementById("type").value;

    const category =
        document.getElementById("category").value;

    const date =
        document.getElementById("date").value;

    const transaction = {
        id: Date.now(),
        description,
        amount,
        type,
        category,
        date
    };

    transactions.push(transaction);

    saveData();

    form.reset();

    displayTransactions();
    updateSummary();
});


function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


function displayTransactions() {

    const list =
        document.getElementById("transactionList");

    const search =
        document.getElementById("search").value.toLowerCase();

    const filterType =
        document.getElementById("filterType").value;

    list.innerHTML = "";

    const filteredTransactions = transactions.filter(t => {

        const matchesSearch =
            t.description.toLowerCase().includes(search);

        const matchesType =
            filterType === "all" ||
            t.type === filterType;

        return matchesSearch && matchesType;
    });

    filteredTransactions.forEach(t => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${t.date}</td>

            <td>${t.description}</td>

            <td>${t.category}</td>

            <td>${t.type}</td>

            <td class="${
                t.type === "income"
                    ? "income-text"
                    : "expense-text"
            }">
                ${t.type === "income" ? "+" : "-"} ₹${t.amount}
            </td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${t.id})">
                    Delete
                </button>
            </td>
        `;

        list.appendChild(row);
    });
}


function deleteTransaction(id) {

    transactions =
        transactions.filter(t => t.id !== id);

    saveData();

    displayTransactions();
    updateSummary();
}


function updateSummary() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {

        if (t.type === "income") {
            totalIncome += t.amount;
        } else {
            totalExpense += t.amount;
        }
    });

    const balance = totalIncome - totalExpense;

    document.getElementById("income").innerText =
        ₹${totalIncome};

    document.getElementById("expense").innerText =
        ₹${totalExpense};

    document.getElementById("balance").innerText =
        ₹${balance};
}


document
    .getElementById("search")
    .addEventListener("input", displayTransactions);

document
    .getElementById("filterType")
    .addEventListener("change", displayTransactions);


// Load data when page opens

displayTransactions();
updateSummary();