const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Credential: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = Credential = mongoose.model('Credential', ItemSchema);
