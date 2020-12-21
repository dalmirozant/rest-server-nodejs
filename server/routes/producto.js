const express = require('express');

const { verificaToken, verificaAdminRole } = require('../middlewares/auth');

const app = express();

const Producto = require('../models/producto');
const usuario = require('../models/usuario');

// ============================
// Obtener todos lod productos
// ============================

app.get('/producto', verificaToken, (req,res) => {
    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 20;

    Producto.find()
            .skip(desde)
            .limit(hasta)
            .populate('usuario','nombre email')
            .populate('categoria','descripcion')
            .exec((err,productos) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                Producto.countDocuments((err, total) => {
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            message: "Error al obtener el total",
                            err
                        })
                    }

                    return res.json({
                        ok:true,
                        productos,
                        total
                    })

                })
            })
})

// BUSCAR PRODUCTOS

app.get('/productos/buscar/:termino', verificaToken,(req, res) => {
    let termino = req.params.termino;
    let reg = new RegExp(termino, 'i');

    Producto.find({nombre: reg})
            .populate("categoria","descripcion")
            .exec(() => {
                
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                return res.json({
                    ok: true,
                    productos
                })
            })
})

// ============================
// Obtener todos producto  por ID
// ============================

app.get('/producto/:_id', verificaToken, (req,res) => {
    let id = req.params.id;

    Producto.findById(id)
            .populate('usuario','nombre email')
            .populate('categoria','descripcion')
            .exec((err, producto) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                if(!producto){
                    return res.status(400).json({
                        ok: false,
                        message: "No se ha encontrado el producto"
                    })
                }

                return res.json({
                    ok: true,
                    producto
                })
            })
})

//CREAR PRODUCTO

app.post('/producto', [verificaToken, verificaAdminRole], (req,res) => {
    let body = req.body;
    productoNuevo = new Producto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    productoNuevo.save((err, producto) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        return res.json({
            ok: true,
            producto
        })

    })

})

//MODIFICAR PRODUCTO

app.put('/producto/:id', [verificaToken,verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id,body,{new: true, runValidators: true}, (err, producto) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!producto){
            return res.status(400).json({
                ok: false,
                message: "El producto que está intentando modificar no existe"
            })
        }

        return res.json({
            ok:true,
            producto
        })

    })
})

app.delete('/producto/:id', [verificaToken,verificaAdminRole], (req,res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id,{disponible: false},{new: true, runValidators: true}, (err, producto) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!producto){
            return res.status(400).json({
                ok: false,
                message: "El producto que está intentando modificar no existe"
            })
        }

        return res.json({
            ok:true,
            message:"Producto Eliminado con éxito"
        })

    })
})


module.exports = app;