const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const BusinessSchema = new Schema({
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'profiles'
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'profiles'
	},
	hacked: [
		{
			id: {
				type: Schema.Types.ObjectId,
				ref: 'profiles'
			},
			accusation: String,
			date_created: {
				type: Date,
				default: Date.now
			}
		}
	],

	association: {
		place: [],
		message: [],
		package: [],
		pricing: [],
		requests: {},
		connections: {

		},

		setting: [
			{
				setting_public: {
					type: String,
					default: 'true'
				},
				setting_title: {
					type: String
				},
				setting_introduction: {
					type: String
				},
				setting_type: {
					type: String
				},
				setting_image: '',
				setting_media_introduction: '',
				setting_logo: '',
				setting_video: '',
				setting_blacklist: [],
				setting_whitelist: [],
				setting_expiration: {
					type: String,
					default: 365
				},
				setting_phone: {
					type: String
				},
				setting_facebook: {
					type: String
				},
				setting_instagram: {
					type: String
				},
				setting_handle: {
					type: String
				},
				setting_twitter: {
					type: String
				},
				setting_youtube: {
					type: String
				},
				setting_linkedin: {
					type: String
				},

				setting_compliance_booking_divisible: {
					type: String
				},
				setting_compliance_booking: {
					type: String
				},
				setting_compliance_amount_divisible: {
					type: String
				},
				setting_compliance_amount: {
					type: String
				},
				setting_compliance_strike: {
					type: String
				},
				setting_compliance_overide: {
					type: String
				},
				setting_compliance_recomendation: {
					type: String
				},
				setting_compliance_discount: {
					type: String
				},
				setting_expiration: {
					type: String,
					default: 365
				},
				setting_pricing: {
					type: String,
					default: 0.0
				},
				setting_aggreement: {
					type: Boolean,
					default: true
				},
				setting_description: {
					type: String
				},
				setting_default_tab: {
					type: String
				},
				setting_response_tab: {
					type: String
				},
				setting_deposit: {
					type: String
				},

				setting_terms: {
					type: String
				},
				setting_privacy: {
					type: String
				},
				setting_date_created: {
					type: Date,
					default: Date.now
				}
			}
		]
	},
	claimed: {
		type: Boolean,
		default: false
	},

	attributes: [],
	analytics: {
		/* 
			{
				google_place_id: String,
				date: Date,
				targets: [],
				category: String,
				google_categories: []
			}
		*/
		business_impression: [],
		customer_impression: [],
		business_accepted: [],
		customer_accepted: []
	},
	name: String,
	businessName: String,
	address: String,
	category: String,
	google_categories: [],
	google_place_id: String,
	icon: String,
	phone: String,
	lattitude: String,
	longitude: String,
	owners_name: [ String ],
	owners_phone: [ String ],
	targets: [ String ],
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

module.exports = ProductBusiness = mongoose.model('Business', BusinessSchema);
