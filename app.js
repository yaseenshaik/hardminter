const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/', indexRouter);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})