const express = require('express');
const router = express.Router();
const Brain = require('./Brain');
const {Product} = require('../../../models/things');
let item = { Collection: Product, router }
let collection = new Brain.CRUD(item, true, 'owner')
collection.Run()
module.exports = router;