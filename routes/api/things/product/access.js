const express = require('express');
const router = express.Router();
const Brain = require('../Brain');

// Load AgeRanges Models
const Access = require('../../../../models/things');


//create-many
let item = {
	Collection: Access,
	router
}

let access = new Brain.CRUD(item)

access.Run()

module.exports = router;
