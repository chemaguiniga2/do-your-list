const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Usuario, validate, validateLogin } = require('../models/usuario');
const Joi = require('joi');

router.post('/', async (req, res) => {
    const { error } = validar(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let usuario = await Usuario.findOne({ email: req.body.email });
    if (!usuario) return res.status(400).send('Email o password incorrectos.');

    const passwordValido = await bcrypt.compare(req.body.password, usuario.password);
    if (!passwordValido) return res.status(400).send('Email o password incorrectos.');

    const token = usuario.generarAuthToken();

    res.send(token);
});

function validar(req){
    const schema = {
        email: Joi.string().min(5).max(255).required().email().trim(),
        password: Joi.string().max(255).required().trim()
    }
    return Joi.validate(req, schema);
}

module.exports = router;