const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { TimeRange: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = TimeRange = mongoose.model('TimeRange', ItemSchema);
