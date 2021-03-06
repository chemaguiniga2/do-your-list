
const mongoose = require('mongoose');
const Joi = require('joi');


const productoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    unidad: {
        type: String,
        required: true,
        trim: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    categoria: {
        type: String,
        trim: true,
        required: true,
        enum: ['Lácteos', 'Carnes y Pescados', 'Despensa', 'Panadería y Tortillería',
        'Higiene y Belleza', 'Jugos y Bebidas']
    },
    fecha: {
        type: Date,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, { toJSON: { getters: true }});

const Producto = mongoose.model('Producto', productoSchema);

function validateProd(producto){
    const schema = {
        unidad: Joi.string().required().trim(),
        name: Joi.string().required().trim(),
        cantidad: Joi.number().required(),
        categoria: Joi.string().required().valid('Lácteos', 'Carnes y Pescados', 'Despensa',
         'Panadería y Tortillería', 'Higiene y Belleza', 'Jugos y Bebidas'),
    }
    return Joi.validate(producto, schema);}

function validateProdApi(producto){
    const schema = {
        unidad: Joi.string().required().trim(),
        name: Joi.string().required().trim(),
        cantidad: Joi.number().required(),
        categoria: Joi.string().required().valid('Lácteos', 'Carnes y Pescados', 'Despensa',
            'Panadería y Tortillería', 'Higiene y Belleza', 'Jugos y Bebidas'),
        usuario: Joi.string().required()
    }
    return Joi.validate(producto, schema);
}

exports.Producto = Producto;
exports.validateProd = validateProd;
exports.validateProdApi = validateProdApi;