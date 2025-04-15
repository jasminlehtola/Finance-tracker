import { useState, useEffect, useMemo } from 'react'
import eventService from '../services/events'

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


const MonthMenu = ({ events, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }) => {
    const handleMonthChange = (e) => setSelectedMonth(e.target.value)
    const handleYearChange = (e) => setSelectedYear(e.target.value)

    console.log("Kaikki tapahtumat monthMenussa:", events)


    // Luodaan lista vuosista datan perusteella
    const availableYears = useMemo(() => {
        const years = events.map(event => new Date(event.date).getFullYear())
        return [...new Set(years)].sort((a, b) => b - a)
    }, [events])


    return (
        <div className="month-menu-container">
            <label>Select month: </label>
            <select className="month-menu-label" onChange={handleMonthChange} value={selectedMonth}>
                <option value="">Select month</option>
                {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                ))}
            </select>

            <label>Year: </label>
            <select className="month-menu-label" onChange={handleYearChange} value={selectedYear}>
                <option value="">Select year</option>
                {availableYears.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                ))}
            </select>
        </div>

    )
}


export default MonthMenu




