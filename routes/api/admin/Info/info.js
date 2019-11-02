const express = require('express');
const router = express.Router();
const Brain = require('../InfoBrain');

//create-many
let item = {
	Collection: '',
	router
}

let collection = new Brain.CRUD(item)

collection.Run()

module.exports = router;
