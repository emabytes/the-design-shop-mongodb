const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productItemSchema = new Schema({
    "Product-name": {
        type: String,
        required: true
    },
    "Product-picture-Link": {
        type: String,
        required: true
    },
    "Company": {
        type: String,
        required: true
    },
    "Price": {
        type: "decimal",
        required: true
    },
    "Link-shop": {
        type: String,
    },
    "Description": {
        type: String,
    },
}, {
    timestamps: true
})

const ProductItem = mongoose.model("productsdbs", productItemSchema)

module.exports = ProductItem