import { useState, useEffect, useMemo } from 'react'
import NavBar from '../components/navbar'
import eventService from '../services/events'

const Savings = ({ events, setEvents }) => {

    // Etsii kaikki eventit
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsData = await eventService.getAll()
                setEvents(eventsData)
            } catch (error) {
                console.error("Failed to fetch events:", error)
            }
        }
        fetchEvents()
    }, [setEvents])

    console.log("Kaikki tapahtumat:", events)

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const [selectedMonth, setSelectedMonth] = useState("")
    const [selectedYear, setSelectedYear] = useState("")

    const handleMonthChange = (e) => setSelectedMonth(e.target.value)
    const handleYearChange = (e) => setSelectedYear(e.target.value)


    // Luodaan lista vuosista datan perusteella
    const availableYears = useMemo(() => {
        const years = events.map(event => new Date(event.date).getFullYear())
        return [...new Set(years)].sort((a, b) => b - a)
    }, [events])

    // Suodatetaan savings-kategoriaan kuuluvat menot
    const filteredSavings = events.filter(event => {
        const eventDate = new Date(event.date)
        const monthName = months[eventDate.getMonth()]
        const year = eventDate.getFullYear()

        return (
            event.is_income === false &&
            event.category.toLowerCase() === "saving" &&
            monthName === selectedMonth &&
            String(year) === selectedYear
        )
    })


    const totalSavings = filteredSavings.reduce((sum, event) => sum + Math.abs(event.sum), 0)




    return (
        <div>
            < NavBar />
            <div className="page-container">
                <h3>Savings</h3>

                <div className="savings-container">
                    <label>Select month: </label>
                    <select onChange={handleMonthChange} value={selectedMonth}>
                        <option value="">Select month</option>
                        {months.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                        ))}
                    </select>

                    <label>Year: </label>
                    <select onChange={handleYearChange} value={selectedYear}>
                        <option value="">Select year</option>
                        {availableYears.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="savings-container">
                {
                    selectedMonth && selectedYear && (
                        <>
                            <h5>Total saved in {selectedMonth} {selectedYear}: {totalSavings} €</h5>
                            <ul>
                                {filteredSavings.map((event, index) => (
                                    <li key={index}>
                                        {event.date}: {event.sum} €
                                    </li>
                                ))}
                            </ul>
                        </>
                    )
                }
                </div>
            </div>
        </div >
    )
}



export default Savings