const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load AgeRanges Models
const { AgeRange } = require('../../../../models/things');


//create-many
let item = { AgeRange: { Collection: AgeRange, router} }

// includes collections, true for all items, and then the associated attributes
let ageRange = new Brain.CRUD(item.AgeRange, true, 'owner')
ageRange.Run()

module.exports = router;
