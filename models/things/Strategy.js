const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Strategy: Item } = require('./index')

//create schema
const ItemSchema = new Schema({
    ...Item
});

module.exports = Strategy = mongoose.model('Strategy', ItemSchema);
