const { MAD, MadValues } = require('../index.js');

let req = {
	body: {
		name: 'Medium | Large | Small | XXL',

		attributes_measurements: 'LB|Inch|',
		attributes_fields: 'Weight | Height | Width | ',
		attributes_values: '32 | 68 | 48 | 56',
		field_name:
   'Portfolio|Access|AgeRange |Availability|Booking|Credential|DateRange|Description|Discount|FileManagement|Gallery|Lifespan|Grouping|Pricing|Product|ProductName|QuantityRange|Question|SizeRange|Section|TimeRange|Variation|Warranty|Wholesale|Profile|Document|Location|Category|BusinessAward|Business|BusinessBenefit|BusinessContent|BusinessDiscount|BusinessEmployeeBenefit|BusinessExpertise|BusinessJob|BusinessRequest|BusinessMeeting|BusinessMessage|BusinessPackage|BusinessPricing|BusinessSponsorship|',
		field_variation:
   'AgeRange=5d530e1a5e85690b4411a5b5 |AgeRange=5d530e1a5e85690b4411a5b6 |AgeRange=5d530e1a5e85690b4411a5b7 |Availability=5d5320e35e85690b4411a5c8 |Availability=5d5320e35e85690b4411a5c7 |DateRange=5d5310db5e85690b4411a5bb |DateRange=5d5310db5e85690b4411a5ba |Days=5d53110f5e85690b4411a5bc |Days=5d53110f5e85690b4411a5bd |Days=5d5311655e85690b4411a5be |Discount=5d531d5b5e85690b4411a5c3 |Discount=5d531d5b5e85690b4411a5c4 |Discount=5d531d5b5e85690b4411a5c5 |Discount=5d531d5b5e85690b4411a5c6 |',
				category_name: 'category',
		category_value: 'category.afsfdkfsfs',
		group_alias: 'Shirt| Shoes|',
		group_description:
			'this item works best for the rest|  I am writting another description | This is the third and last description',
		public: 'true',

		published: 'true',
		owner: '5b1e87c4f9e3a6ddec3a6f1b',
		creator: '5b1e87c4f9e3a6ddec3a6f1b',
		updated_at: Date.now()
	}
};

const mad = new MAD(
	req.body, // data source
	'name', // the form name
	[ '_', '|', '=' ], // spliters: key, value, and options (opitions uses on demarel)
	[ 'attributes' ], // melel field which will get by rows.
	[ 'field', 'category' ], //// demarel fields which will mix and match it.
	{
		attache: [],
		overide: {
			owner: 'place.id',
			creator: 'profile.id'
		},
		includeKeys: {
			demare: false,
			// if false, this will not output the "group" on the keys. i.e. group_description: "this is a description" it will be only description.
			group: true,
			mare: true
		},
		group: 'group',
		groupCompletion: true
	}
);

const payload = mad.run();

const madValues = new MadValues(
	payload,
	[ 'attributes' ],
	(addOnSource = []),
	(options = {
		skip: [ 'created_at', 'field', 'owner', 'creator', '_id' ],
		keyed: {
			key: true,
			valueAsKey: false,
			categoryAsKey: true,
			valueKey: 'values',
			prefix: 'option_',
			suffix: '_option',
			addOnKeys: {
				include: true,
				prefix: 'value__',
				categoryKey: 'types',
				spaceReplacer: '__',
				addOns: {
					creator: '00934803408',
					somone: '0408373'
				}
			}
		}
	})
);

let values = madValues.run();

console.log(JSON.stringify(payload, null, 4));
console.log(JSON.stringify(payload, null, 4));
