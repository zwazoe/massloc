const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let collections = {
	// endorsements
	Category: ['attributes_icon', 'attributes_tag', 'attributes_category',],
	
}


// initiate data type other than String
let number = []
let object = []
let references ={
	attributes_category: 'categories'
}

// initiate the function that will assign the data type to the fields
let dataType = (key) => {
	
	if(number.includes(key)){ return Number } // if it inclues in the number above
	else if(object.includes(key)){ return {} } // if it inclues in the number above
	else if (references[key]){ return  { type: Schema.Types.ObjectId, ref: references[key] } }  // use the references key value pair to assign data type to the right model. 
	else  return String 
}
let output = {} 
Object.entries(collections).map((items) => {
	let name = items[0];
	let payload = items[1]

	let pre_schema = {}
	// get the data type to all the keys
	payload.map(key => pre_schema[key] = dataType(key))
	// assign items that should be includes in all models
	pre_schema.attributes_section = [{ type: Schema.Types.ObjectId, ref: 'sections'}]
	pre_schema.attributes_owner = { type: Schema.Types.ObjectId, ref: 'businesses'}
	pre_schema.attributes_price = Number;
	pre_schema.attributes_title = String;
	pre_schema.attributes_parent = String;
	pre_schema.attributes_type = String;
	pre_schema.attributes_description = String;
	pre_schema.attributes_public = { type: Boolean, default: false }
	pre_schema.attributes_published = { type: Boolean, default: true }
	pre_schema.attributes_invisible = { type: Boolean, default: false }
	pre_schema.created_at = { type: Date, default: Date.now }
	// assign the mongoose schema

	output[name] = mongoose.model(name, new Schema(pre_schema));
})

module.exports = output
