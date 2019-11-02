const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ProductName: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = ProductName = mongoose.model('ProductName', ItemSchema);
