const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Wholesale: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = Wholesale = mongoose.model('Wholesale', ItemSchema);
