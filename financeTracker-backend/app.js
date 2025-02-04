const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())


let events = [
    {
      id: "1",
      income: false,
      expense: true,
      sum: 250,
      category: "Restaurants",
      content: "restaurant with Michael",
      date: "3.1.2025"
    },
    {
      id: "2",
      income: false,
      expense: true,
      sum: 45,
      category: "Food",
      content: "food market",
      date: "5.1.2025"
    },
    {
      id: "3",
      income: true,
      expense: false,
      sum: 400,
      category: "Rent",
      content: "rent from tenant",
      date: "6.1.2025"
    }
  ]


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/frontpage', (request, response) => {
    response.json(events)
  })

app.get('/api/frontpage/:id', (request, response) => {
    const id = request.params.id
    const event = events.find(event => event.id === id)

    if (event) {
      response.json(event)
    } else {
      response.status(404).end()
    }
  })

app.post('/api/frontpage', (request, response) => {
    const event = request.body

    // Checking that event contains all the needed information
    if (!event.sum || !event.category || !event.content || !event.date) {
      return response.status(400).json({error: "Missing required fields"})
  }

  const newEvent = {
    id: (events.length + 1).toString(), // Simple ID-logic
    income: event.income,
    expense: event.expense,
    sum: event.sum,
    category: event.category,
    content: event.content,
    date: event.date
}

    events.push(newEvent) // Adds the event to the list
    console.log("New event added:", newEvent)

    response.status(201).json(newEvent) 
  })

app.delete('/api/frontpage/:id', (request, response) => {
    const id = request.params.id
    events = events.filter(event => event.id !== id)
  
    console.log("Deleted event number", id)
    response.status(204).end()
  })


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })  


module.exports = app
