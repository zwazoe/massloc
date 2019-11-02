const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Lifespan: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = Lifespan = mongoose.model('Lifespan', ItemSchema);
