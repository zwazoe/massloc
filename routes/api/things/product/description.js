const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Descriptions Models
const { Description } = require('../../../../models/things');


//create-many
let item = { Description: { Collection: Description, router} }

// includes collections, true for all items, and then the associated attributes
let description = new Brain.CRUD(item.Description, true, 'owner')
description.Run()

module.exports = router;
