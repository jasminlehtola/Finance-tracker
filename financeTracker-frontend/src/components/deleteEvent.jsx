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
                alert("Event deleted successfully!")

                // Päivitetään tapahtumat, jotta poistetut tapahtumat eivät enää näy
                const updatedEvents = events.filter((event) => event.id !== eventId)
                setEvents(updatedEvents)
            } else {
                alert("Failed to delete event.")
            }
        } catch (error) {
            console.error("Error deleting event:", error)
            alert("Error occurred while deleting the event.")
        }
    }

    return (
        <Button
            onClick={() => handleDeleteEvent(eventId)}
            style={{ marginLeft: "10px", color: "red", border: "none", background: "transparent" }} >
            X
        </Button>
    )
}


export default DeleteEvent