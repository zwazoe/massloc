const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { FileManagement: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = FileManagement = mongoose.model('FileManagement', ItemSchema);
