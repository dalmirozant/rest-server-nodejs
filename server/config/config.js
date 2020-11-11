// PUERTO
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if(process.env.NODE_ENV === 'dev'){
   urlDB = 'mongodb://localhost:27017/boliche';  
} else {
    urlDB = 'mongodb+srv://tutorial:tuto2020@cluster0.im7xu.gcp.mongodb.net/boliche?retryWrites=true&w=majority';
}

process.env.urlDB = urlDB;