const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Sections Models
const { Section } = require('../../../../models/things/Section');


//create-many
let item = { Section: { Collection: Section, router} }

// includes collections, true for all items, and then the associated attributes
let product = new Brain.CRUD(item.Section, true, 'owner')
product.Run()

module.exports = router;
