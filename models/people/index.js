const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let collections = {
	Profile: ["classification"], 
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
	pre_schema.name = { type: String, default: "John Doe" }
	
		pre_schema.symptoms = [
		{
			diagnostic: {
				type: String,
				require: true
			},
			classification: String,
			detail: String,
			emergency_contact_name: { type: String },
			emergency_contact_phone: { type: String },
			provider: { type: Schema.Types.ObjectId, ref: 'users'}
			
		}
	]
	// get the data type to all the keys
	payload.map(key => pre_schema[key] = getDataType(key))
	// assign items that should be includes in all models
	pre_schema.user = { type: Schema.Types.ObjectId, ref: 'users'}
	pre_schema.creator = { type: Schema.Types.ObjectId, ref: 'users'}
	pre_schema.attributes_public = { type: Boolean, default: false }
	pre_schema.attributes_published = { type: Boolean, default: true }
	pre_schema.attributes_invisible = { type: Boolean, default: false }
	pre_schema.created_at = { type: Date, default: Date.now }
	// assign the mongoose schema
	output[name] = mongoose.model(name, new Schema(pre_schema));
})

module.exports = output
