const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateRange: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = DateRange = mongoose.model('DateRange', ItemSchema);
