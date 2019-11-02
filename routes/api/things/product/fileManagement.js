const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load FileManagements Models
const { FileManagement } = require('../../../../models/things');


//create-many
let item = { FileManagement: { Collection: FileManagement, router} }

// includes collections, true for all items, and then the associated attributes
let product = new Brain.CRUD(item.FileManagement, true, 'owner')
product.Run()

module.exports = router;
