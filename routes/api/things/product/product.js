const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Products Models
const { Product } = require('../../../../models/things');


//create-many
let item = { Product: { Collection: Product, router} }

// includes collections, true for all items, and then the associated attributes
new Brain.CRUD(item.Product, true, 'owner').Run()

module.exports = router;
