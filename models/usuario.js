const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');


const usuarioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
        
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        trim: true,
        required: true,
        enum: ['Female', 'Male']
    }
}, { toJSON: { getters: true }}); 

usuarioSchema.methods.generarAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET );
    return token;
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

function validate(usuario){
    const schema = {
        name: Joi.string().required().trim(),
        email: Joi.string().required().trim(),
        password: Joi.string().required().trim(),
        gender: Joi.string().required().trim()
    }
    return Joi.validate(usuario, schema);
}


function validateLogin(usuario){
    const schema = {
        email: Joi.string().required().trim(),
        password: Joi.string().required().trim(),

    }
    return Joi.validate(usuario, schema);
}

exports.Usuario = Usuario;
exports.validate = validate;
exports.validateLogin = validateLogin;