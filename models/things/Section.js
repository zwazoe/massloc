const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const SectionsSchema = new Schema({
	attributes_name: {
		type: String,
		required: true
	},
	attributes:[{
		type: Schema.Types.ObjectId,
		ref: 'agents'
	}],
	agent: [{
		type: Schema.Types.ObjectId,
		ref: 'agents'
	}],
    booking: [{
		type: Schema.Types.ObjectId,
		ref: 'bookings'
	}],
    checkboxOption:[{
		type: Schema.Types.ObjectId,
		ref: 'checkboxoptions'
	}],
    credential:[{
		type: Schema.Types.ObjectId,
		ref: 'credentials'
	}],
    description: [{
		type: Schema.Types.ObjectId,
		ref: 'descriptions'
	}],
    filemanagement:[{
		type: Schema.Types.ObjectId,
		ref: 'filemanagements'
	}],
    gallery: [{
		type: Schema.Types.ObjectId,
		ref: 'galleries'
	}],
    lifespan:[{
		type: Schema.Types.ObjectId,
		ref: 'lifespans'
	}],
	pricing: [{
		type: Schema.Types.ObjectId,
		ref: 'pricings'
	}],
    productname:[{
		type: Schema.Types.ObjectId,
		ref: 'productnames'
	}],
    question:[{
		type: Schema.Types.ObjectId,
		ref: 'questions'
	}],
    radiooption: [{
		type: Schema.Types.ObjectId,
		ref: 'radiooptions'
	}],
    sizerange:[{
		type: Schema.Types.ObjectId,
		ref: 'sizeranges'
	}],
    warranty: [{
		type: Schema.Types.ObjectId,
		ref: 'warranties'
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

module.exports = ProductSections = mongoose.model('sections', SectionsSchema);
