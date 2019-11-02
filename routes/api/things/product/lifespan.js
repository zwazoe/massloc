const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Lifespans Models
const { Lifespan } = require('../../../../models/things');


//create-many
let item = { Lifespan: { Collection: Lifespan, router} }

// includes collections, true for all items, and then the associated attributes
let product = new Brain.CRUD(item.Lifespan, true, 'owner')
product.Run()

module.exports = router;
