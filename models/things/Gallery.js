const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Gallery: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = Gallery = mongoose.model('Gallery', ItemSchema);
