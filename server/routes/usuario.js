
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();
const Usuario = require('../models/usuario');
const { verificaToken,verificaAdminRole } = require('../middlewares/auth');

//GET
app.get('/usuario', verificaToken, (req, res) => {

   /* return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    }) */

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado: true})
           .skip(desde) 
           .limit(limite) 
           .exec((err, usuarios) => {
               if(err){
                return res.status(400).json({
                       ok:false,
                       err
                   })
               }

               Usuario.count({estado: true}, (err, total) => {
                return res.json({
                    ok:true,
                    usuarios,
                    total
                })
               })
           }) 
  })

//POST
app.post('/usuario', [verificaToken,verificaAdminRole], function (req, res) {
    let cuerpo = req.body;
    let usuario = new Usuario({
        nombre: cuerpo.nombre,
        email: cuerpo.email,
        password: bcrypt.hashSync(cuerpo.password,10),
        role: cuerpo.role
    });

    usuario.save((err,usuarioDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
            
        }

        return res.json({
            ok: true,
            usuario: usuarioDB 
        })

    })
  })

//PUT
app.put('/usuario/:id', [verificaToken,verificaAdminRole], function(req,res){
    let id = req.params.id;
    let cuerpo = _.pick(req.body, ['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id,cuerpo,{new:true,runValidators:true}, (err,usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        return res.json({
            ok:true,
            usuario: usuarioDB
        })
    })
})

//DELETE
app.delete('/usuario/:id', [verificaToken,verificaAdminRole], function(req,res){
    let id = req.params.id;
    let cambiaUsuario = {
        estado: false
    };
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiaUsuario, {new:true}, (err, usuarioBorrado) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        if(!usuarioBorrado) {
            return res.status(400).json({
                ok:false,
                message:"El usuario que quiere borrar no existe"
            })
        }
        
        return res.status(200).json({
            ok:true,
            usuario: usuarioBorrado,
        })

    })
})

  module.exports = app;