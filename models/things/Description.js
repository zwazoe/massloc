const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Description: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = Description = mongoose.model('Description', ItemSchema);
