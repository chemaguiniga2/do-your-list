const express = require('express');
const router = express.Router();
const { Producto, validateProd, validateProdApi } = require('../models/producto');
const passport = require('passport');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Agregar producto a usuario
router.post('/add', async (req, res) => {
    const { error } = validateProdApi(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let producto = new Producto({
        name: req.body.name,
        unidad: req.body.unidad,
        cantidad: req.body.cantidad,
        categoria: req.body.categoria,
        fecha: Date.now(),
        usuario: req.body.usuario
        
    });
    await producto.save();
    return res.status(201).send(producto);
});

// Buscar producto por nombre
router.get('/:name', async (req, res) => {
    const name = req.params.name;
    let producto = await Producto.findOne({ name });
    if (!producto) return res.status(404).send('Producto no encontrado.');
    return res.send(producto);
});

//Modificar producto
router.put('/:name', async (req, res) => {
    const { error } = validateProd(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const name = req.params.name;
    const producto = await Producto.findOneAndUpdate({ name }, {
        $set: {
            name: req.body.name,
            unidad: req.body.unidad,
            cantidad: req.body.cantidad,
            categoria: req.body.categoria
        }
    }, { new: true });
    if (!producto) return res.status(404).send('Producto no encontrado.');
    return res.send(producto);
});

//Eliminar producto
router.delete('/:id', async (req, res) => {

    const name = req.params.id;
    const producto = await Producto.findOneAndDelete({name});
    if (!producto) return res.status(404).send('Producto no encontrado.');
    return res.send(producto);

});

module.exports = router;