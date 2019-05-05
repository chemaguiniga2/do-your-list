const mongoose = require('mongoose');
const Joi = require('joi');

const productoScrapSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    categoria: {
        type: String,
        trim: true
    },
    precio: {
        type: String,
        trim: true
    }
}, {toJSON: {getters: true}});

const prodScrap = mongoose.model('prodScrap', productoScrapSchema);

function validateProdScrap(producto){
    const schema = {
        name: Joi.string().trim(),
        categoria: Joi.string().trim(),
        precio: Joi.string().trim(),
    }
    return Joi.validate(producto, schema);
}

exports.prodScrap = prodScrap;
exports.validateProdScrap = validateProdScrap;