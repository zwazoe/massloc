const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let collections = {
	Profile: [ "attributes_phone", "attributes_relationship", "attributes_dob", 'attributes_employer','attributes_employer_association', 'attributes_place_association'  ,"attributes_image", "attributes_icon", "attributes_video", 'attributes_default', "attributes_place", "attributes_apartment", "attributes_employer_status", "attributes_place_status"], 
    Location: [  "attributes_address","attributes_apartment"],
    Document: [ "attributes_upload","attributes_file_type" ],
    Portfolio: [  "attributes_portfolio_item", "attributes_date_start", "attributes_date_end", "attributes_expiration", "attributes_file_type", "attributes_reference"],
}


// initiate data type other than String
let dataType = {
	number: [Number, "processed", "total"],
	boolean: [Boolean, "attributes_default"],
	map: [Map, "attributes_association"]
}

let references ={
	
}
let defaultValue = {
	false: [false, "attributes_default"]
}

// initiate the function that will assign the data type to the fields
let getDataType = (key) => {
	let output = { type: String}

	let dataTypeKeys = Object.keys(dataType)
	let defaultValueKeys =  Object.keys(defaultValue)
	let referencesKeys =  Object.keys(references)

	dataTypeKeys.map(value => {
		if(dataType[value].includes(key)){
			output.value = dataType[value][0]
		}
	})
	defaultValueKeys.map(value => {
		if(defaultValue[value].includes(key)){
			output.default = defaultValue[value][0]
		}
	})
	referencesKeys.map(value => {
		if(references[value].includes(key)){
			output.type = references[value][0]
			output.ref = references[value][1]
		}
	})
	 return output;
}
let output = {} 
Object.entries(collections).map((items) => {
	let name = items[0];
	let payload = items[1]

	let pre_schema = {}
	// get the data type to all the keys
	payload.map(key => pre_schema[key] = getDataType(key))
	// assign items that should be includes in all models
	pre_schema.attributes_section = [{ type: Schema.Types.ObjectId, ref: 'sections'}]
	pre_schema.attributes_user = { type: Schema.Types.ObjectId, ref: 'users'}
	pre_schema.attributes_profile = { type: Schema.Types.ObjectId, ref: 'profiles'}
	pre_schema.attributes_pricing = Number;
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
