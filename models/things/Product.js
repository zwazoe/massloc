const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Product: Item } = require('./index')

//create schema
const ItemSchema = new Schema({
    attributes_image:  String, attributes_price: String ,attributes_title: String,  attributes_section: [{ type: Schema.Types.ObjectId, ref: 'sections'}],  attributes_category: [{ type: Schema.Types.ObjectId, ref: 'categories'}], 
associates_influencer: [{ type: Schema.Types.ObjectId, ref: 'message'}], associates_staff: [{ type: Schema.Types.ObjectId, ref: 'profiles'}], associates_brand: [{ type: Schema.Types.ObjectId, ref: 'associates'}], associates_culture: [{ type: Schema.Types.ObjectId, ref: 'associates'}], associates_award: [{ type: Schema.Types.ObjectId, ref: 'awards'}],
});

module.exports = Product = mongoose.model('Product', ItemSchema);

