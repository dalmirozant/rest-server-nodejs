const config = require('./config/config')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.post('/usuario', function (req, res) {
  let cuerpo = req.body;
  res.status(201).json({persona:cuerpo})
})
 
app.listen(process.env.PORT, () => console.log(`Escuchando en el puerto ${process.env.PORT}`));