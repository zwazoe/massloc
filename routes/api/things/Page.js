const express = require('express');
const router = express.Router();
const Brain = require('./Brain');


// Load Product Models
const Sample = require('../../../models/things/product/Sample');
const Access = require('../../../models/things/product/Sample');
const AgeRange = require('../../../models/things/product/Sample');
const Availability = require('../../../models/things/product/Sample');
const Booking = require('../../../models/things/product/Sample');
const Credential = require('../../../models/things/product/Sample');
const DateRange = require('../../../models/things/product/Sample');
const Description = require('../../../models/things/product/Sample');
const Discount = require('../../../models/things/product/Sample');
const FileManagement = require('../../../models/things/product/Sample');
const Gallery = require('../../../models/things/product/Sample');
const Lifespan = require('../../../models/things/product/Sample');
const Grouping = require('../../../models/things/product/Sample');
const Pricing = require('../../../models/things/product/Sample');
const Product = require('../../../models/things/product/Sample');
const ProductName = require('../../../models/things/product/Sample');
const QuantityRange = require('../../../models/things/product/Sample');
const Question = require('../../../models/things/product/Grouping');
const SizeRange = require('../../../models/things/product/Sample');
const Strategy = require('../../../models/things/product/Sample');
const TimeRange = require('../../../models/things/product/Sample');
const Variation = require('../../../models/things/product/Sample');
const Warranty = require('../../../models/things/product/Sample');
const Wholesale = require('../../../models/things/product/Sample');

//  init item

let Item = { 
	Sample: { Collection: Sample},
	Access: {Collection: Access},
	AgeRange: {Collection: AgeRange},
	Availability: {Collection: Availability},
	Booking: {Collection: Booking},
	Credential: {Collection: Credential},
	DateRange: {Collection: DateRange},
	Description: {Collection: Description},
	Discount: {Collection: Discount},
	FileManagement: {Collection: FileManagement},
	Gallery: {Collection: Gallery},
	Lifespan: {Collection: Lifespan},
	Grouping: {Collection: Grouping},
	Pricing: {Collection: Pricing},
	Product: {Collection: Product},
	ProductName: {Collection: ProductName},
	QuantityRange: {Collection: QuantityRange},
	Question: {Collection: Question},
	SizeRange: {Collection: SizeRange},
	Strategy: {Collection: Strategy},
	TimeRange: {Collection: TimeRange},
	Variation: {Collection: Variation},
	Warranty: {Collection: Warranty},
	Wholesale: {Collection: Wholesale}
}

// initialized Crud

const SampleCrud  = new Brain.CRUD(Item.Sample)
const AccessCrud  = new Brain.CRUD(Item.Access)
const AgeRangeCrud  = new Brain.CRUD(Item.AgeRange)
const AvailabilityCrud  = new Brain.CRUD(Item.Availability)
const BookingCrud  = new Brain.CRUD(Item.Booking)
const CredentialCrud  = new Brain.CRUD(Item.Credential)
const DateRangeCrud  = new Brain.CRUD(Item.DateRange)
const DescriptionCrud  = new Brain.CRUD(Item.Description)
const DiscountCrud  = new Brain.CRUD(Item.Discount)
const FileManagementCrud  = new Brain.CRUD(Item.FileManagement)
const GalleryCrud  = new Brain.CRUD(Item.Gallery)
const LifespanCrud  = new Brain.CRUD(Item.Lifespan)
const GroupingCrud  = new Brain.CRUD(Item.Grouping)
const PricingCrud  = new Brain.CRUD(Item.Pricing)
const ProductCrud  = new Brain.CRUD(Item.Product)
const ProductNameCrud  = new Brain.CRUD(Item.ProductName)
const QuantityRangeCrud  = new Brain.CRUD(Item.QuantityRange)
const QuestionCrud  = new Brain.CRUD(Item.Question)
const SizeRangeCrud  = new Brain.CRUD(Item.SizeRange)
const StrategyCrud  = new Brain.CRUD(Item.Strategy)
const TimeRangeCrud  = new Brain.CRUD(Item.TimeRange)
const VariationCrud  = new Brain.CRUD(Item.Variation)
const WarrantyCrud  = new Brain.CRUD(Item.Warranty)
const WholesaleCrud  = new Brain.CRUD(Item.Wholesale)

// export the crud
module.exports.Sample = SampleCrud.Run();
module.exports.Access = AccessCrud.Run();

module.exports.AgeRange = () => {AgeRangeCrud.Run(); module.exports = router};

module.exports.Availability = AvailabilityCrud.Run();
module.exports.Booking = BookingCrud.Run();
module.exports.Credential = CredentialCrud.Run();
module.exports.DateRange = DateRangeCrud.Run();
module.exports.Description = DescriptionCrud.Run();
module.exports.Discount = DiscountCrud.Run();
module.exports.FileManagement = FileManagementCrud.Run();
module.exports.Gallery = GalleryCrud.Run();
module.exports.Lifespan = LifespanCrud.Run();
module.exports.Grouping = GroupingCrud.Run();
module.exports.Pricing = PricingCrud.Run();
module.exports.Product = ProductCrud.Run();
module.exports.ProductName = ProductNameCrud.Run();
module.exports.QuantityRange = QuantityRangeCrud.Run();
module.exports.Question = QuestionCrud.Run();
module.exports.SizeRange = SizeRangeCrud.Run();
module.exports.Strategy = StrategyCrud.Run();
module.exports.TimeRange = TimeRangeCrud.Run();
module.exports.Variation = VariationCrud.Run();
module.exports.Warranty = WarrantyCrud.Run();
module.exports.Wholesale = WholesaleCrud.Run();


module.exports = router;
