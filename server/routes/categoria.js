const express = require('express');

const { verificaToken, verificaAdminRole } = require('../middlewares/auth');

const app = express();

const Categoria = require('../models/categoria');

//LISTAR CATEGORIAS
app.get('/categoria', verificaToken, (req,res) => {
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario','nombre email')
    .exec((err, categorias) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        Categoria.count((err, total) => {
            return res.json({
                ok:true,
                categorias,
                total
            })
        })
    })
});

//MOSTRAR CATEGORIA POR ID
app.get('/categoria/:id', verificaToken, (req,res) => {
    let id = req.params.id;
    Categoria.findById(id,(err, categoria) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        
        if(!categoria){
            return res.status(400).json({
                ok:false,
                message:"No se encontró ninguna categoría"
            })
        }

        return res.json({
            ok:true,
            categoria
        })
    })
});

//CREAR CATEGORIA
app.post('/categoria', verificaToken, (req,res) => {
    let body = req.body;
    let newCategoria = new Categoria({
        descripcion:body.descripcion,
        usuario: req.usuario._id
    })

    newCategoria.save((err,categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        return res.json({
            ok:true,
            categoria: categoriaDB
        })

    })
})

//MODIFICAR CATEGORIA
app.put('/categoria/:id', verificaToken, (req,res) => {
    let id = req.params.id;
    let cambios = req.body;

    Categoria.findByIdAndUpdate(id,cambios,{new:true,runValidators:true}, (err,categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        
        return res.json({
            ok:true,
            categoria: categoriaDB
        })

    })
})

//ELIMINAR CATEGORÍA
app.delete('/categoria/:id',[verificaToken,verificaAdminRole], (req,res) =>{
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) =>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                message:"La categoría que está intentando eliminar no existe"
            })
        }

        return res.json({
            ok:true,
            message:'Categoría eliminada con éxito'
        })
    })
})





module.exports = app;
