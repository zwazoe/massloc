const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load SizeRanges Models
const { SizeRange } = require('../../../../models/things');


//create-many
let item = { SizeRange: { Collection: SizeRange, router} }

// includes collections, true for all items, and then the associated attributes
let product = new Brain.CRUD(item.SizeRange, true, 'owner')
product.Run()

module.exports = router;
