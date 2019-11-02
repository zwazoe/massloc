const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const OptionSchema = new Schema({
	name: String,
	values: [ String ],
	place_types: [ String ],
	contributors: [
		{
			type: Schema.Types.ObjectId,
			ref: 'place'
		}
	]
});


module.exports = ProductOptions = mongoose.model('Options', OptionSchema);
