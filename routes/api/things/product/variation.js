const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Variations Models
const { Variation } = require('../../../../models/things');


//create-many
let item = { Variation: { Collection: Variation, router} }

// includes collections, true for all items, and then the associated attributes
let variation = new Brain.CRUD(item.Variation, true, 'owner')
variation.Run()

module.exports = router;
