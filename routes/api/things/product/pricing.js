const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Pricings Models
const { Pricing } = require('../../../../models/things');


//create-many
let item = { Pricing: { Collection: Pricing, router} }

// includes collections, true for all items, and then the associated attributes
let product = new Brain.CRUD(item.Pricing, true, 'owner')
product.Run()

module.exports = router;
