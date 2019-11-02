const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load DateRanges Models
const { DateRange } = require('../../../../models/things');


//create-many
let item = { DateRange: { Collection: DateRange, router} }

// includes collections, true for all items, and then the associated attributes
let dateRange = new Brain.CRUD(item.DateRange, true, 'owner')
dateRange.Run()

module.exports = router;
