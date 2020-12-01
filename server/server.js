const config = require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// habilitar PUBLIC
app.use(express.static(path.resolve(__dirname , '../public')))

//RUTAS (Global)
app.use( require('./routes/index') )


mongoose.connect(process.env.urlDB, { useNewUrlParser: true,useUnifiedTopology: true },(err,res) => {
  if(err) throw err;

  console.log('MONGO CONECTADO CORRECTAMENTE')
});
 
app.listen(process.env.PORT, () => console.log(`Escuchando en el puerto ${process.env.PORT}`));