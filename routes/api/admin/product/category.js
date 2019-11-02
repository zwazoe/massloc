const express = require('express');
const router = express.Router();
const Brain = require('../../things/Brain');

// Load Categorys Models
const {Collection} = require('../../../../models/admin/product/');


//create-many
let item = {
	Collection,
	router
}

let collection = new Brain.CRUD(item)

collection.Run()

module.exports = router;
