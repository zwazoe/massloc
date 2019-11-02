const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Wholesales Models
const { Wholesale } = require('../../../../models/things');


//create-many
let item = { Wholesale: { Collection: Wholesale, router} }

// includes collections, true for all items, and then the associated attributes
let wholesale = new Brain.CRUD(item.Wholesale, true, 'owner')
wholesale.Run()

module.exports = router;
