const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { AgeRange: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = AgeRange = mongoose.model('AgeRange', ItemSchema);
