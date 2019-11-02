const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const CategorySchema = new Schema({
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
	attributes: [
		{
			attributes_title: String,
			attributes_description: String,
			attributes_icon: String,
			attributes_tag: String,
			attributes_category:  String
		}
	],
	field: {
		variation: [
			{
				type: String
			}
		],
		warranty: [
			{
				type: String
			}
		],
		timing: [
			{
				type: String
			}
		],
		pitch: [
			{
				type: String
			}
		],
		group: [
			{
				type: String
			}
		]
	},
	group_alias: String,
	group_description: String,

	published: {
		type: Boolean,
		default: true
	},

	public: {
		type: Boolean,
		default: true
	},
	validated: {
		type: Boolean,
		default: true
	},

	updated_at: Date,
	created_at: {
		type: Date,
		default: Date.now
	}
});

module.exports = ProductCategory = mongoose.model('Category', CategorySchema);
