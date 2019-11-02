const express = require('express');
const router = express.Router();
const Brain = require('../Brain');


// Load Products Models
const { Access, Product } = require('../../../../models/things');


//create-many
let item = { 
	Access: { Collection: Access, router},
	AgeRange: { Collection: AgeRange, router},
	Availability: { Collection: Availability, router},
	Booking: { Collection: Booking, router},
	Credential: { Collection: Credential, router},
	DateRange: { Collection: DateRange, router},
	Description: { Collection: Description, router},
	Discount: { Collection: Discount, router},
	FileManagement: { Collection: FileManagement, router},
	Gallery: { Collection: Gallery, router},
	Grouping: { Collection: Grouping, router},
	Lifespan: { Collection: Lifespan, router},
	Pricing: { Collection: Pricing, router},
	Product: { Collection: Product, router},
	SizeRange: { Collection: SizeRange, router},
	TimeRange: { Collection: TimeRange, router},
	Variation: { Collection: Variation, router},
	Warranty: { Collection: Warranty, router},
	Wholesale: { Collection: Wholesale, router},
}

new Brain.CRUD(item.Product, true, 'owner').Run()
new Brain.CRUD(item.Access, true, 'owner').Run()

module.exports = router;
