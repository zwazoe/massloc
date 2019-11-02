const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const BusinessStaffSchema = new Schema({
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
	attributes: [{
		
		attributes_collection_profile: String,
		attributes_description: String,
		attributes_base: String,
		attributes_salary: String,
		attributes_type: String, // candidate, awardee, etc. 
		attributes_date_start: String,
		attributes_date_end: String,
		attributes_collection_job: String,
		attributes_status: String,

	}],

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
	group_title: String,
	group_description: String,
	group_salary_min: String,
	attributes_salary_max: String,
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

module.exports = ProductBusinessStaff = mongoose.model('BusinessStaff', BusinessStaffSchema);
