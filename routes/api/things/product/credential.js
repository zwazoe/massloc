const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Credentials Models
const { Credential } = require('../../../../models/things');


//create-many
let item = { Credential: { Collection: Credential, router} }

// includes collections, true for all items, and then the associated attributes
let credential = new Brain.CRUD(item.Credential, true, 'owner')
credential.Run()

module.exports = router;
