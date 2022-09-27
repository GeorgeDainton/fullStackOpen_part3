const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))



let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people <br><br> ${Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).send(`Person ${id} not found`)
  }
})

const generateId = () => {
  const maxId = persons.length
  return maxId + 1
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(404).json('Missing name')
  } else if (!body.number) {
    return res.status(404).json('Missing number')
  } else if (persons.find(person => person.name === body.name)) {
    return res.status(400).json('Name must be unique')
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown Endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`);