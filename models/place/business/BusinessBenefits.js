const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const BusinessBenefitSchema = new Schema({
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
			attributes_ribbon_cutting: String,
			attributes_blast: String,
			attributes_recomendation_default: String,
			attributes_recomendation_discount: String,
			attributes_recomendation_personalized: String,
			attributes_recomendation_forced: String,
			attributes_blight: String,
			attributes_shelf: String,
			attributes_otw_sharing: String,
			attributes_collection_discounts: String,
			attributes_sitdown: String,
			attributes_collection_message: String
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
	group_benefits: String,
	group_overide: String,

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

module.exports = ProductBusinessBenefit = mongoose.model('BusinessBenefit', BusinessBenefitSchema);
