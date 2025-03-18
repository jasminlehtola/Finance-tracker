import React, { useState } from "react"
import { Modal, Button, Form, ToggleButton, ToggleButtonGroup, Toast, Dropdown, Col, Row } from "react-bootstrap"


const AddEvent = () => {
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
  const expenseCategories = ["Bills", "Car", "Clothes", "Food", "Fun", "Household supplies", "Housing", "Loan", "Pharmacy", "Phone and internet", "Restaurants and cafes", "Saving", "Shopping", "Other"]

  //const [categories, setCategories] = useState(["Bills", "Car", "Food", "Pharmacy", "Restaurants", "Traffic"])
  const handleShow = () => setShow(true)
  const handleClose = () => {
    setShow(false);
    setFormData({ is_income: null, sum: "", category: "", title: "", date: "" });
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    //Oman kategorian lisääminen:
    //if (name === "category") {
      //if (value && !incomeCategories.includes(value)) {
        //setCategories([...incomeCategories, value]) // Lisää uusi kategoria, jos se ei ole listassa
      //}
    //}
  }

  const handleIncomeChange = (value) => {
    setFormData({ ...formData, is_income: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Haetaan token käyttäjäoliosta
    const user = JSON.parse(window.localStorage.getItem('loggedFinanceTrackerUser'))
    const token = user.accessToken
    console.log("Lähetetään tiedot:", formData)
    console.log("Token:", token)

    const requestBody = {
      user_id: user.id,
      is_income: formData.is_income,  // Varmistetaan oikea boolean
      sum: Number(formData.sum), // Muutetaan numeroksi
      category: formData.category,
      title: formData.title,
      date: formData.date
    }

    try {
    // Lähettää tiedot backendille
    console.log("Lähetettävä data:", JSON.stringify(requestBody));
    const response = await fetch("http://localhost:3001/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })

    console.log("response:", response)

    if (response.ok) {
      alert("Event added!")
      handleClose()
    } else {
      const errorData = await response.json()
      console.error("Virhe backendista:", errorData);
      alert(`Error: ${errorData.message || "Failed to add event."}`)
    }
  } catch (error) {
    // Handle fetch error
    console.error('Fetch error:', error);
    alert('Network error occurred.');
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
            <ToggleButtonGroup
              type="radio"
              name="is_income"
              value={formData.is_income}
              onChange={handleIncomeChange}
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
            <Form.Control type="number" name="sum" required onChange={handleChange} />
          </Form.Group>

          
          {formData.is_income !== null && (
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" onChange={handleChange} required>
                {(formData.is_income ? incomeCategories : expenseCategories).map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="title" onChange={handleChange} />
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