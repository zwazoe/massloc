const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Availability: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = Availability = mongoose.model('Availability', ItemSchema);
