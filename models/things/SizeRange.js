const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { SizeRange: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = SizeRange = mongoose.model('SizeRange', ItemSchema);
