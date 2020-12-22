const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const app = express();
app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id', (req,res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files){
        return res.status(400).json({
            ok: false,
            message: 'No se ha seleccionado ningún archivo'
        })
    }

    //Validar TIPO

    let tiposValidos = ['productos','usuarios'];
    if(tiposValidos.indexOf(tipo) < 0){

        return res.status(400).json({
            ok: false,
            tipo,
            message: `Los tipo permitidos son: ${tiposValidos.join(', ')}`
        })

    }

    //Validar Extensión

    let archivo = req.files.archivo;

    //Extensiones permitidas
    let extensiones = ["png","jpg","gif","jpeg"];
    let nombreCortado = archivo.name.split(".");
    let extension = nombreCortado[nombreCortado.length - 1];
    
    if ( extensiones.indexOf(extension) < 0){

        return res.status(400).json({
            ok: false,
            extension,
            message: `Las extensiones permitidas son: ${extensiones.join(', ')}`
        })

    }

    //Cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().valueOf()}.${extension}`;
    let ruta = `uploads/${tipo}/${nombreArchivo}`;


    //Subir el archivo
    archivo.mv(ruta, (err) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(tipo === "productos") {
            imagenProducto(id, res, nombreArchivo);
        } else {
            imagenUsuario(id, res, nombreArchivo);
        }
    })
})

//Función cambiar imagen Usuario
function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuario) => {
        if(err){
            borraArchivo('usuarios', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!usuario){
            borraArchivo('usuarios', nombreArchivo);
            return res.status(400).json({
                ok: false,
                message: 'El usuario que está tratando de modificar no existe'
            })
        }

        borraArchivo('usuarios', usuario.img)

        usuario.img = nombreArchivo;

        usuario.save((err, usuario) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                usuario,
                img: nombreArchivo
            })

        })
    })
}

//Función cambiar imagen Producto
function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, producto) => {
        if(err){
            borraArchivo('productos', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!producto){
            borraArchivo('productos', nombreArchivo);
            return res.status(400).json({
                ok: false,
                message: 'El producto que está tratando de modificar no existe'
            })
        }

        borraArchivo('productos', producto.img)

        producto.img = nombreArchivo;

        producto.save((err, producto) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            return res.json({
                ok: true,
                producto,
                img: nombreArchivo
            })

        })
    })
}

function borraArchivo(tipo,nombreArchivo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen)
    }
}

module.exports = app;