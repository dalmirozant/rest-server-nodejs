const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//GOOGLE SIGN IN
// función para chequear credenciales de google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

//Ruta para loguearse con google
app.post('/google',async (req,res) => {
    let token = req.body.idtoken;
let googleUser = await verify(token) // chequeamos las credenciales de google y guardamos la respuesta
    .catch(err => {
        return res.status(403).json({
            ok:false,
            err
        })
    })

    Usuario.findOne({email:googleUser.email}, (err, usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })            
        }
// si el usuario ya existe
        if(usuarioDB){
            if(!usuarioDB.google){ //si el usuario fue creado en la aplicación sin usar google
                    return res.status(400).json({
                        ok: false,
                        message:"Este email ya se encuentra registrado con usuario y contraseña"
                    })    
            }  else { // si está registrado con google
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED,{ expiresIn: 60 * 60 * 24 * 30 });

                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            //Si no hay usuario con ese mail (es nuevo)
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true
            usuario.password = ':-P';

            usuario.save((err, usuarioDB) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })            
                }
                
                let token = jwt.sign({
                    usuario
                }, process.env.SEED,{ expiresIn: 60 * 60 * 24 * 30 });

                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });

            })
        }

    })

})


module.exports = app;