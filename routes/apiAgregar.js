const express = require('express');
const router = express.Router();
const { Producto, validateProd } = require('../models/producto');
const passport = require('passport');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, validate, validateLogin } = require('../models/usuario');

router.post('/register', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let usuario = await Usuario.findOne({ email: req.body.email });
    if (usuario) return res.status(409).send('El email ya ha sido registrado');

    usuario = new Usuario({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender
    });

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(usuario.password, salt);

    await usuario.save();
    
    return res.status(201).send(usuario);

});

router.post('login', async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    let usuario = await Usuario.findOne({ email: req.body.email });
    if (!usuario) res.status(404).send('El usuario o password son incorrectos');
    const validPassword = await bcrypt.compare(req.body.password, usuario.password);

    //const token
});

module.exports = router;