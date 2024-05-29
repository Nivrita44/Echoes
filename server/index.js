const express = require('express')
const app = express()
const port = 2000
const cors = require('cors')

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send()
})

app.listen(port, () => {
    console.log(`Server is connected to port ${port}`)
})