const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const BusinessDiscountSchema = new Schema({
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
			attributes_amount: String,
			attributes_code: String,
			attributes_total_usage: String,
			attributes_per_user: String,
			attributes_expiration: String,
			attributes_start: String,
			attributes_end: String,
			attributes_image: String,
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
	group_overide: String,
	group_benefits: String,
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

module.exports = ProductBusinessDiscount = mongoose.model('BusinessDiscount', BusinessDiscountSchema);
