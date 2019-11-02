const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const SuggestionSchema = new Schema({
	parent: []
});

module.exports = ProductSuggestion = mongoose.model('Suggestion', SuggestionSchema);
