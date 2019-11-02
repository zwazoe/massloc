const express = require('express');
const router = express.Router();
const Brain = require('../Brain');

// Load Availabilitys Models
const Collection = require('../../../../models/place/hr/BusinessStaff');


//create-many
let item = {
	Collection,
	router
}

let collection = new Brain.CRUD(item)

collection.Run()

module.exports = router;
