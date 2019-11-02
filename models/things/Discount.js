const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Discount: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = Discount = mongoose.model('Discount', ItemSchema);
