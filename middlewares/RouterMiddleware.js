exports.MadCollectionProcessor = (Mad, process) => {
	let processing = {
		body: {
			names: [],
			attributes: []
		},
		parted: [],
		sanitized: {},
		names: {},
		property: {
			all: [],
			items: [],
			subitems: []
		}
	};

	let names = [];
	let attributes = [];

	if (Mad.name) {
		processing.body.names = Mad.name.split('|');
	}
	if (Mad[process]) {
		processing.body.attributes = Mad[process].split('|');
	}

	let sanitized = (arr) => {
		let output = [];
		arr.forEach((element) => {
			let trimmed = element.trim();
			if (trimmed && trimmed.length > 0) {
				output.push(trimmed);
			}
		});

		return output;
	};
	processing.sanitized.names = sanitized(processing.body.names);
	processing.sanitized.attributes = sanitized(processing.body.attributes);

	processing.sanitized.attributes.forEach((attributes) => {
		processing.parted.push(attributes.split('-'));
	});

	processing.parted.forEach((element, index) => {
		if (element[0] === 'all') {
			if (!processing.property.all.includes(element[1])) {
				processing.property.all.push(element[1]);
			}
		}
	});

	processing.parted.forEach((element, index) => {
		if (!processing.property.all.includes(element[0]) && element[0] !== 'all') {
			if (!processing.property.items.includes(element[0])) {
				processing.property.items.push(element[0]);
			}

			if (!processing.property.subitems.includes(element[1])) {
				processing.property.subitems.push(element[1]);
			}
		}
	});

	return processing.property;
};

let GetAll = (all, type) => {
	let output = [];
	// Purpose: This should filter out what we don't need and keep what we need.
	{
		/*
			Outcome: Sections
			[{
				name: sections name,
				_id: section id
				attributes: [
					{
						section attributes.
						if all, it will contain all sections attribute.s
						if some, it will only contain what it requires. 
					}
				]
			}]
	
			Outcome: Options and Controls.
	
			[
				[all group ids],
				{
					group attributes.
					if all, it will contain all of the groups.
					if some, it will contain what is required. 
				}
			]
		*/
	}

	all.forEach((collection) => {
		if (type === 'sections') {
			// work with only sections
			// create a temporary object that will be assined name, id, and attributes
			let temp = {};
			temp._id = collection._id;
			temp.name = collection.name;
			temp.attributes = collection.attributes;

			/** 
			 * Temp should be:
			 * {
			 * 	_id: 'fajfhfsalfhs',
			 * name: "some name",
			 * attributes: [{attribute}, {attribute}]
			 * }
			 */
			output.push(temp);
		} else if (type === 'options' || type === 'controls') {
			// work only with options and controls

			/**
			 * attribute should be:
			 * [
			 * 		{
			 * 			attributes keys
			 * 		}
			 * ]
			 */

			collection.attributes.forEach((attribute) => {
				output.push(attribute);
			});
		}
	});

	return output;
};

exports.MapFilterGetCollections = (collections, processed, type) => {
	let all = collections.filter((collection) => processed.all.includes(String(collection._id)));
	let items = collections.filter((collection) => processed.items.includes(String(collection._id)));

	let output = [];
	// MAP out all of the collections
	let getAll = GetAll(all, type);

	if (Array.isArray(getAll)) {
		output = getAll;
	}

	// get all of some collections
	let getSome = GetAll(items, type);
	let some;

	// conditionally only get some for sections and for options or controls
	if (type === 'sections') {
		getSome.forEach((collection) => {
			let newAttributes = collection;
			let subitems = newAttributes.attributes.filter((collection) =>
				processed.subitems.includes(String(collection._id))
			);
			newAttributes.attributes = subitems;
			output.push(newAttributes);
		});
	} else if (type === 'options' || type === 'controls') {
		some = getSome.filter((collection) => processed.subitems.includes(String(collection._id)));
		some.map((collection) => output.push(collection));
	}

	return output;
};
