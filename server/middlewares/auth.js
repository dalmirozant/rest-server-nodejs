//VERIFICAR TOKEN
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');
let verificaToken = (req,res,next) =>{


    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok:false,
                message: "Token no válido"
            })
        }

        req.usuario = decoded.usuario;
        next();
    })
    
}

//VERIFICAR ADMIN_ROLE
let verificaAdminRole = (req,res,next) =>{

        let usuario = req.usuario;

        if(usuario.role !== 'ADMIN_ROLE'){
            return res.status(401).json({
                ok:false,
                message: "Debe ser Admin"
            })
        }

        next()
        
}

module.exports = {verificaToken,verificaAdminRole}