const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Gallerys Models
const { Gallery } = require('../../../../models/things');


//create-many
let item = { Gallery: { Collection: Gallery, router} }

// includes collections, true for all items, and then the associated attributes
let product = new Brain.CRUD(item.Gallery, true, 'owner')
product.Run()

module.exports = router;
