
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
        enum: ['Carnes', 'Comidas congeladas', 'Productos lácteos', 'Salsas',
         'Confitería', 'Bebidas alcohólicas', 'Bebidas no alcohólicas']
    },
}, { toJSON: { getters: true }});

const Producto = mongoose.model('Producto', productoSchema);

function validate(producto){
    const schema = {
        number: Joi.number().required().min(1),
        name: Joi.string().required().trim(),
        cantidad: Joi.number().required(),
        categoria: Joi.string().required().valid('Carnes', 'Comidas congeladas', 'Productos lácteos',
         'Salsas', 'Confitería', 'Bebidas alcohólicas', 'Bebidas no alcohólicas')
    }
    return Joi.validate(producto, schema);
}

exports.Producto = Producto;
exports.validate = validate;