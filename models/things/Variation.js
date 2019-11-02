const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Variation: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = Variation = mongoose.model('Variation', ItemSchema);
