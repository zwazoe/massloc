const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Question: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = Question = mongoose.model('Question', ItemSchema);
