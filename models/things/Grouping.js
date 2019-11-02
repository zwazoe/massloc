const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const GroupingSchema = new Schema({
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'profiles'
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'places'
	},
    basic: {
        title: String,
        category: String,
        image: String,
        price: Number
    },
    
	attributes: { 
		attributes_title: String,
		attributes_icon: String,
		attributes_image: String,
		attributes_video: String,
	},
	field: {

		EmployeeBenefit: [ { type: String } ], 
		Job: [ { type: String } ], 
		Staff: [ { type: String } ],
		Award: [ { type: String } ], 
		Content: [ { type: String } ], 
		Access: [ { type: String } ], 
		AgeRange: [ { type: String } ], 
		Availability: [ { type: String } ], 
		Booking: [ { type: String } ],
		Category: [ { type: String } ], 
		CheckboxOption: [ { type: String } ], 
		Credential: [ { type: String } ], 
		DateRange: [ { type: String } ], 
		Description: [ { type: String } ], 
		Discount: [ { type: String } ], 
		FileManagement: [ { type: String } ], 
		Gallery: [ { type: String } ], 
		Grouping: [ { type: String } ], 
		Lifespan: [ { type: String } ], 
		Pricing: [ { type: String } ], 
		Product: [ { type: String } ], 
		ProductName: [ { type: String } ], 
		Question: [ { type: String } ], 
		RadioOption: [ { type: String } ], 
		Section: [ { type: String } ], 
		SizeRange: [ { type: String } ], 
		Strategy: [ { type: String } ], 
		TimeRange: [ { type: String } ], 
		Warranty: [ { type: String } ], 
		Wholesale: [ { type: String } ]

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

module.exports = ProductGrouping = mongoose.model('Grouping', GroupingSchema);
