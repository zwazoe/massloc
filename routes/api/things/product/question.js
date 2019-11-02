const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Questions Models
const { Question } = require('../../../../models/things');


//create-many
let item = { Question: { Collection: Question, router} }

// includes collections, true for all items, and then the associated attributes
let product = new Brain.CRUD(item.Question, true, 'owner')
product.Run()

module.exports = router;
