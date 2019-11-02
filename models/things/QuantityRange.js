const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { QuantityRange: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = QuantityRange = mongoose.model('QuantityRange', ItemSchema);
