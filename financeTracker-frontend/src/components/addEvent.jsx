import React, { useState } from "react"
import { Modal, Button, Form, ToggleButton, ToggleButtonGroup, Toast, Dropdown, Col, Row } from "react-bootstrap"
import { addNewEvent } from "../services/events"


const AddEvent = ({ events, setEvents }) => {
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({
    is_income: "",
    sum: "",
    category: "",
    title: "",
    date: ""
  })

  // Kategoriavaihtoehdot tuloille ja menoille
  const incomeCategories = ["Benefits", "Gifts", "Pension", "Savings", "Wage", "Other"]
  const expenseCategories = ["Bills", "Car", "Clothes", "Food", "Fun", "Hobbies", "Household supplies", 
    "Housing", "Loan", "Pharmacy", "Phone and internet", "Rent", "Restaurants and cafes", "Saving", 
    "Shopping", "Taxes", "Travelling", "Other"]


  // Avaa tapahtuman lisäämisvalikon
  const handleShow = () => setShow(true)
  const handleClose = () => {
    setShow(false)
    setFormData({ is_income: null, sum: "", category: "", title: "", date: "" })
  }


  // Huolehtii kenttien muutoksista
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Huolehtii income/expense-valinnan muutoksesta
  const handleTypeChange = (value) => {
    setFormData({ ...formData, is_income: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    

    const user = JSON.parse(window.localStorage.getItem('loggedFinanceTrackerUser'))
    
    const requestBody = {
      user_id: user.id,
      is_income: formData.is_income,
      sum: Number(formData.sum),
      category: formData.category,
      title: formData.title,
      date: formData.date
    }

    try {
      const newEvent = await addNewEvent(requestBody)
      setEvents([...events, newEvent])
      handleClose()
    } catch (error) {
      console.error("Failed to add event:", error)
      alert("Error: Failed to add event.")
    }
  }

  

  return (
    <div>
      <Button className="custom-AddEventButton rounded" onClick={handleShow}>
        Add new event
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <ToggleButtonGroup
                type="radio"
                name="is_income"
                value={formData.is_income}
                onChange={handleTypeChange}
              >
                <ToggleButton id="income" variant="outline-success" value={true}>
                  Income
                </ToggleButton>
                <ToggleButton id="expense" variant="outline-danger" value={false}>
                  Expense
                </ToggleButton>
              </ToggleButtonGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sum</Form.Label>
              <Form.Control type="currency" name="sum" required onChange={handleChange} />
            </Form.Group>


            {formData.is_income !== null && (
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange} required
                >
                  <option value=""> Select category </option>
                  {(formData.is_income ? incomeCategories : expenseCategories).map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Title </Form.Label>
              <Form.Control
                type="text"
                name="title"
                maxLength="55"  // Estää yli 55 merkin syötön
                onChange={handleChange}
              />
              <small
                style={{
                  color: formData.title.length > 45 ? 'red' : 'gray', // Punainen, jos jäljellä olevia merkkejä on alle 10
                }}
              >
                {55 - formData.title.length} characters left
              </small>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" required onChange={handleChange} />
            </Form.Group>


            <Button className="custom-SmallBlueButton" type="submit">
              Save
            </Button>
            <Button className="custom-SmallBlueButton" onClick={handleClose} >
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}



export default AddEvent