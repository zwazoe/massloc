const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const AgentsSchema = new Schema({
	attributes_name: {
		type: String,
		required: true
    },
    
    agerange: [{
		type: Schema.Types.ObjectId,
		ref: 'ageranges'
	}],
    availability:[{
		type: Schema.Types.ObjectId,
		ref: 'availabilities'
	}],
    daterange:[{
		type: Schema.Types.ObjectId,
		ref: 'dateranges'
	}],
    days: [{
		type: Schema.Types.ObjectId,
		ref: 'days'
	}],
    discount:[{
		type: Schema.Types.ObjectId,
		ref: 'discounts'
	}],
    timerange: [{
		type: Schema.Types.ObjectId,
		ref: 'timeranges'
	}],
    wholesale:[{
		type: Schema.Types.ObjectId,
		ref: 'wholesales'
    }],
    creator: {
		type: Schema.Types.ObjectId,
		ref: 'profiles'
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'places'
	},
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

module.exports = ProductAgent = mongoose.model('agents', AgentsSchema);
