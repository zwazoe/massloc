const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let collections = {
	Access: ['attributes_right', 'attributes_transferable'], 
	Agent: ['attributes_availability', 'attributes_daterange', 'attributes_discount', 'attributes_productname', 'attributes_quantityrange','attributes_warranty', 'attributes_wholesale'], 
	AgeRange: ['attributes_age_start', 'attributes_age_end'], 
	Availability: ['attributes_minimum', 'attributes_maximum',  "attributes_per_owner","attributes_per_order", 'attributes_back_order'], 
	Booking: [
		'attributes_date_start', 'attributes_date_end', 'attributes_time_start', 'attributes_time_end', 'attributes_minimum', 'attributes_maximum', 
	], 
	Credential: ['attributes_expiration', 'attributes_start', 'attributes_end', 'attributes_staff'], 
	DateRange: ['attributes_date_start', 'attributes_date_end', 'attributes_time_range'], 
	Days: ["attributes_monday","attributes_tuesday","attributes_wednesday", "attributes_thursday", "attributes_friday", "attributes_saturday", "attributes_sunday"], 
	Description: ['attributes_header', 'attributes_content'], 
	Discount: ['attributes_amount', 'attributes_code', 'attributes_max_usage', 'attributes_user_usage', 'attributes_kickback'], 
	FileManagement: ['attributes_link', 'attributes_type', 'attributes_required', 'attributes_expiration'], 
	Gallery: ['attributes_link', 'attributes_content'], 
	Grouping: ['attributes_access', 'attributes_agerange', 'attributes_availability', 'attributes_booking', 'attributes_credential', 'attributes_daterange', 'attributes_description', 'attributes_discount', 'attributes_filemanagement', 'attributes_gallery', 'attributes_lifespan', 'attributes_grouping', 'attributes_pricing', 'attributes_product', 'attributes_productname', 'attributes_quantityrange', 'attributes_question', 'attributes_sizerange', 'attributes_timerange', 'attributes_variation', 'attributes_warranty', 'attributes_wholesale'], 
	Lifespan: ['attributes_amount', 'attributes_deviation', 'attributes_expansion', 'attributes_diminish',  'attributes_type'], 
	Pricing: ['attributes_amount', 'attributes_minimum', 'attributes_maximum'], 
	ProductName: ['attributes_prefix', 'attributes_suffix', "attributes_name_change"], 
	QuantityRange: ['attributes_content'], 
	Question: ['attributes_question', 'attributes_example', 'attributes_required'], 
	Product: ['attributes_description', 'attributes_icon', 'attributes_image', 'attributes_video', 'attributes_parent', 'attributes_category', 'attributes_influencer', 'attributes_staff', 'attributes_brand', 'attributes_culture', 'attributes_award'], 
	SizeRange: ['attributes_amount', 'attributes_field' ], 
	TimeRange: ['attributes_time_start', 'attributes_time_end', 'attributes_days'], 
	Variation: [ 'attributes_max_product_qty', 'attributes_option', 'attributes_included'], 
	Warranty: ['attributes_packaging', 'attributes_usage', 'attributes_content'], 
	Wholesale: ['attributes_minimum',  'attributes_maximum','attributes_discount',], 
	// People
}


// initiate data type other than String
let number = ["processed", "total"]
let references ={
	attributes_influencer: "messages",
	 attributes_staff: 'profiles', 
	 attributes_brand: "businesses", 
	 attributes_culture: "businesses", 
	 attributes_award: "awards", 
	 attributes_discount: "discount", 
	 attributes_days: 'days'
}

// initiate the function that will assign the data type to the fields
let dataType = (key) => {
	    
	if(number.includes(key)){ return Number } // if it inclues in the number above
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
	pre_schema.attributes_agent = [{ type: Schema.Types.ObjectId, ref: 'agents'}]
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
