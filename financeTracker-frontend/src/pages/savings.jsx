import { useState, useEffect, useMemo } from 'react'
import NavBar from '../components/navbar'
import eventService from '../services/events'
import MonthMenu from '../components/monthMenu'

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


const Savings = ({ events, setEvents }) => {
    const [selectedMonth, setSelectedMonth] = useState("")
    const [selectedYear, setSelectedYear] = useState("")

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
                    < MonthMenu
                        events={events}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                    />
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