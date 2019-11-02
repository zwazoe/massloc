const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Groupings Models
const { Grouping } = require('../../../../models/things');


//create-many
let item = { Grouping: { Collection: Grouping, router} }

// includes collections, true for all items, and then the associated attributes
let product = new Brain.CRUD(item.Grouping, true, 'owner')
product.Run()

module.exports = router;
