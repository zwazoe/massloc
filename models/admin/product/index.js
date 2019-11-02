const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Process } = require('../../Brains')

let collections = {
	Category: {attributes_description: String, attributes_icon: String, attributes_tag: String,attributes_category: String}
}
let number = []
let boolean =  []
let output = Process(Schema, collections, number, boolean)

module.exports = output