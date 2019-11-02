const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Address Schema
const AssociateSchema = new Schema({
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'place'
	},
	sender: {},
	// sister, brother, parent, competitor
	category: String,
	/**
		 * From associate
		 * From Owner
		 */
	sending: String,
	/**
		 * Accepted by Me
		 * Rejected by Me
		 * Accepted by Associate
		 * Rejected by Associate
		 * Waiting for Associate
		 * Asociate waiting on Me
		 */
	status: String,
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'profile'
	},

	created_at: {
		type: Date,
		default: Date.now()
	},
	updated_at: {
		type: Date
	}
});

module.exports = Associate = mongoose.model('associate', AssociateSchema);
