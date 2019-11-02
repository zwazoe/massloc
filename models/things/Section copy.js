const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const SectionsSchema = new Schema({
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'profiles'
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'places'
	},
	name: {
		type: String,
		required: true
	},
	attributes:[ { 
		attributes_title: String,
		attributes_icon: String,
		attributes_image: String,
		attributes_video: String,
		attributes_description: String,
	}],
	field: {
	},
	group_alias: String,
	group_description: String,

	published: {
		type: String,
		default: "true"
	},

	public: {
		type: String,
		default: "false"
	},
	validated: {
		type: String,
		default: true
	},

	updated_at: Date,
	created_at: {
		type: Date,
		default: Date.now
	}
});

module.exports = ProductSections = mongoose.model('sections', SectionsSchema);
