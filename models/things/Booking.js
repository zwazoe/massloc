const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Booking: Item } = require('./index')

//create schema
const ItemSchema = new Schema({...Item});

module.exports = Booking = mongoose.model('Booking', ItemSchema);
