const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Warranty: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = Warranty = mongoose.model('Warranty', ItemSchema);
