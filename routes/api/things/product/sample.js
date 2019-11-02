const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Sameples Models
const { Sameple } = require('../../../../models/things');


//create-many
let item = { Sameple: { Collection: Sameple, router} }

// includes collections, true for all items, and then the associated attributes
let product = new Brain.CRUD(item.Sameple, true, 'owner')
product.Run()

module.exports = router;
