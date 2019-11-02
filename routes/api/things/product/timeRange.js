const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load TimeRanges Models
const { TimeRange } = require('../../../../models/things');


//create-many
let item = { TimeRange: { Collection: TimeRange, router} }

// includes collections, true for all items, and then the associated attributes
let product = new Brain.CRUD(item.TimeRange, true, 'owner')
product.Run()

module.exports = router;
