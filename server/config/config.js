

// PUERTO
process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//VENCIMIENTO DEL TOKEN
//30 DÍAS
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//SEED DE VALIDACIÓN
process.env.SEED = process.env.SEED || 'este-es-el-seed';

//CONEXIÓN A MONGO
if(process.env.NODE_ENV === 'dev'){
   urlDB = 'mongodb://localhost:27017/boliche';  
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;