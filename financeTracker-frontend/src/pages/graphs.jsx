import { React, useState, useEffect } from 'react'
import eventService from '../services/events'
import NavBar from '../components/navbar'
import MonthMenu from '../components/monthMenu'
import { PieChart, Pie, Cell, Tooltip } from "recharts"


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const COLORS = ["#4682B4", "#48D1CC", "#ADD8E6", "#7B68EE", "#4d45bc", "#483D8B", "#87CEEB", "#e1e334", "#afbbbf", "#3de8e9", "#267c7c", "#aaae49", "#002ba6", "#d6d07f"]


const Graphs = ({ events, setEvents }) => {
    const [selectedMonth, setSelectedMonth] = useState("")
    const [selectedYear, setSelectedYear] = useState("")
    const [showPercentages, setShowPercentages] = useState(false)

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


    const getCategoryTotals = (events) => {
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

    const rawData = getCategoryTotals(filteredEvents)
    const totalSum = rawData.reduce((acc, curr) => acc + curr.value, 0)

    const data = showPercentages
        ? rawData.map(entry => ({
            name: entry.name,
            value: parseFloat(((entry.value / totalSum) * 100).toFixed(1)), // prosentit yhdellä desimaalilla
        }))
        : rawData



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
                {selectedMonth && selectedYear && (
                    <div className="piechart">
                        <PieChart width={420} height={400}>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={140}
                                label={({ value }) =>
                                    showPercentages ? `${value}%` : `${value} €`
                                }
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                        <div>
                            <button className="custom-percentageButton"
                                onClick={() => setShowPercentages(prev => !prev)}>
                                {showPercentages ? "Show euros" : "Show percentages"}
                            </button>
                            <div>

                                <h4>Expenses</h4>
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    {data.map((entry, index) => (
                                        <li key={index} style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
                                            <div style={{
                                                width: "16px",
                                                height: "16px",
                                                backgroundColor: COLORS[index],
                                                marginRight: "10px"
                                            }}></div>
                                            <span>
                                                {entry.name}: {showPercentages
                                                    ? `${entry.value.toFixed(1)} %`
                                                    : `${entry.value.toFixed(2)} €`}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    )
}




export default Graphs
