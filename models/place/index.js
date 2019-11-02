const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let collections = {
	// endorsements
	BusinessBenefit: ['attributes_ribbon_cutting', 'attributes_blast', 'attributes_recomendation_default', 'attributes_recomendation_discount', 'attributes_recomendation_personalized', 'attributes_recomendation_forced', 'attributes_blight', 'attributes_shelf', 'attributes_otw_sharing', 'attributes_business_discount', 'attributes_sitdown', 'attributes_business_message'],
	BusinessDiscount: ['attributes_amount', 'attributes_code', 'attributes_total_usage', 'attributes_per_user', 'attributes_expiration', 'attributes_start', 'attributes_end', 'attributes_image'],
	BusinessMeeting: ['attributes_start', 'attributes_end', 'attributes_public'],
	BusinessMessage: ['attributes_text', 'attributes_icon', 'attributes_image', 'attributes_video', 'attributes_staff', 'attributes_usage_user', 'attributes_usage_max', 'attributes_usage_count', "attributes_impressions_count",  "attributes_impression_per_user", "attributes_impression_max" ],
	BusinessPackage: ['attributes_message', 'attributes_business_discount', 'attributes_business_benefits', 'attributes_business_pricing', 'attributes_benefits', 'attributes_pricing', 'attributes_expiration', 'attributes_start', 'attributes_end' ],
	BusinessPricing: ['attributes_amount', 'attributes_month'],
	BusinessRequest: ['attributes_minimum', 'attributes_maximum'],
	BusinessSponsorship: ['attributes_amount', 'attributes_fee', 'attributes_month', 'attributes_business_association', 'attributes_business_meeting', 'attributes_business_pricing', 'attributes_expiration', 'attributes_start', 'attributes_end' ],

	
	// hr
	BusinessEmployeeBenefit: ['attributes_amount', 'attributes_provider'],
	BusinessExpertise: ['attributes_time', 'attributes_provider'],
	BusinessJob: ['attributes_salary_minimum', 'attributes_salary_maximum', 'attributes_start', "attributes_end", "attributes_expertise"],
	BusinessStaff: ['attributes_profile', 'attributes_base', 'attributes_salary', "attributes_date_start", "attributes_date_end", "attributes_business_job", "attributes_status"],
	
	// awards and news
	BusinessAward: ['attributes_staff', 'attributes_start', 'attributes_end', 'attributes_expiration'], 
	BusinessContent: ['attributes_text', 'attributes_staff', 'attributes_icon', 'attributes_image', 'attributes_video'], 
}


// initiate data type other than String
let number = ["attributes_usage_user", "attributes_usage_max", "attributes_impression_per_user", "attributes_impression_max"]
let object = ["attributes_usage_count", "attributes_impression_count"]
let references ={
	attributes_business_message: 'businessMessages', attributes_business_discount: "businessDiscounts", attributes_business_association: "places", attributes_business_meeting: "businessMeetings", attributes_business_pricing: "businessPricings", attributes_provider: "places", attributes_profile: "profiles", attributes_business_job: "businessJobs"
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
	pre_schema.attributes_pricing = Number;
	pre_schema.attributes_title = String;
	pre_schema.attributes_type = String;
	pre_schema.attributes_description = String;
	pre_schema.created_at = { type: Date, default: Date.now }
	// assign the mongoose schema
	output[name] = mongoose.model(name, new Schema(pre_schema));
})

module.exports = output
