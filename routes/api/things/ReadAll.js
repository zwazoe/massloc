const express = require('express');
const router = express.Router();
const Brain = require('./Brain');
const {Product} = require('../../../models/things');
let item = { Collection: Product, router }
let entries = [
	"Access", "AgeRange", "Availability", "Booking", "Credential", "DateRange", "Description", "Discount", "FileManagement", "Gallery", "Lifespan", "Grouping", "Pricing", "Product", "ProductName", "QuantityRange", "Question", "SizeRange", "TimeRange", "Variation", "Warranty", "Wholesale", "Section",
	"Category",
	"BusinessAward", "BusinessBenefit", "BusinessContent", "BusinessDiscount", "BusinessEmployeeBenefit","BusinessExpertise", "BusinessJob", "BusinessMeeting", "BusinessMessage", "BusinessPackage", "BusinessPricing", "BusinessRequest", "BusinessSponsorship", "BusinessStaff", 
]
let collection = new Brain.CRUD(item, true, 'owner')
collection.ReadAll(entries)
module.exports = router;




