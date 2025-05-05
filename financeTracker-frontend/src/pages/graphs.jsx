import { React, useState, useEffect } from 'react'
import eventService from '../services/events'
import NavBar from '../components/navbar'
import MonthMenu from '../components/monthMenu'
import { PieChart, Pie, Cell, Tooltip } from "recharts"


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const COLORS = ["#acb1b3", "#c63b35", "#88b6c5", "#CDBA47", "#FF8C00", "#483D8B", "#2E8B57", "#a7987b", "#4682B4", "#556B2F", "#267c7c", "#7f2c2c", "#e47fbd", "#45657e"]



const Graphs = ({ events, setEvents }) => {
    const currentDate = new Date()
    const defaultMonth = months[currentDate.getMonth()]
    const defaultYear = String(currentDate.getFullYear())

    const [selectedMonth, setSelectedMonth] = useState(defaultMonth)
    const [selectedYear, setSelectedYear] = useState(defaultYear)
    const [showPercentages, setShowPercentages] = useState(false)

    // Säätää graafin koko jos kyseessä on mobiililaite
    const isMobile = window.innerWidth < 768;
    const pieRadius = isMobile ? 100 : 150;

    // Etsii kaikki eventit
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await eventService.getAll()
                setEvents(eventsData)
                console.log("Kaikki tapahtumat:", eventsData)
            } catch (error) {
                console.error("Failed to fetch events:", error)
            }
        }
        fetchEvents()
    }, [setEvents])



    // Filtteröi eventit valitut kuukauden/vuoden mukaan
    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.date)
        const eventMonth = months[eventDate.getMonth()]
        const eventYear = String(eventDate.getFullYear())

        return eventMonth === selectedMonth && eventYear === selectedYear
    })


    // Menokategorioiden yhteenlaskeminen
    const getExpenseTotals = (events) => {
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
        // Muutetaan taulukoksi
        return Object.entries(totals).map(([category, total]) => ({
            name: category,
            value: total,
        }))
    }

    // Tulokategorioiden yhteenlaskeminen
    const getIncomeTotals = (events) => {
        const totals = {}

        events.forEach(event => {
            if (event.is_income === true) {
                const category = event.category
                if (totals[category]) {
                    totals[category] += Math.abs(event.sum)
                } else {
                    totals[category] = Math.abs(event.sum)
                }
            }
        })
        // Muutetaan taulukoksi
        return Object.entries(totals).map(([category, total]) => ({
            name: category,
            value: total,
        }))
    }



    const expenseDataRaw = getExpenseTotals(filteredEvents)
    const incomeDataRaw = getIncomeTotals(filteredEvents)

    // Lasketaan kokonaismenot ja -tulot
    const expenseTotal = expenseDataRaw.reduce((acc, curr) => acc + curr.value, 0)
    const incomeTotal = incomeDataRaw.reduce((acc, curr) => acc + curr.value, 0)

    const expenseData = showPercentages
        ? expenseDataRaw.map(entry => ({
            name: entry.name,
            value: parseFloat(((entry.value / expenseTotal) * 100).toFixed(1))
        }))
        : expenseDataRaw

    const incomeData = showPercentages
        ? incomeDataRaw.map(entry => ({
            name: entry.name,
            value: parseFloat(((entry.value / incomeTotal) * 100).toFixed(1))
        }))
        : incomeDataRaw

    // Järjestetään suurimmasta pienimpään
    const sortedExpenseData = [...expenseData].sort((a, b) => b.value - a.value)
    const sortedIncomeData = [...incomeData].sort((a, b) => b.value - a.value)

    return (
        <div>
            < NavBar />
            <div className="page-container">
                < MonthMenu
                    events={events}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                />

                <h2>{selectedMonth}</h2>
                <button className="custom-percentageButton"
                    onClick={() => setShowPercentages(prev => !prev)}>
                    {showPercentages ? "Show euros" : "Show percentages"}
                </button>

                <div className="chart-container">
                    <div className="chart-box">
                        {/* Menot */}
                        {selectedMonth && selectedYear && (
                            <>
                                <PieChart width={450} height={400}>
                                    <Pie
                                        data={sortedExpenseData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={pieRadius}
                                        label={({ value }) =>
                                            showPercentages ? `${value}%` : `${value} €`
                                        }
                                    >
                                        {sortedExpenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>

                                <div>
                                    <h4>Expenses</h4>
                                    <ul>
                                        {sortedExpenseData.map((entry, index) => (
                                            <li key={index} style={{ marginBottom: "6px", display: "flex", alignItems: "center" }}>
                                                <div style={{
                                                    width: "16px",
                                                    height: "16px",
                                                    backgroundColor: COLORS[index],
                                                    marginRight: "10px"
                                                }}>
                                                </div>
                                                <span>
                                                    {entry.name}: {showPercentages
                                                        ? `${entry.value.toFixed(1)} %`
                                                        : `${entry.value.toFixed(2)} €`}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Tulot */}
                    <div className="chart-box">
                        {selectedMonth && selectedYear && (
                            <>
                                <PieChart width={450} height={400}>
                                    <Pie
                                        data={sortedIncomeData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={pieRadius}
                                        label={({ value }) => showPercentages ? `${value}%` : `${value} €`}
                                    >
                                        {sortedIncomeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                                <div>
                                    <h4>Incomes</h4>
                                    <ul>
                                        {sortedIncomeData.map((entry, index) => (
                                            <li key={index} style={{ marginBottom: "6px", display: "flex", alignItems: "center" }}>
                                                <div style={{
                                                    width: "16px",
                                                    height: "16px",
                                                    backgroundColor: COLORS[index],
                                                    marginRight: "10px"
                                                }}>
                                                </div>
                                                <span>
                                                    {entry.name}: {showPercentages
                                                        ? `${entry.value.toFixed(1)} %`
                                                        : `${entry.value.toFixed(2)} €`}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Graphs
