const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Access: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = Access = mongoose.model('Access', ItemSchema);
