const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Warrantys Models
const { Warranty } = require('../../../../models/things');


//create-many
let item = { Warranty: { Collection: Warranty, router} }

// includes collections, true for all items, and then the associated attributes
let warranty = new Brain.CRUD(item.Warranty, true, 'owner')
warranty.Run()

module.exports = router;
