const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load QuantityRanges Models
const { QuantityRange } = require('../../../../models/things');


//create-many
let item = { QuantityRange: { Collection: QuantityRange, router} }

// includes collections, true for all items, and then the associated attributes
let product = new Brain.CRUD(item.QuantityRange, true, 'owner')
product.Run()

module.exports = router;
