const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const app = express();
const Usuario = require('../models/usuario');

app.post('/login', (req, res) =>{

    let body = req.body;
    Usuario.findOne({email:body.email}, (err,usuario) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
            
        }

        if(!usuario){
            return res.status(400).json({
                ok:false,
                message:"Usuario o contraseña incorretos"
            });
            
        }

        if (!bcrypt.compareSync(body.password,usuario.password)){
            return res.status(400).json({
                ok:false,
                message:"Usuario o contraseña incorretos"
            });
            
        }

        let token = jwt.sign({
            usuario
        }, process.env.SEED,{ expiresIn: 60 * 60 * 24 * 30 })

        return res.json({
            ok:true,
            usuario,
            token
        })

    })
})


module.exports = app;