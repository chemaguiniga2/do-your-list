const mongoose = require('mongoose');
const Joi = require('joi');

const productoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    number: {
        type: Number,
        required: true,
        min: 1
    },
    cantidad: {
        type: Number,
        required: true
    },
    categoria: {
        type: String,
        trim: true,
        required: true,
        enum: ['Carnes', 'Comidas congeladas', 'Productos lácteos', 'Salsas', 'Confitería', 'Bebidas alcohólicas', 'Bebidas no alcohólicas']
    },
}, { toJSON: { getters: true }});


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
    },
    productos: [ productoSchema ]
}, { toJSON: { getters: true }}); 



const Usuario = mongoose.model('Usuario', usuarioSchema);

function validate(usuario){
    const schema = {
        name: Joi.string().required().trim(),
        email: Joi.string().required().trim(),
        password: Joi.string().required().trim(),
        gender: Joi.string().required().trim(),
        productos: Joi.array().items(
            Joi.object({
                number: Joi.number().required().min(1),
                name: Joi.string().required().trim(),
                cantidad: Joi.number().required(),
                categoria: Joi.string().required().valid('Carnes', 'Comidas congeladas', 'Productos lácteos',
                 'Salsas', 'Confitería', 'Bebidas alcohólicas', 'Bebidas no alcohólicas')        
            })
        )
    }
    return Joi.validate(usuario, schema);
}


function validateLogin(usuario){
    const schema = {
        name: Joi.string().required().trim(),
        password: Joi.string().required().trim(),

    }
    return Joi.validate(usuario, schema);
}

exports.Usuario = Usuario;
exports.validate = validate;
exports.validateLogin = validateLogin;