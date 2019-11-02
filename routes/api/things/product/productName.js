const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load ProductNames Models
const { ProductName } = require('../../../../models/things');


//create-many
let item = { ProductName: { Collection: ProductName, router} }

// includes collections, true for all items, and then the associated attributes
let product = new Brain.CRUD(item.ProductName, true, 'owner')
product.Run()

module.exports = router;
