import React, { useState, useEffect } from "react"


const SummaryBox = ({ events }) => {
    const [expenseCategoriesTotal, setExpenseCategoriesTotal] = useState({})

    // Laskee kaikki menoerät omissa luokissaan yhteen
    useEffect(() => {
        const totals = {}

        events.forEach(event => {
            if (event.is_income === false) {
                const category = event.category
                if (totals[category]) {
                    totals[category] += Math.abs(event.sum)
                } else {
                    totals[category] = Math.abs(event.sum)
                }
            }
        })
        setExpenseCategoriesTotal(totals)
    }, [events])

    // Laskee kokonaistulot, kokonaismenot ja balanssin
    const totalIncome = events
        .filter(event => event.is_income === true) // Suodatetaan vain income-tapahtumat
        .reduce((sum, event) => sum + Math.abs(event.sum), 0) // Lasketaan yhteen absoluuttiset summat

    const totalExpenses = events
        .filter(event => event.is_income === false) // Suodatetaan vain expense-tapahtumat
        .reduce((sum, event) => sum + Math.abs(event.sum), 0)

    const balance = Math.round((totalIncome - totalExpenses) * 100) / 100


    // Lajittelee suurimmasta pienimpään
    const sortedCategories = Object.entries(expenseCategoriesTotal)
    .sort((a, b) => b[1] - a[1])


return (
    <div className="summary-box">
        <p><strong>Summary of the month:</strong></p>
        <div className="summary-grid">
            <div className="summary-labels">
                <p>Incomes:</p>
                <p>Expenses:</p>
                <p>Balance:</p>
            </div>
            <div className="summary-values">
                <p>{totalIncome.toFixed(2)} €</p>
                <p>{totalExpenses.toFixed(2)} €</p>
                <p>{balance.toFixed(2)} €</p>
            </div>
            <div className="category-summary">
            {sortedCategories.map(([category, amount], index) => (
            <p key={index}>{category}: {amount.toFixed(2)} €</p>
                ))}
            </div>
        </div>
    </div>
)
}


export default SummaryBox