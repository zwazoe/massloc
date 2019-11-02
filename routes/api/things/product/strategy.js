const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Strategys Models
const { Strategy } = require('../../../../models/things');


//create-many
let item = { Strategy: { Collection: Strategy, router} }

// includes collections, true for all items, and then the associated attributes
let strategy = new Brain.CRUD(item.Strategy, true, 'owner')
strategy.Run()

module.exports = router;
