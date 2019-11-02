const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Pricing: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = Pricing = mongoose.model('Pricing', ItemSchema);
