
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
        enum: ['lacteos', 'Carnes', 'Harinas', 'pan',
         'sazonadores', 'higiene', 'bebidas']
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

function validate(producto){
    const schema = {
        unidad: Joi.string().required().trim(),
        name: Joi.string().required().trim(),
        cantidad: Joi.number().required(),
        categoria: Joi.string().required().valid('lacteos', 'Carnes', 'Harinas',
         'pan', 'sazonadores', 'higiene', 'bebidas'),
    }
    return Joi.validate(producto, schema);
}

exports.Producto = Producto;
exports.validate = validate;