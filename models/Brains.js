const mongoose = require('mongoose');

// const Main = require('./things/product/Main')

const Process = (Schema, collections = {}, number = [], boolean=[]) => {
    let output = {};
    let dataType = (key) => {
        if(number.includes(key)){
            return Number
        } else if (boolean.includes(key)){
            return Boolean
        } else {
            return String
        }
    }
    let collections_object= Object.entries(collections)
    collections_object.map((items) => {
        let name = items[0];
        let payload = items[1]
        let schema = {
            ...payload,
            attributes_title: String, attributes_price: String, attributes_section: [{ type: Schema.Types.ObjectId, ref: 'sections'}], attributes_published: { type: String, default: 'true'},  attributes_public: { type: String,  default: 'false' },
        }
       
        // console.log(payload)
        output[name] = mongoose.model(name, new Schema(schema));
    })
    // console.log(Schema)

    return output;
}
module.exports = {
    Process
}