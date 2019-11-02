const express = require('express');
const router = express.Router();
const Brain = require('./Brain');


// Load Product Models
const BusinessBenefits = require('../../../models/places/business/BusinessBenefits');
const BusinessDiscount = require('../../../models/places/business/BusinessDiscount');
const BusinessMessage = require('../../../models/places/business/BusinessMessage');
const BusinessPackage = require('../../../models/places/business/BusinessPackage');
const BusinessPricing = require('../../../models/places/business/BusinessPricing');
const BusinessRequest = require('../../../models/places/business/BusinessRequest');
//content
const BusinessContent = require('../../../models/places/content/BusinessContent');
const BusinessAward = require('../../../models/places/content/BusinessAward');

//hr
const BusinessEmployeeBenefit = require('../../../models/places/job/BusinessEmployeeBenefit');
const BusinessJob = require('../../../models/places/job/BusinessJob');

// initialized Crud

const businessBenefits  = new Brain.CRUD(BusinessBenefits)
const businessDiscount  = new Brain.CRUD(BusinessDiscount)
const businessMessage  = new Brain.CRUD(BusinessMessage)
const businessPackage  = new Brain.CRUD(BusinessPackage)
const businessPricing  = new Brain.CRUD(BusinessPricing)
const businessRequest  = new Brain.CRUD(BusinessRequest)
const businessContent  = new Brain.CRUD(BusinessContent)
const businessAward  = new Brain.CRUD(BusinessAward)
const businessEmployeeBenefit  = new Brain.CRUD(BusinessEmployeeBenefit)
const BusinessJob  = new Brain.CRUD(BusinessJob)


// export the crud
module.exports.BusinessBenefits = businessBenefits.Run();
module.exports.BusinessDiscount = businessDiscount.Run();
module.exports.BusinessMessage = businessMessage.Run();
module.exports.BusinessPackage = businessPackage.Run();
module.exports.BusinessPricing = businessPricing.Run();
module.exports.BusinessRequest = businessRequest.Run();
module.exports.BusinessContent = businessContent.Run();
module.exports.BusinessAward = businessAward.Run();
module.exports.BusinessEmployeeBenefit = businessEmployeeBenefit.Run();
module.exports.BusinessJob = businessJob.Run();


module.exports = router;
