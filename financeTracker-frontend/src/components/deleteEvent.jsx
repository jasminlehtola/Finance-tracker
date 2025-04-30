import React, { useState } from "react"
import api from '../services/auth'

const DeleteEvent = ({ eventId, setEvents, events }) => {

    const handleDeleteEvent = async (eventId) => {
        const confirmDelete = window.confirm("Do you really want to delete this event?")
        if (!confirmDelete) {
            return 
        }

        try {
            const response = await api.delete(`/events/${eventId}`)
            console.log("Deletoitava id on:", eventId)
            console.log("Deleten response:", response)

            if (response.status === 200 || response.status === 204) {
                // Päivitetään tapahtumat, jotta poistetut tapahtumat eivät enää näy
                setEvents(events.filter(event => event.id !== eventId))
                console.log("Event deleted successfully.")
            } else {
                alert("Failed to delete event.")
            }
        } catch (error) {
            console.error("Error deleting event:", error)
            alert("Error occurred while deleting the event.")
        }
    }

    return (
        <button
            onClick={() => handleDeleteEvent(eventId)}
            className="custom-deleteButton"
        >
            X
        </button>
    )
}


export default DeleteEvent