const express = require('express');
const router = express.Router();
const { ObjectMatchMaker } = require('object-match-maker');
const passport = require('passport');
const Moment = require('moment');
const { MAD, MadValues } = require('mad-form');
// const { MAD, MadValues } = require('../../../libraries/madform/index');
const ObjectArray = input => {
	const entries = Object.entries(input);
	let output = []
	entries.map(entry => output.push(entry[1]));
	return output;
}


// Load Business Modelsgd
const Business = require('../../../models/place/business/Business');

// Load Option Models
const ContributingOptions = require('../../../models/admin/Options');

// collections
const { Access, Agent, AgeRange, Availability, Booking, Credential, DateRange, Days, Description, Discount, FileManagement, Gallery, Lifespan, Grouping, Pricing, Product, ProductName, QuantityRange, Question, SizeRange, Strategy, TimeRange, Variation, Warranty, Wholesale } = require('../../../models/things');

const Section = require('../../../models/things/Section');


const { Profile, Portfolio, Document, Location } = require('../../../models/people/');

const { BusinessAward, BusinessBenefit, BusinessContent, BusinessDiscount, BusinessEmployeeBenefit, BusinessExpertise, BusinessJob, BusinessRequest, BusinessMeeting, BusinessMessage, BusinessPackage, BusinessPricing, BusinessSponsorship, BusinessStaff } = require('../../../models/place/');

const { Category } = require('../../../models/admin');


const Collections = {
	// products
	Access, Agent, AgeRange, Availability, Booking, Credential, DateRange, Days, Description, Discount, FileManagement, Gallery, Lifespan, Grouping, Pricing, Product, ProductName, QuantityRange, Question, SizeRange, Strategy, Section, TimeRange, Variation, Warranty, Wholesale,
	// places
	Business,
	BusinessAward, BusinessBenefit, BusinessContent, BusinessDiscount, BusinessEmployeeBenefit, BusinessExpertise, BusinessJob, BusinessRequest, BusinessMeeting, BusinessMessage, BusinessPackage, BusinessPricing, BusinessSponsorship, BusinessStaff,
	// admin
	Category,
	// People
	Profile, Portfolio, Document, Location

}

class CRUD {
	constructor(item, all = false, associated = ['owner']) {
		this.profile_type = item.profile_type ? item.profile_type : "main"
		this.place_status = item.place_status ? item.place_status : "claimed"
		this.router = item.router ? item.router : router
		this.all = all;
		this.associated = associated;
	}

	LowerCaseCollections(item) {
		item = item ? item.toLowerCase() : ''
		let output = {
			// products
			access: Access,
			agent: Agent,
			agerange: AgeRange,
			availability: Availability,
			booking: Booking,
			credential: Credential,
			daterange: DateRange,
			days: Days,
			description: Description,
			discount: Discount,
			filemanagement: FileManagement,
			gallery: Gallery,
			lifespan: Lifespan,
			grouping: Grouping,
			pricing: Pricing,
			product: Product,
			productname: ProductName,
			quantityrange: QuantityRange,
			question: Question,
			sizerange: SizeRange,
			strategy: Strategy,
			section: Section,
			timerange: TimeRange,
			variation: Variation,
			warranty: Warranty,
			wholesale: Wholesale,
			// places
			business: Business,
			businesswward: BusinessAward,
			businessbenefit: BusinessBenefit,
			businesscontent: BusinessContent,
			businessdiscount: BusinessDiscount,
			businessemployeebenefit: BusinessEmployeeBenefit,
			businessexpertise: BusinessExpertise,
			businessjob: BusinessJob,
			businessrequest: BusinessRequest,
			businessmeeting: BusinessMeeting,
			businessmessage: BusinessMessage,
			businesspackage: BusinessPackage,
			businesspricing: BusinessPricing,
			businesssponsorship: BusinessSponsorship,
			businessstaff: BusinessStaff,
			// admin
			category: Category,
			// People
			profile: Profile,
			portfolio: Portfolio,
			document: Document,
			location: Location
		}

		return output[item];
	}

	CreateItem(req, res, Collection, collection, payload, noBusiness = [], profile = null, place = null) {

		let overide = {}
		if (place) { overide.owner = place._id }
		if (profile) { overide.creator = profile }
		const mad = new MAD(
			payload, // data source
			'name', // the form name
			['_', '|', '='], // spliters: key, value, and options (opitions uses on demarel)
			[''], // melel field which will get by rows.
			['field', 'category'], //// demarel fields which will mix and match it.
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
		const data = mad.run();
		console.log(payload, 'payload from brain')
		console.log(data, 'data from brain')

		// determine if the section is insert or update
		if (collection === "Section") {

			// console.log("data from brain",  data)
			let attributes = [];
			data.map((item) => {
				item.attributes_owner = place ? place._id : '';
				item.attributes_user = req.user.id
				attributes.push(item);
				let section_id = item.name.split("sectionid=")[1]
				// console.log("here goes the item", item);

				// Collection.updateOne({id: section_id}, item)


			})

			return Collection.insertMany(attributes).then((new_data) => {
				let payload = {
					collection,
					data: new_data
				}
				return new Promise(resolve => {
					resolve(payload)
				})
			}).then(payload => {
				// res.send(payload)
				return new Promise(resolve => {
					resolve(payload)
				})
			})
		} else if (noBusiness.includes(collection)) {

			// console.log("attemping to create", collection)
			return Collection.find({ attributes_user: req.user.id }).then(items => {



				let attributes = [];
				data[0].attributes.map((item) => {
					item.attributes_owner = place ? place._id : '';
					item.attributes_user = req.user.id
					attributes.push(item)
					// console.log("here goes the item", item)
				})
				attributes[0].attributes_default = 'true'
				if (items.length > 0) {
					let default_item = items.filter(item => item.attributes_default == 'true');

					if (default_item.length > 0) {
						attributes[0].attributes_default = false
					}
				}


				return attributes
			}).then(attributes => {
				// console.log('testing 4', attributes)

				// if (attributes) {
				// 	setTimeout(() => {
				// Collection.insertMany(attributes).then((new_data) => {
				// 	Collection.find({ attributes_user: req.user.id }).then(data => {
				// 		let payload = { collection: collection, data }
				// 		return new Promise(resolve => {
				// 			resolve(payload)
				// 		})

				// 		// if (!res.headerSent) { res.status(200).json(payload) }
				// 	})

				// })

				return Collection.insertMany(attributes).then((new_data) => {
					return new Promise(resolve => {
						resolve(new_data)
					})
				})

				// 	}, 1000)
				// }

			})
		} else {
			// console.log('testing 3')

			let attributes_section = [];
			let attributes_section_id = []
			// map through the section and only store the id of existing sections
			data.map((sections => {
				if (sections.name.includes("sectionid=")) {
					let id = sections.name.split("sectionid=")

					attributes_section_id.push(id[1])

				} else {
					attributes_section.push(sections)
				}
			}))
			// console.log( attributes_section, "attributes sections" )
			// console.log(attributes_section_id, "attributes_section_id")

			return Section.insertMany(attributes_section).then(new_sections => {
				return new Promise((resolve, reject) => {
					for (let index = 0; index <= new_sections.length; index++) {
						if (index !== new_sections.length) {
							// create it
							attributes_section_id.push(new_sections[index]._id)
						} else {
							resolve(attributes_section_id)
						}
					}
				}, (err) => {

					// console.log("Error: ", err.message)
				}).catch((error) => {
					// console.log("Error: ", error.message)
				})

			})
				.then(attributes_section => {
					let attributes = data[0].attributes
					// console.log(data)
					console.log(data[0], "data from brain")


					for (let index = 0; index <= attributes.length; index++) {
						if (index !== attributes.length) {
							attributes[index].attributes_section = attributes_section;
							attributes[index].attributes_owner = place ? place._id : '';
							attributes[index].attributes_user = req.user.id



						} else {
							// console.log("attributes before created", attributes)
							return Collection.insertMany(attributes).then((new_attributes) => {
								// console.log("inserted records, ", new_attributes)
								let payload = {
									collection,
									data: new_attributes
								}
								return new Promise(resolve => {
									resolve(payload)
								})
							})
						}
					}
				})
				.catch((err) => {
					// console.log("error: ", err.message)
				})
		}
	}

	CreateBusinessAssociations(req, res, collection, products, associations) {
		let association_object = associations;
		let associations_as_entries = Object.entries(associations)
		let product_for_found_place = {}
		let wait = []
		let wait_for_it = ''
		// console.log(associations)
		products.map(product => {
			let { attributes_place_association, attributes_employer_association, _id, attributes_title, attributes_user } = product
			let product_connections = {
				profile_id: _id,
				attributes_title,
				attributes_user,
				host_status: 'pending',
				associate_status: 'accepted',
				created_at: new Date

			}

			associations_as_entries.map(entries => {
				if (entries[0].toLowerCase() == attributes_place_association) {
					product_connections.field = 'attributes_place_association'
				}
				if (entries[0].toLowerCase() == attributes_employer_association) {
					product_connections.field = 'attributes_employer_association'
				}
				product_for_found_place[_id] = product_connections;

				// check to see if association exists
				association_object[entries[0]].association = association_object[entries[0]].association ? association_object[entries[0]].association : {}

				// check to see if connections exists
				association_object[entries[0]].association.connections = association_object[entries[0]].association.connections ? association_object[entries[0]].association.connections : {}
				// check to see if collection exists
				association_object[entries[0]].association.connections[collection] = association_object[entries[0]].association.connections[collection] ? association_object[entries[0]].association.connections[collection] : {}
				// assign the product
				association_object[entries[0]].association.connections[collection][_id] = product_connections
			})
		})



		let association_to_add = ObjectArray(association_object)

		// check and make sure that the business is new before readding it. 
		association_to_add.map(place => {
			let { google_place_id } = place
			let product_for_found_place = place.association.connections[collection]

			Business.findOne({ google_place_id }).then(found_place => {
				if (found_place) {
					// get the existing connection form the particuluar collection. 
					let found_place_connections = found_place.association.connections[collection] ? found_place.association.connections[collection] : {}

					// add the found place and update the product for found place.
					wait_for_it = ObjectMatchMaker([found_place_connections, product_for_found_place], 1, 0, 1, ['host_status', 'field', 'created_at']).then(collection_connection => {
						found_place.association.connections[collection] = collection_connection
						return Business.findOneAndUpdate({ google_place_id }, found_place, { new: false })
					}).then(item => {
						return item
					})
					wait.push(wait_for_it)
					// console.log(wait, 'from map')


				} else {
					wait_for_it = Business.create(place).then(item => {
						return item
					})
					wait.push(wait_for_it)
					// console.log(wait, 'from map')

				}

			})
		})


		// console.log(wait, "wait")

		setTimeout(() => {
			return Promise.all(wait)
		}, 1000)


	}

	Create() {
		this.router.post('/create/:collection/:profile_id', passport.authenticate('jwt', { session: false }), (req, res) => {
			let noProfile = ['Profile', 'Portfolio']
			let noBusiness = ['Profile,', 'Portfolio']
			let collection = req.params.collection;
			let Collection = Collections[collection];
			let profile_id = req.params.profile_id;
			let product_associations = req.body.attributes_associations
			// console.log(req.body, "here goes the payload", )
			// console.log(profile_id, 'no profile')

			// console.log('getting body ', req.body)
			if (noProfile.includes(collection)) {
				// console.log("creating...", collection, ': has no profile')
				this.CreateItem(req, res, Collection, collection, req.body, noProfile, profile_id)
					.then(created_products => {

						return this.CreateBusinessAssociations(req, res, collection, created_products, product_associations)
					}).then(association => {
						return Collection.find({ attributes_user: req.user.id })
					}).then((new_data) => {
						let payload = {
							collection,
							data: new_data
						}
						res.send(payload)
					})


			} else if (noBusiness.includes(collection)) {
				// console.log("creating...", collection, ': has no profile')
				Profile.findOne({ attributes_user: req.user.id, attributes_default: true }).then((profile) => {
					if (profile) {
						this.CreateItem(req, res, Collection, collection, req.body, noBusiness, profile_id)
							.then(created_products => {
								// console.log(created_products, 'payload from create products')
								return this.CreateBusinessAssociations(req, res, collection, created_products, product_associations)
							}).then(association => {
								return Collection.find({ attributes_owner: profile_id })

							}).then((new_data) => {
								let payload = {
									collection,
									data: new_data
								}
								res.send(payload)
							})

					} else {
						// console.log("you must first create a profile and claim  your business")
						res.status(204).json({ place: 'You must first create AND claim your business' });
					}
				})
			} else {

				Profile.findOne({ attributes_user: req.user.id, attributes_default: true }).then((profile) => {
					if (profile) {
						// console.log("found profile")
						Business.findOne({ owner: profile.id, claimed: true }).then((place) => {
							// console.log('testing body', req.body)
							if (place) {
								this.CreateItem(req, res, Collection, collection, req.body, noBusiness, profile.id, place)
									.then(created_products => {
										if (product_associations) {
											return this.CreateBusinessAssociations(req, res, collection, created_products, product_associations)
										}
										console.log(created_products, 'payload from create products');
										let attributes_section = [];
										created_products.data[0].attributes_section.map(item => {
											console.log(item, 'item')
										})

										Section.find({ _id: { $in: created_products.data[0].attributes_section } }).then(sections => {
											let updated_sections = [];
											sections.map(section => {
												let section_field = section.field[collection]
												created_products.data.map(created_product => {
													if (!section_field.includes(created_product._id)) {
														console.log("adding new collection")
														section.field[collection] = [...section_field, created_product._id]
														updated_sections.push(section)
													}
												})
												console.log(updated_sections[0].field.Product, 'section fields')

											})
											return sections
										}).then(sections => {
											// console.log(sections[0].field.Product, 'sections')
											// Section.insertMany(sections)
										})



										return new Promise(resolve => {
											resolve([])
										})
									}).then(association => {
										return Collection.find({ attributes_owner: place._id })
									}).then((new_data) => {
										let payload = {
											collection,
											data: new_data
										}
										// console.log(payload, profile_id)
										res.send(payload)
									})

							} else {
								// console.log("you must first create a profile and claim  your business")
								res.status(204).json({ place: 'You must first create AND claim your business' });
							}
						});
					} else {
						// console.log("you must first create a profile")
						res.status(204).json({ profile: 'You must first create a profile' });
					}
				});
			}
		});

	}

	Selected() {
		this.router.post('/selected/:collection/:selected_id', passport.authenticate('jwt', { session: false }), (req, res) => {
			let collection = req.params.collection;
			let Collection = Collections[collection];
			let selected_id = req.params.selected_id
			let query = { _id: selected_id, attributes_user: req.user.id }
			let updated_item = { attributes_default: true }
			// console.log(query)

			Collection.updateOne({ attributes_user: req.user.id, attributes_default: true }, { attributes_default: false }).then(verification => {
				Collection.findOneAndUpdate(query, updated_item).then(updated => {
					// console.log(updated)
					Collection.find({ attributes_user: req.user.id }).then((data) => {
						let payload = { collection: collection, data }
						let owner = data.filter(key => key.attributes_default == 'true')[0]
						if (data) {
							Business.findOne({ owner }).then((place) => {
								if (place) {
									payload.business = place;
									res.json(payload);
								} else {
									res.json(payload);
								}
							});
						} else {
							res.status(404).json({ profile: 'You must first create a profile' });
						}
					});
				})
			})
		})
	}
	getProductAction() {
		this.router.post('/get-products/:product_id', passport.authenticate('jwt', { session: false }), (req, res) => {
			let product_id = req.params.product_id;
			product_id = product_id !== 'undefined' ? product_id : '1'
			Product.findOne({ _id: product_id }).then(product => {
				// Section.find({ _id: { $in: product.attributes_section } }).then(sections => {
				// 	// console.log(sections, 'sections')
				// })
			})
		});

	}

	TheQuickChange() {
		this.router.post('/quickchange/:from/:collection/:action/:change/:selected_id/:profile_id', passport.authenticate('jwt', { session: false }), (req, res) => {
			let collection = req.params.collection;
			let Collection = Collections[collection];
			let selected_id = req.params.selected_id
			let profile_id = req.params.profile_id
			let action = req.params.action
			let change = req.params.change
			let from = req.params.from

			let no_profile = ["Profile"]

			let query = {
				user: { _id: selected_id, attributes_user: req.user.id }
			}
			let respond = {
				user: { attributes_user: req.user.id }
			}
			if (no_profile.includes(collection)) {
				query.user = { _id: selected_id, attributes_user: req.user.id }
				respond.user = { attributes_user: req.user.id }
			} else {
				query.user = { _id: selected_id, attributes_profile: profile_id }
				respond.user = { attributes_profile: profile_id }
			}

			let updated_item = {
				published: { attributes_published: change },
				public: { attributes_public: change },
				delete: { attributes_invisible: change },
			}




			// console.log(query, updated_item, respond, collection)
			// console.log(change)
			Collection.findOneAndUpdate(query[from], updated_item[action]).then(updated => {
				return Collection.find(respond[from])
			}).then((data) => {
				let payloads = { collection: collection, data }
				// console.log(payloads)
				res.status(200).json(payloads)
			})


		});

	}

	QuickChange() {
		this.router.post('/quick-change/:from/:collection/:id/:action}', passport.authenticate('jwt', { session: false }), (req, res) => {
			let collection = req.params.collection;
			let Collection = Collections[collection];
			let selected_id = req.params.selected_id
			let action = req.params.action
			let change = req.params.change
			let from = req.params.from
			// console.log("reached the quick change")

			let query = {
				user: { _id: selected_id, attributes_user: req.user.id }
			}

			let updated_item = {
				published: { attributes_published: change },
				public: { attributes_public: change },
				delete: { attributes_invisible: change },
			}

			let respond = {
				user: { attributes_user: req.user.id }
			}


			Collection.findOneAndUpdate(query[from], updated_item[action]).then(updated => {
				Collection.find(respond[from]).then((data) => {
					let payloads = { collection: collection, data }
					// console.log(payloads)
					res.status(200).json(payloads)
				})
			})

		});

	}



	ReadItems() {
		// get the item from the business while the business is logged in
		this.router.get('/read/items/:collection/:profile_id', passport.authenticate('jwt', { session: false }), (req, res) => {
			// console.log("reading items..")
			let noProfile = ['Profile']
			let noBusiness = ['Portfolio', 'Location', 'Document']
			let collection = req.params.collection;
			let Collection = Collections[collection];
			let profile_id = req.params.profile_id;
			if (noProfile.includes(collection)) {
				Collection.find({ attributes_user: req.user.id }).then(data => {
					let payloads = { collection: collection, data }
					if (data) {
						let get_profile_id = data.filter(key => key.attributes_default == 'true')[0]._id
						Business.findOne({ owner: get_profile_id }).then((place) => {
							payloads.place = place;
							res.status(200).json(payloads);
							// console.log(payloads, " from brain")
						})
					} else {
						res.status(200).json(payloads)

					}

				})
			} else if (noBusiness.includes(collection)) {
				Collection.find({ attributes_user: req.user.id }).then(data => {
					let payloads = { collection: collection, data }
					// console.log(payloads, req.user.id )
					res.status(200).json(payloads)
				})
			} else {
				Profile.findOne({
					attributes_user: req.user.id, attributes_default: true
				}).then((profile) => {
					return Business.findOne({ owner: profile._id })
				}).then(place => {
					return Collection.find({ attributes_owner: place._id })
				}).then(data => {
					let payloads = { collection: collection, data }
					// console.log(payloads, 'the payload')
					res.status(200).json(payloads)
				})
			}

		})
	}


	ReadItem() {
		// get the item from the business while the business is logged in
		this.router.get('/read/item/:collection/:profile_id/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
			let noProfile = ['Profile', 'Portfolio', 'Location', 'Document']
			let collection = req.params.collection;
			let Collection = Collections[collection];
			let profile_id = req.params.profile_id;

			let _id = req.params.id
			if (noProfile.includes(collection)) {
				Collection.findOne({ _id, attributes_user: req.user.id }).then(data => {
					let payloads = { collection: collection, data }
					// console.log(payloads)
					res.status(200).json(payloads)
				})
			}
		});
	}






	Read() {
		// get the item from the business while the business is logged in
		this.router.get('/read', passport.authenticate('jwt', { session: false }), (req, res) => {
			let Collection = req.params.collection;
			Profile.findOne({ attributes_user: req.user.id, _id: profile_id }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id, claimed: true }).then((place) => {
						if (place) {
							Collection.find({ owner: place._id })
								.sort({ name: -1 })
								.then((items) => res.json(items))
								.catch((err) => res.status(404).json({ noItemsFound: 'Nothing found' }));
						} else {
							res.status(404).json({ place: 'You must first create AND claim your business' });
						}

					});
				} else {
					res.status(404).json({ profile: 'You must first create a profile' });
				}
			});
		});
	}

	// ReadAll(Collections){
	// 	// get the item from the business while the business is logged in
	// 	this.router.get('/read-all', passport.authenticate('jwt', { session: false }), (req, res) => {
	// 		let Collection = req.params.collection; 			Profile.findOne({ attributes_user: req.user.id, _id: profile_id }).then((profile) => {
	// 			if (profile) {
	// 				Business.findOne({ owner: profile.id, status: this.place_status }).then((place) => {
	// 					if (place) {
	// 						let output = {}

	// 						(async () => {
	// 							await  Object.entries(Collections).map(collection => {
	// 								collection[1].find({ owner: place._id })
	// 								.sort({ name: -1 })
	// 								.then((items) => output[collection[0]] = items)
	// 								.catch((err) => res.status(404).json({ noItemsFound: 'Nothing found' }));
	// 							}).then(()=> {
	// 								res.json(items)
	// 							})
	// 						})

	// 						console.log(item)



	// 					} else {
	// 						res.status(404).json({ place: 'You must first create AND claim your business' });
	// 					}

	// 				});
	// 			} else {
	// 				res.status(404).json({ profile: 'You must first create a profile' });
	// 			}
	// 		});
	// 	});
	// }


	LoopAllCollections(entries, place_id) {
		return new Promise((resolve, reject) => {
			let output = {}
			let key = 0;
			// console.log("getting all collection now")
			if (key !== entries.length) {

				for (; key <= entries.length;) {
					Collections[entries[key]].find({ $or: [{ owner: place_id }, { public: true }, { attributes_public: true }, { attributes_owner: place_id }] })
						.sort({ name: 1, attributes_title: 1 })
						.then((items) => {

							output[key] = items
							key++
						})
						.catch((err) => output[key] = {});
				}
			} else {
				resolve(output)
			}

		})


	}
	FindBlacklistBusiness(associate_query, place) {
		return new Promise((resolve, reject) => {
			Business.find({ google_place_id: { $in: associate_query } }).then(businesses => {
				let output = []
				for (let key = 0; key <= businesses.length; key++) {
					if (key !== businesses.length) {
						let associate_blacklisted = businesses[key].setting ? businesses[key].setting[0].setting_blacklist.filter(bl => bl === place.google_place_id) : false;
						let merchant_blacklisted = place.setting ? place.setting[0].setting_blacklist.filter(bl => bl === businesses[key].google_place_id) : false;
						if (!associate_blacklisted && !merchant_blacklisted) {
							output.push(
								{
									_id: businesses[key]._id, attributes_title: businesses[key].name, claimed: businesses[key].claimed, category: businesses[key].category, status: businesses[key].status
								}
							)

						} else {

						}
					} else {

						resolve(output)
					}
				}

			})
		})
	}


	ReadCollections(entries, input, place_id) {
		return new Promise((resolve, reject) => {
			let output = input;
			for (let key = 0; key < entries.length; key++) {
				Collections[entries[key]].find({ $or: [{ owner: place_id }, { public: true }, { attributes_owner: place_id }, { attributes_public: true }] })
					.sort({ name: -1 })
					.then((items) => {
						output[entries[key]] = items
					})
					.catch((err) => output[entries[key]] = {});
			}
			setTimeout(() => {
				resolve(output)
			}, 2000)
		})
	}


	ReadAll(entries) {
		this.router.get('/all/', passport.authenticate('jwt', { session: false }), (req, res) => {
			let profile_id = '5d03df1f85a6e32278d514ae'

			Profile.findOne({ attributes_user: req.user.id, _id: profile_id }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id, claimed: true }).then((place) => {
						if (place) {

							let associate_query = place.association.place.map(value => value.google_place_id);
							this.FindBlacklistBusiness(associate_query, place).then((Business) => {
								return { Business };
							}).then(output => {
								return this.ReadCollections(entries, output, place._id)
							}).then(output => {
								// console.log(output.Product)
								res.json(output)
							})

						} else {
							res.status(404).json({ profile: 'You must first claimed your business.' });
						}
					})
				}
			})
		})
	}

	MiddlewareKeys(key) {
		let output = []
		let list = {
			daterange: ["daterange", "timerange"]
		}
		if (key && list[key]) {
			output = list[key]
		}
		return output;
	}



	MiddleWares(item) {
		const daterange = (attributes) => {
			// let full_day = mw_items.full_day
			// let today_name = mw_items.today_name

			let full_day = new Date(Moment().format())
			let today = new Date;

			let today_name = today.getDay()
			let output = {
				go: false,
				date_ranges: [],
				new_date: {

				}
			}
			attributes.forEach(attribute => {
				// current status will change output
				let current_status = true;
				let start_date = attribute.attributes_date_start;
				let end_date = attribute.attributes_date_end;
				let date_range_min = new Date(Moment(start_date).format(`YYYY-MM-DD`))
				let date_range_max = new Date(Moment(end_date).format(`YYYY-MM-DD`))
				current_status = date_range_min < full_day && full_day < date_range_max
				//  change current output only if it is false
				let dates = {
					date_range_min,
					date_range_max,
					time_range: {}
				}
				// if go is false and not already true and current status true. 
				// if go is true, we do not want to change it. 
				// if current status is false, we do not want to overide a true go
				if (!output.go && current_status) {
					output.go = current_status

				}
				output.date_ranges.push(dates)
				let current_min = output.new_date.min && Moment(output.new_date.min).format(`YYYY-MM-DD`)
				let current_max = output.new_date.max && Moment(output.new_date.max).format(`YYYY-MM-DD`)

				// if there is no new minimum date, then assigned it from the date range.
				if (!output.new_date.min && !output.new_date.max) {
					output.new_date.min = date_range_min
					output.new_date.max = date_range_max
				} else {
					/*
						we are going to try to get the dates that are the closes for today. 
					*/
					if (
						(
							(output.new_date.min < date_range_min)
							&&
							(output.new_date.min < today)
							&&
							(output.new_date.max < date_range_max)
							&&
							(output.new_date.max > today)
						)

					) {
						output.new_date.min = date_range_min
						output.new_date.max = date_range_max
					}
				}


				// console.log(output.new_date.min )
			})
		}
		let mw = {
			daterange
		}
		let output = mw[item] ? mw[item] : f => f
		return () => false
	}
	/*
		MISSION: it takes fields. 
		it will turn the section fields into an entry.
		i.e. ['product', ["fs0fs99g89900"]]
		it will pass it for processing 

	*/
	ModelProcessor(model, id_list, key_to_prevent_infinit_loop) {
		let output = true
		let GotCollection = this.LowerCaseCollections(model)
		let promise = GotCollection.find({ _id: { $in: id_list } }).then(found_collection => {
			if (found_collection) {
				//  let GotMiddleware = this.MiddleWares(model)
				// found_collection must be the first argument. If there is no middlware, it will output
				//   return GotMiddleware(found_collection, model)
				return found_collection

			} else {
				return null
			}

		})
		return promise


	}
	/*
		MISSION: it takes fields. 
		it will turn the section fields into an entry.
		i.e. ['product', ["fs0fs99g89900"]]
		it will pass it for processing 

	*/
	FieldsProcessor(fields = {}) {
		// fields contain the only set of models that need to be processes. 
		// be adviced: fields has lower case items. agerange: ['gsagksjf]
		let entries = Object.entries(fields)
		// console.log(entries)

		let promises = entries.map(entry => {
			// return entry
			return this.ModelProcessor(entry[0], entry[1])
		})

		// console.log(promises, "promises from 1010")

		return Promise.all(promises)
	}
	/*
		MISSION: section id argument. Then find the section by id. Map through the sections. 
		pass the section.field To the middlewares. 
		it will send an entire bunch of fields.

	*/
	SectionProcessor(section_id) {
		let promise = Section.findById(section_id).then(section => {
			return section
		})
		return promise;
	}
	CombinedSections(sections) {
		// console.log(sections)
		let output = {

		}
		sections.map(section => {

			let section_entry = Object.entries(section.field)
			section_entry.map(entry => {
				if (entry[1][0]) {
					if (output[entry[0]]) {
						entry[1].map(key => {
							let no_go = output[entry[0]].includes(key)
							if (!no_go) {
								output[entry[0]].push(key)
							}
						})
					} else {
						output[entry[0]] = entry[1]

					}
				}
			})


		})

		// console.log(output)
		// filed processor, will take the fields and run it so we can get the models.
		return output;
	}

	// TheReadItems(collection, user_id) {
	// 	// get the item from the business while the business is logged in
	// 	// console.log("reading items..")
	// 	let noProfile = ['Profile']
	// 	let noBusiness = ['Portfolio', 'Location', 'Document', 'Business']
	// 	let Collection = Collections[collection];
	// 	if (noProfile.includes(collection)) {
	// 		// console.log("found no profile", collection)
	// 		return Collection.find({ attributes_user: user_id }).then(data => {
	// 			let payloads = data
	// 			return new Promise((resolve, reject) => {
	// 				resolve(payloads)
	// 			});
	// 		})
	// 	} else if (noBusiness.includes(collection)) {
	// 		return Profile.findOne({
	// 			attributes_user: user_id, attributes_default: true
	// 		}).then(profile => {
	// 			let rename = {
	// 				Business: 'owner',
	// 				default: 'attributes_profile'
	// 			}
	// 			let attribute_query = rename[collection] ? rename[collection] : rename.default

	// 			return Collection.find({ [attribute_query]: profile._id })
	// 		}).then(data => {
	// 			let payloads = data
	// 			// console.log(payloads, 'the payload' ) 
	// 			return new Promise((resolve, reject) => {
	// 				resolve(payloads)
	// 			});
	// 		})

	// 	} else {
	// 		return Profile.findOne({
	// 			attributes_user: user_id, attributes_default: true
	// 		}).then((profile) => {
	// 			return Business.findOne({ owner: profile._id })
	// 		}).then(place => {
	// 			let rename = {
	// 				Section: 'owner',
	// 				default: 'attributes_owner'
	// 			}

	// 			let attribute_query = rename[collection] ? rename[collection] : rename.default
	// 			if (place) {
	// 				let found_collection = Collection.find({ [attribute_query]: place._id });
	// 				found_collection.find({ [attribute_query]: place._id })
	// 					.then(attributes => {
	// 						if(collection == "Product"){
	// 						try {
	// 							return (async () => {
	// 								let promises = attributes ? attributes.map(attribute => {
	// 									return attribute &&
	// 										attribute.attributes_section &&
	// 										attribute.attributes_section.map(section_uid => {
	// 											// console.log(section_uid)
	// 											if (section_uid) {
	// 												return this.SectionProcessor(section_uid[0])
	// 											} else {
	// 												return "remove"
	// 											}
	// 										})
	// 								}) : []
	// 								return Promise.all(promises)
	// 							})()

	// 						} catch (err) {
	// 							return []
	// 						}
	// 					} else {
	// 						console.log(attributes)
	// 						return attributes
	// 					}

	// 					}).then(output => {
	// 						// console.log(output)
	// 					})


	// 			} else {
	// 				return new Promise((resolve, reject) => {
	// 					resolve([])
	// 				});
	// 			}
	// 		}).then(data => {
	// 			let payloads = data
	// 			// console.log(payloads, 'the payload' ) 
	// 			return new Promise((resolve, reject) => {
	// 				resolve(payloads)
	// 			});
	// 		})
	// 	}

	// }

	ProductProcessor(attributes, collection) {
		// return attributes
		if (collection == "Product") {
			// console.log(collection)
			let promises = attributes.map(attribute => {
				let output = { ...attribute._doc }

				let section_map = attribute.attributes_section.map(section_id => {
					let product = this.SectionProcessor(section_id)
					return product
				})
				return Promise.all(section_map).then(sections => {
					return this.CombinedSections(sections)
				}).then(combinedSections => {
					return this.FieldsProcessor(combinedSections)
				}).then(processedFields => {


					output.section = processedFields

					// console.log(processedFields)


					return output;
				})
			})
			// console.log("promises", promises)
			let output = Promise.all(promises)

			return output
		} else if (collection == "Section") {
			return attributes

		} else {
			return attributes
		}
	}

	TheReadItems(collection, user_id) {
		// get the item from the business while the business is logged in
		// console.log("reading items..")
		let noProfile = ['Profile']
		let noBusiness = ['Portfolio', 'Location', 'Document', 'Business']
		let Collection = Collections[collection];
		if (noProfile.includes(collection)) {
			// console.log("found no profile", collection)
			return Collection.find({ attributes_user: user_id }).then(data => {
				let payloads = data
				return new Promise((resolve, reject) => {
					resolve(payloads)
				});
			})
		} else if (noBusiness.includes(collection)) {
			return Profile.findOne({
				attributes_user: user_id, attributes_default: true
			}).then(profile => {
				let rename = {
					Business: 'owner',
					default: 'attributes_profile'
				}
				let attribute_query = rename[collection] ? rename[collection] : rename.default

				return Collection.find({ [attribute_query]: profile._id })
			}).then(data => {
				let payloads = data
				// console.log(payloads, 'the payload' ) 
				return new Promise((resolve, reject) => {
					resolve(payloads)
				});
			})

		} else {
			return Profile.findOne({
				attributes_user: user_id, attributes_default: true
			}).then((profile) => {
				return Business.findOne({ owner: profile._id })
			}).then(place => {
				let rename = {
					Section: 'owner',
					default: 'attributes_owner'
				}

				let attribute_query = rename[collection] ? rename[collection] : rename.default
				if (place) {

					return Collection.find({ [attribute_query]: place._id })
				} else {
					return new Promise((resolve, reject) => {
						resolve([])
					});
				}
			}).then(attributes => {

				return this.ProductProcessor(attributes, collection)

			}).then(data => {
				let payloads = data
				//console.log(payloads, 'the payload' ) 
				return new Promise((resolve, reject) => {
					resolve(payloads)
				});
			})
		}

	}



	ReadItemsAuto() {
		let response = []
		let payload = {}
		// console.log("got to all item auto before call")

		this.router.get('/all/auto', passport.authenticate('jwt', { session: false }), (req, res) => {

			this.TheReadItems('Agent', req.user.id)
				.then(item => { // start things
					payload.Agent = item;
					return this.TheReadItems('AgeRange', req.user.id)
				})
				.then(item => {
					payload.AgeRange = item;
					return this.TheReadItems('Availability', req.user.id)
				})
				.then(item => {
					payload.Availability = item;
					return this.TheReadItems('Booking', req.user.id)
				})
				.then(item => {
					payload.Booking = item;
					return this.TheReadItems('Credential', req.user.id)
				})
				.then(item => {
					payload.Credential = item;
					return this.TheReadItems('DateRange', req.user.id)
				})
				.then(item => {
					payload.DateRange = item;
					return this.TheReadItems('Days', req.user.id)
				})
				.then(item => {
					payload.Days = item;
					return this.TheReadItems('Description', req.user.id)
				})
				.then(item => {
					payload.Description = item;
					return this.TheReadItems('Discount', req.user.id)
				})
				.then(item => {
					payload.Discount = item;
					return this.TheReadItems('FileManagement', req.user.id)
				})
				.then(item => {
					payload.FileManagement = item;
					return this.TheReadItems('Gallery', req.user.id)
				})
				.then(item => {
					payload.Gallery = item;
					return this.TheReadItems('Lifespan', req.user.id)
				})
				.then(item => {
					payload.Lifespan = item;
					return this.TheReadItems('Grouping', req.user.id)
				})
				.then(item => {
					payload.Grouping = item;
					return this.TheReadItems('Pricing', req.user.id)
				})
				.then(item => {
					payload.Pricing = item;
					return this.TheReadItems('Product', req.user.id)
				})
				.then(item => {
					payload.Product = item;
					return this.TheReadItems('ProductName', req.user.id)
				})
				.then(item => {
					payload.ProductName = item;
					return this.TheReadItems('QuantityRange', req.user.id)
				})
				.then(item => {
					payload.QuantityRange = item;
					return this.TheReadItems('Question', req.user.id)
				})
				.then(item => {
					payload.Question = item;
					return this.TheReadItems('SizeRange', req.user.id)
				})
				.then(item => {
					payload.SizeRange = item;
					return this.TheReadItems('Section', req.user.id)
				})
				.then(item => {
					payload.Section = item;
					return this.TheReadItems('TimeRange', req.user.id)
				})
				.then(item => {
					payload.TimeRange = item;
					return this.TheReadItems('Variation', req.user.id)
				})
				.then(item => {
					payload.Variation = item;
					return this.TheReadItems('Warranty', req.user.id)
				})
				.then(item => {
					payload.Warranty = item;
					return this.TheReadItems('Wholesale', req.user.id)
				})
				.then(item => { // start places
					payload.Wholesale = item;
					return this.TheReadItems('BusinessAward', req.user.id)
				})
				.then(item => {
					payload.BusinessAward = item;
					return this.TheReadItems('Business', req.user.id)
				})
				.then(item => {
					payload.Business = item;
					return this.TheReadItems('BusinessBenefit', req.user.id)
				})
				.then(item => {
					payload.BusinessBenefit = item;
					return this.TheReadItems('BusinessContent', req.user.id)
				})
				.then(item => {
					payload.BusinessContent = item;
					return this.TheReadItems('BusinessDiscount', req.user.id)
				})
				.then(item => {
					payload.BusinessDiscount = item;
					return this.TheReadItems('BusinessEmployeeBenefit', req.user.id)
				})
				.then(item => {
					payload.BusinessEmployeeBenefit = item;
					return this.TheReadItems('BusinessExpertise', req.user.id)
				})
				.then(item => {
					payload.BusinessExpertise = item;
					return this.TheReadItems('BusinessJob', req.user.id)
				})
				.then(item => {
					payload.BusinessJob = item;
					return this.TheReadItems('BusinessRequest', req.user.id)
				})
				.then(item => {
					payload.BusinessRequest = item;
					return this.TheReadItems('BusinessMeeting', req.user.id)
				})
				.then(item => {
					payload.BusinessMeeting = item;
					return this.TheReadItems('BusinessMessage', req.user.id)
				})
				.then(item => {
					payload.BusinessMessage = item;
					return this.TheReadItems('BusinessPackage', req.user.id)
				})
				.then(item => {
					payload.BusinessPackage = item;
					return this.TheReadItems('BusinessPricing', req.user.id)
				})
				.then(item => {
					payload.BusinessPricing = item;
					return this.TheReadItems('BusinessSponsorship', req.user.id)
				})
				.then(item => {
					payload.BusinessSponsorship = item;
					return this.TheReadItems('BusinessStaff', req.user.id)
				})
				.then(item => {
					payload.BusinessStaff = item;
					return this.TheReadItems('Profile', req.user.id)
				})
				.then(item => { // people starts here
					payload.Profile = item;
					return this.TheReadItems('Portfolio', req.user.id)
				})
				.then(item => {
					payload.Portfolio = item;
					return this.TheReadItems('Document', req.user.id)
				})
				.then(item => {
					payload.Document = item;
					return this.TheReadItems('Location', req.user.id)
				})
				.then(item => { // admin starts here
					payload.Location = item;
					return this.TheReadItems('Category', req.user.id)
				})
				.then(item => {
					payload.Category = item;
					// console.log(payload)
					res.status(200).send({ ...payload })
				}).catch(err => {
					// console.log("Error: ", err, ": Error")
				})

			// console.log("getting all with get all function: ")

		})
	}


	ReadAssociated() {
		// get the item from the business while the business is logged in
		this.router.get('/read', passport.authenticate('jwt', { session: false }), (req, res) => {
			let Collection = req.params.collection;
			Profile.findOne({ attributes_user: req.user.id, _id: profile_id }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id, status: this.place_status }).then((place) => {
						if (place) {
							Collection.find({ owner: place._id })
								.sort({ name: -1 })
								.then((items) => {

									res.json(items)
								})
								.catch((err) => res.status(404).json({ noItemsFound: 'Nothing found' }));
						} else {
							res.status(404).json({ place: 'You must first create AND claim your business' });
						}
					});
				} else {
					res.status(404).json({ profile: 'You must first create a profile' });
				}
			});
		});
	}
	Search() {
		// get the item from the business while the business is logged in
		this.router.get('/search/:data', passport.authenticate('jwt', { session: false }), (req, res) => {
			let Collection = req.params.collection;
			Profile.findOne({ attributes_user: req.user.id, _id: profile_id }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id, status: this.place_status }).then((place) => {
						if (place) {
							let data = req.params.data
							Collection.find({ owner: place._id, name: data })
								.sort({ name: -1 })
								.then((items) => res.json(items))
								.catch((err) => res.status(404).json({ noItemsFound: 'Nothing found' }));
						} else {
							res.status(404).json({ place: 'You must first create AND claim your business' });
						}
					});
				} else {
					res.status(404).json({ profile: 'You must first create a profile' });
				}
			});
		});
	}
	All() {
		// get the item from the business while the business is logged in
		this.router.get('/all', (req, res) => {
			if (this.all) {
				Collection.find().then((items) => {
					// res.json(items)
				}).catch((err) => {
					res.status(404).json({ noItemsFound: 'Nothing found' })
				})
			}
		});
	}
	AllAssociated() {
		// get the item from the business while the business is logged in
		this.router.get('/merchant/:id', (req, res) => {
			if (this.associated) {
				Collection.find({ [this.associated]: { $in: [req.params.id] } }).then((items) => {
					res.json(items)
				}).catch((err) => {
					res.status(404).json({ noItemsFound: 'Nothing found' })
				})
			}
		});
	}
	Get() {
		// get the item from the business while the business is logged in
		this.router.get('/get/:id', (req, res) => {
			if (this.all) {
				Collection.findOne({ id: { $in: [req.params.id] } }).then((items) => {
					res.json(items)
				}).catch((err) => {
					res.status(404).json({ noItemsFound: 'Nothing found' })
				})
			}
		});
	}
	// Associate(){
	// 	// get all
	// 	this.router.get('/associate', passport.authenticate('jwt', { session: false }), (req, res) => {
	// 		let Collection = req.params.collection; 			Profile.findOne({ attributes_user: req.user.id, _id: profile_id }).then((profile) => {
	// 			if (profile) {
	// 				Business.findOne({ owner: profile.id, status: this.place_status }).then((place) => {
	// 					if (place) {
	// 						console.log(place)
	// 					} else {
	// 						res.status(404).json({ place: 'You must first create AND claim your business' });
	// 					}
	// 				});
	// 			} else {
	// 				res.status(404).json({ profile: 'You must first create a profile' });
	// 			}
	// 		});
	// 	});
	// }
	Associate() {
		// get all
		this.router.get('/associate', passport.authenticate('jwt', { session: false }), (req, res) => {
			let Collection = req.params.collection;
			Profile.findOne({ attributes_user: req.user.id, _id: profile_id }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id }).then((place) => {
						if (place) {
							var associations = []

							var promises = place.association.place.map((associate => {
								// does the associate matach
								return Business.findOne({ google_place_id: associate.google_place_id }).then((foundAssociate => {
									// if(foundAssociate.association.filter(connect => connect.google_place_id === place.google_place_id && connect.connected === true)){
									let output = {
										claimed: foundAssociate.claimed,
										id: foundAssociate._id,
										longitude: foundAssociate.longitude,
										lattitude: foundAssociate.lattitude,
										businessName: foundAssociate.businessName,
										address: foundAssociate.address,
										phone: foundAssociate.phone,
										google_place_id: foundAssociate.google_place_id,
										icon: foundAssociate.image ? foundAssociate.image : foundAssociate.icon,
										name: foundAssociate.name,
									};
									associations.push(output)
									// }
								}))
							}))
							Promise.all(promises).then((result) => {
								res.status(200).json(associations)
							})


						} else {
							res.status(404).json({ place: 'You must first create AND claim your business' });
						}
					});
				} else {
					res.status(404).json({ profile: 'You must first create a profile' });
				}
			});
		});
	}
	Template() {
		this.router.get('/template', (req, res) => {
			Collection.find({ public: true, published: true })
				.then((items) => res.json(items))
				.catch((err) => res.status(404).json({ noItemsFound: 'Nothing found' }));
		});
	}
	Delete() {
		this.router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
			let Collection = req.params.collection;
			Profile.findOne({ attributes_user: req.user.id, type: 'main' }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile._id, status: 'claimed' }).then((place) => {
						if (place) {
							const errors = {};

							Collection.findById(req.params.id)

								.then((ageRange) => {
									// Check for post owner
									if (ageRange.owner.toString() !== place.id) {
										return res.status(401).json({ notauthorized: ' Not authorized' });
									}

									// Delete
									ageRange.remove().then(() => res.json({ success: true }));
								})
								.catch((err) => res.status(404).json({ ageRangenotfound: 'ageRange not  found' }));
						} else {
							res.status(404).json({ place: 'You do not have permision to delete this item' });
						}
					});
				} else {
					res.status(404).json({ profile: 'You must first create a profile' });
				}
			});
		});
	}

	// QuickChange(){
	// 	this.router.post('/quick-change/:field/:action/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	// 		let Collection = req.params.collection; 			
	// 		Profile.findOne({ attributes_user: req.user.id, type: 'main' }).then((profile) => {
	// 			if (profile) {
	// 				Business.findOne({ owner: profile._id, status: 'claimed' }).then((place) => {
	// 					if (place) {
	// 						const errors = {};

	// 						Collection.findById(req.params.id)
	// 							.then((ageRange) => {
	// 								// Check for post owner
	// 								if (ageRange.owner.toString() !== place.id && ageRange.owner.toString() !== place._id) {
	// 									return res.status(401).json({ notauthorized: ' Not authorized' });
	// 								}
	// 								// Delete
	// 								let quickUpdate = {};
	// 								let action = req.params.action;
	// 								let field = req.params.field;
	// 								quickUpdate[String(field)] = String(action);

	// 								Collection.findOneAndUpdate({ _id: req.params.id }, { $set: quickUpdate }, { new: true })
	// 									.then((ageRange) => res.json(ageRange))
	// 									.catch((err) => res.status(428).json({ ageRangenotfound: 'could not save ageRange' }));
	// 							})
	// 							.catch((err) => res.status(404).json({ ageRangenotfound: 'ageRange not  found' }));
	// 					} else {
	// 						res.status(404).json({ place: 'You do not have permision to delete this item' });
	// 					}
	// 				});
	// 			} else {
	// 				res.status(404).json({ profile: 'You must first create a profile' });
	// 			}
	// 		});
	// 	});
	// }
	Run() {
		this.getProductAction()
		this.Create()
		this.Read()
		this.ReadItems()
		this.ReadItem()
		this.Search()
		this.Get()
		this.All()
		this.AllAssociated()
		this.Template()
		this.Associate()
		this.Delete()
		this.QuickChange()
		this.TheQuickChange()
		this.Selected()
		this.ReadItemsAuto()
	}

}

module.exports.CRUD = CRUD;
