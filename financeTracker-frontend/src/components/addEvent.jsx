import React, { useState } from "react"
import { Modal, Button, Form, Toast, Dropdown, Col, Row } from "react-bootstrap"


const AddEvent = () => {
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({
    isIncome: false,
    isExpense: false,
    sum: "",
    category: "",
    title: "",
    date: ""
  })

  const [categories, setCategories] = useState(["Bills", "Car", "Food", "Pharmacy", "Restaurants", "Traffic"])

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === "category") {
      if (value && !categories.includes(value)) {
        setCategories([...categories, value]) // Lisää uusi kategoria, jos se ei ole listassa
      }
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    /*const token = window.localStorage.getItem('loggedFinanceTrackerUser')
    console.log("Sending token:", token); */

    //console.log("Lähetetään tiedot:", formData)
    //handleClose()


    // Lähettää tiedot backendille
    try {
      const response = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

  

      if (response.ok) {
        alert("Event added!")
        handleClose();
        setFormData({ isIncome: false, amount: "", category: "", description: "", date: "" })
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to add event."}`)
      }
    } catch (error) {
      console.error("Error adding event:", error)
      alert("Something went wrong.")
    }
  }

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Add event
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Income"
                name="isIncome"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Expense"
                name="isExpense"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sum</Form.Label>
              <Form.Control type="number" name="sum" required onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                list="category-options"
                name="category"
                placeholder="Choose from list or add new"
                required onChange={handleChange}
              />
              <datalist id="category-options">  {/* Käyttäjä voi valita tai lisätä uuden */}
                {categories.map((category, index) => (
                  <option key={index} value={category} />
                ))}
              </datalist>
              <Form.Select name="category" required onChange={handleChange}>
                <option value="Bills">Bills</option>
                <option value="Car">Car</option>
                <option value="Food">Food</option>
                <option value="2">Two</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Restaurants and cafes">Restaurants and cafes</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" required onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" required onChange={handleChange} />
            </Form.Group>


            <Button variant="success" type="submit">
              Save
            </Button>
            <Button variant="secondary" onClick={handleClose} className="ms-2">
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}



export default AddEvent