import React, { useState } from "react"
import { Button } from "react-bootstrap"

const DeleteEvent = ({ eventId, setEvents, events }) => {

    const handleDeleteEvent = async (eventId) => {
        const user = JSON.parse(window.localStorage.getItem("loggedFinanceTrackerUser"))
        const token = user.accessToken


        try {
            const response = await fetch(`http://localhost:3001/api/events/${eventId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })
            console.log("Deletoitava id on:", eventId)
            console.log(response)

            if (response.ok) {
                // Päivitetään tapahtumat, jotta poistetut tapahtumat eivät enää näy
                setEvents(events.filter(event => event.id !== eventId));
                alert("Event deleted successfully!")
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