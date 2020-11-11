// PUERTO
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if(process.env.NODE_ENV === 'dev'){
   urlDB = 'mongodb://localhost:27017/boliche';  
} else {
    urlDB = proces.env.MONGO_URI;
}

process.env.urlDB = urlDB;