const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const { MAD, MadValues } = require('mad-form');
const { RouterPost } = require('router-post');
// const { MAD, MadValues } = require('../../../libraries/madform/index');

// Load People Models
const User = require('../../../../models/people/User');
const { Profile } = require('../../../../models/people/');

// Load Businesss Models
const Business = require('../../../../models/place/business/Business');
let routerPost = new RouterPost();

// Load Option Models
const ContributingOptions = require('../../../../models/admin/Options');

//create-many
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
	// console.log(req.body)
	let query = { 'attributes_user': req.user.id, attributes_default: 'true' }
	Profile.findOne(query).then((profile) => {
		// console.log(profile, req.user.id)

		if (profile) {
			const mad = new MAD(
				req.body, // data source
				'name', // the form name
				['_', '|', '.'], // spliters: key, value, and options (opitions uses on demarel)
				['association'], // melel field which will get by rows.
				['field'], //// demarel fields which will mix and match it.
				{
					attache: [],
					overide: {
						owner: profile._id,
						creator: profile._id
					},
					includeKeys: {
						demare: true,
						group: true,
						mare: true
					},
					group: 'group',
					groupCompletion: true
				}
			);
			const data = mad.run();
			// test if  association.place has contents: 2019 March 14
			// console.log('test association place', req.body.association.place);
			// test if  association.place[0].access_request has contents: 2019 March 14
			// console.log('test association place', req.body.association.place[0].access_request);
			// check if each association exists
			req.body.association.place.forEach((associate) => { });
			// testing data: 2019 March 14
			// this will return an array but we only want the first value of the array
			// console.log('testing data', data);

			let NewBusiness = data[0];
			NewBusiness.claimed = true;
			let connectionBusiness = {
				google_place_id: NewBusiness.google_place_id,
				sender: 'associate',
				host_status: "pending",
				associate_status: "accepted",
				name: NewBusiness.name,
				address: NewBusiness.address,

				icon: NewBusiness.icon,
				phone: NewBusiness.phone,
				category: NewBusiness.category,
				created_at: Date.now(),
			};
			// console.log('connectionBusiness business', connectionBusiness, 'new business', NewBusiness)

			NewBusiness.associations.map(addingAssociate => {
				let key = String(addingAssociate.googlePlaceId)
				// console.log('key', key)
				let payload = {
					google_place_id: key,
					name: addingAssociate.businessName,
					icon: addingAssociate.icon,
					phone: addingAssociate.phone,
					category: addingAssociate.category,
					address: addingAssociate.address,
					created_at: Date.now(),
					sender: 'host',
					host_status: "accepted",
					associate_status: "pending",

				}
				NewBusiness.association.requests[key] = payload
			})


			Business.findOne({ google_place_id: NewBusiness.google_place_id }).then((FoundBusiness) => {
				// console.log("is already created", FoundBusiness)
				if (FoundBusiness && FoundBusiness.claimed == false) {
					let google_place_id_container = [];

					NewBusiness.association.place.map((NewAssociate) => {
						google_place_id_container.push(NewAssociate.google_place_id);
					});
					var FilteredPlace = FoundBusiness.association.place.filter(function (e) {
						return this.indexOf(e.google_place_id) < 0;
					}, google_place_id_container);

					// concatenate the old business with the new business.
					let NewPlace = NewBusiness.association.place.concat(FilteredPlace);
					NewBusiness.association.place = NewPlace;
					NewBusiness.attributes = FoundBusiness.attributes;
					NewBusiness.analytics = FoundBusiness.analytics;
					NewBusiness.creator = FoundBusiness.creator;


					let FoundBusinessRequests = Object.entries(FoundBusiness.association.requests)

					FoundBusinessRequests.map(associateExist => {
						let key = String(associateExist[0])
						let value = associateExist[1]
						if (NewBusiness.association.requests[key]) {
							NewBusiness.association.requests[key].associate_status = "accepted"
						} else {
							NewBusiness.association.request[key] = associateExist
						}
					})


					// update the old business
					// console.log(NewBusiness.association.place);
					Business.findOneAndUpdate(
						{ google_place_id: NewBusiness.google_place_id },
						NewBusiness,
						{
							new: false
						},
						(err, result) => { }
					)
						.then(business => {
							return CreateAssociate(req.user.id, req.body.associations, { key: 'place', payload: connectionBusiness })
						}).then(item => {

							return Business.findOne({ owner: profile.id })
						}).then(place => {
							res.status(200).json(place)
							return place

						})
				} else if (FoundBusiness && FoundBusiness.claimed == true) {
					// tell the user the busienss already been claimed
					res.status(409).json({
						justification: 'This business has already been claimed by another party.',
						next: 'You may file a reclaim ticket by contacting us at reclaim@mallsett.com'
					});
				} else {
					// simply create the business if it is not already in the datase
					// console.log('NewBusiness.associations', NewBusiness.associations)



					Business.create(NewBusiness)
						.then((business) => {
							return new Promise((resolve) => {
								resolve(business)
							})
						}).then(business => {
							// console.log('done creating', business)
							return CreateAssociate(req.user.id, req.body.associations, { key: 'place', payload: connectionBusiness })
						}).then(item => {

							return Business.findOne({ owner: profile.id })
						}).then(place => {
							res.status(200).json(place)
							return place

						})

				}
			});
		} else {
			res.status(404).json({ profile: 'You must first create a profile' });
		}
	});
});


// create an array of associates.

const CreateAssociate = (user_id, body, addOns, res) => {
	return Profile.findOne({ attributes_user: user_id, attributes_default: "true" }).then((profile) => {
		if (profile) {


			let output = []
			body.map((associate, index) => {
				// console.log(associate, 'the associate')
				associate.name = associate.businessName
				associate.google_categories = associate.googlePlaceCategories
				associate.google_place_id = associate.google_place_id ? associate.google_place_id : associate.googlePlaceId
				associate.google_categories = associate.google_categories ? associate.google_categories : associate.googlePlaceCategories
				associate.creator = profile._id
				associate = {
					...associate,
					association: {
						message: [],
						package: [],
						pricing: [],
						place: [],
						requests: {

						}
					},

					analytics: {
						business_impression: [],
						customer_impression: [],
						business_accepted: [],
						customer_accepted: []
					},
					claimed: false,
					published: true,
					public: true,
					validated: false,
					lattitude: '26.11813369999999',
					longitude: '-80.14620789999998',
					hacked: [],
					created_at: new Date(),
				}
				if (addOns) {
					if (addOns.key == 'place') {
						let key = String(addOns.payload.google_place_id);
						// console.log(key)
						let add_on_payload = addOns.payload;
						add_on_payload.requestor_type = addOns.key
						associate.association.requests[key] = add_on_payload

					} 
				}
				// console.log("associate that is nulling me", body, "associate that is nulling me", )
				// SECURITY: make sure all connections are false
				if (associate.association && associate.association.place) {
					associate.association.place.map((hacker) => {
						if (hacker && hacker.connected == true) {
							// track who is hacking

							associate.hacked = [];
							associate.hacked.push({
								id: profile._id,
								accusation: 'Falsify Connections',
							});
							hacker.connected == false;
						}
					});
				}

				// Check for existence

				return Business.findOne({ google_place_id: associate.google_place_id }).then(associateExist => {
					if (!associateExist) {
						// console.log(associate, 'does not exist')
						Business.create(associate).then(item => {
							output = [...output, item]
							if (body.length == output.length) {
								return new Promise(resolve => {
									resolve(output)
								})
							}
						})
					} else {
						// associate exist: conduct checks. 
						//1. does the associate include the addons id which is the created business id

						if (addOns) {
							let matchedAddOns = associateExist.association.requests[addOns.payload.google_place_id];
							// console.log(matchedAddOns, 'matched add ons')
							// console.log(associate, 'does  exist')

							if (matchedAddOns) {
								// if there is akey, make associate status accepted. 
								associateExist.association.requests[matchedAddOns.google_place_id].associate_status = "accepted"
								associateExist.association.requests[matchedAddOns.google_place_id].requestor_type = addOns.key

								

							} else {
								/// if there is no key, add the associate statustus to the addons payload.
								let add_on_payload = addOns.payload;
						add_on_payload.requestor_type = addOns.key
								associateExist.association.requests[addOns.payload.google_place_id] = add_on_payload
							}

						}


						Business.findOneAndUpdate(
							{ google_place_id: associateExist.google_place_id },
							associateExist,
							{
								new: false
							},
							(err, result) => { }
						).then(item => {
							output = [...output, item]
							if (body.length == output.length) {
								return new Promise(resolve => {
									// console.log(output)
									resolve(output)
								})
							}
						})
					}
				})

			});
		} else {
			res.status(404).json({ profile: 'You must first create a profile' });
		}
	});
}

router.post('/associate', passport.authenticate('jwt', { session: false }), (req, res) => {
	// console.log(req.body)
	let body = []
	let new_requests = {};

	// assign the keys to a variable.
	let type = req.body.attributes_type;
	type = type ? type : ["others"]
	// console.log(req.body)
	let provider = req.body.attributes_provider;
	if (provider) {
		provider.map(addingAssociate => {
			let key = String(addingAssociate.googlePlaceId)
			// console.log('key', key)
			let payload = {
				google_place_id: key,
				name: addingAssociate.businessName,
				address: addingAssociate.address,

				icon: addingAssociate.icon,
				phone: addingAssociate.phone,
				category: addingAssociate.category,
				created_at: Date.now(),
				sender: 'host',
				host_status: "accepted",
				associate_status: "pending",

			}
			new_requests[key] = payload
		})
		provider.map((item, index) => {
			// fetch the category. 
			let type_index = type[index]
			// initilized output
			let output = {}
			// if there is a category
			// add all of item to output
			output = { ...item }
			if (type_index) {
				// add the category to the category key
				output.category = type_index
			} else {
				// since there is no category key, add the last category as key
				output.category = type[type.length - 1]
			}
			body = [...body, output]
		})
	} else {
		body = req.body
	}

	Profile.findOne({ attributes_user: req.user.id, attributes_default: true })
		.then(profile => {
			Business.findOne({ owner: profile.id }).then(preUpdatedBusiness => {
				
				if (preUpdatedBusiness) {
					console.log(preUpdatedBusiness, preUpdatedBusiness.owner, profile, "busines to update")
					let keys = Object.keys(new_requests)

					keys.map(key => {
						let request = preUpdatedBusiness.association.requests
						if (request && request[key]) {
							preUpdatedBusiness.association.requests[key].host_status = "accepted";
							delete new_requests[key]
						} else {
							if(!preUpdatedBusiness.association.requests){
								preUpdatedBusiness.association.requests = {}
							}
							preUpdatedBusiness.association.requests[key] = new_requests[key]
						}

					})

					preUpdatedBusiness

					return Business.findByIdAndUpdate(preUpdatedBusiness.id, preUpdatedBusiness, {
						new: false
					})
				} else {
					return Business.findOne({ owner: profile.id })
				}
			}).then(preUpdatedBusiness => {
				let connectionBusiness = {}
				if (preUpdatedBusiness) {

					connectionBusiness = {
						google_place_id: preUpdatedBusiness.google_place_id,
						sender: 'associate',
						host_status: "pending",
						associate_status: "accepted",
						name: preUpdatedBusiness.businessName,
						address: preUpdatedBusiness.address,

						icon: preUpdatedBusiness.icon,
						phone: preUpdatedBusiness.phone,
						category: preUpdatedBusiness.category,
						created_at: Date.now(),
					};
				}

				return new Promise(resolve => {
					resolve(connectionBusiness)
				})
			}).then(connectionBusiness => {
				if (connectionBusiness) {
					return CreateAssociate(req.user.id, body, { key: 'place', payload: connectionBusiness }, res)
				} else {
					return new Promise(resolve => {
						resolve(connectionBusiness)
					})
				}
			}).then(item => {
				return Business.findOne({ owner: profile.id })
			}).then(updatedBusiness => {
				console.log(updatedBusiness, "updatedBusiness")
				res.status(200).json(updatedBusiness.association.requests)

			})
		})

});

//create setting

router.post('/setting/association', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ attributes_user: req.user.id, attributes_default: "true" }).then((profile) => {
		if (profile) {
			Business.findOne({ owner: profile._id }).then((business) => {
				let product = business;
				// assign the association
				product.association.setting = req.body

				let black_listed = req.body.setting_blacklistProvider;
				let white_listed = req.body.setting_whitelistProvider;

				Business.findOneAndUpdate({ owner: profile._id }, product, {
					new: false
				}).then((NewBusiness) => {
					CreateAssociate(req.user.id, black_listed)
						.then(item => {
							return CreateAssociate(req.user.id, white_listed);
						})
						.then(item => {

						})
				});
			});
		} else {
			res.status(404).json({ profile: 'You must first create a profile' });
		}
	});
});

// read settings

router.get('/read-setting', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ attributes_user: req.user.id, attributes_default: "true" }).then((profile) => {
		if (profile) {
			Business.findOne({ owner: profile.id }).then((place) => {
				if (place) {
					let settings = place.association.setting[0] ? place.association.setting[0] : {}
					let output = {
						settings
					}
					Business.find({ google_place_id: { $in: settings.setting_blacklist } })
						.then(black_listed => {

							output.setting_blacklistProvider = black_listed
							// console.log(output, 'inside of then')
							return Business.find({ google_place_id: { $in: settings.setting_whitelist } })
						})
						.then(white_listed => {

							output.setting_whitelistProvider = white_listed
							return new Promise((resolve, reject) => {
								resolve(true)
							});
						}).then(complete => {
							// console.log(output, 'got all of the place association settings')
							res.json(output);
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


router.post('/change-status', passport.authenticate('jwt', { session: false }), (req, res) => {
	let associate_google_place_id = req.body.associate;
	let new_status =  req.body.status;

	Profile.findOne({ attributes_user: req.user.id, attributes_default: "true" }).then((profile) => {
		Business.findOne({ owner: profile.id }).then(host => {
			// console.log(host, "host")
			// console.log(req.body, "host")
			// find my the associate business
			 Business.findOne({ google_place_id: associate_google_place_id }).then((associate) => {
				 // add new status to host business
					associate.association.requests[host.google_place_id].associate_status = new_status;
					// console.log(associate, "associate before error")
					// console.log(new_status, "new status")
					// console.log(associate.association.requests[host.google_place_id], 'associate.association.requests[host.google_place_id]')

					 return Business.findOneAndUpdate({ google_place_id: associate_google_place_id },  { $set: associate } , { new: false })
					}).then(updatedAssociate => {
						// console.log(updatedAssociate.association.requests[host.google_place_id], 'updatedAssociate.association.requests[host.google_place_id]')
						return Business.findOne({ owner: profile._id })
					}).then(place => {
							place.association.requests[associate_google_place_id].host_status = new_status;
						// console.log(place, "placing the associnge last")

							return Business.findOneAndUpdate({ owner: profile._id },   { $set: place } , { new: false }).then(new_place => {
								// console.log(new_place, "placing the associnge last")
				
								res.status(200).json(place.association.requests)
						})
					})
				})
	})
})


router.get('/read-association', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ attributes_user: req.user.id, attributes_default: "true" }).then((profile) => {
		if (profile) {
			Business.findOne({ owner: profile.id }).then((place) => {
				if (place) {
					let payload = place.association.requests
					console.log(payload)
					res.json(payload);
				} else {
					res.status(404).json({ place: 'You must first create AND claim your business' });
				}
			});
		} else {
			res.status(404).json({ profile: 'You must first create a profile' });
		}
	});
});

router.get('/get', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ attributes_user: req.user.id, attributes_default: "true" }).then((profile) => {
		if (profile) {
			Business.findOne({ owner: profile.id }).then((place) => {
				if (place) {
					res.json(place);
				} else {
					res.status(404).json({ place: 'You must first create AND claim your business' });
				}
			});
		} else {
			res.status(404).json({ profile: 'You must first create a profile' });
		}
	});
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	// console.log("reaching the current business")
	Profile.findOne({ attributes_user: req.user.id, attributes_default: true }).then((profile) => {
		if (profile) {
			// console.log(profile, "profile")
			Business.findOne({ owner: profile.id }).then((place) => {
				if (place) {
					// console.log(place, "place")

					res.json(place);
				} else {
					// console.log("no place")
					res.status(404).json({ place: 'You must first create AND claim your business' });
				}
			});
		} else {
			res.status(404).json({ profile: 'You must first create a profile' });
		}
	});
});
router.get('/read', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ attributes_user: req.user.id, attributes_default: "true" }).then((profile) => {
		if (profile) {
			Business.findOne({ owner: profile.id }).then((place) => {
				if (place) {
					let associationID = [];

					place.association.place.forEach((business) => {
						if (business) {
							associationID.push(business.google_place_id);
						}
					});
					if (associationID.length > 0) {
						Business.find({ google_place_id: { $in: associationID } })
							.then((item) => {
								if (item) {
									let associationInformation = [];

									item.forEach((element) => {
										let output = [];
									});

									res.json(item);
								}
							})
							.catch((err) => { });
					}
				} else {
					res.status(404).json({ place: 'You must first create AND claim your business' });
				}
			});
		} else {
			res.status(404).json({ profile: 'You must first create a profile' });
		}
	});
});

router.get('/my-business', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ attributes_user: req.user.id, attributes_default: "true" }).then((profile) => {
		if (profile) {
			Business.findOne({ owner: profile._id })
				.then((item) => {
					res.json(item);
				})
				.catch((err) => { });
		} else {
			res.status(404).json({ profile: 'You must first create a profile' });
		}
	});
});

// router.get('/connection/:id/:categories', (req, res) => {
router.get('/connection/:id/:google_categories', (req, res) => {
	// category=category,category,category2

	// let google_categories = req.params.google_categories.split(',');
	// let google_place_id = req.params.id;
	let google_categories = [
		'Hardware Store',
		'Store',
		'Bank',
		'Finance',
		'Locality',
		'Health',
		'Point Of Interest',
		'restaurant',
		'Political',
		'Establishment'
	];

	let google_place_id = ' ChIJVRy2cA-u2YgRyEJI48u7LrA';

	Business.find({ google_categories: { $in: google_categories } })
		.then((list) => {
			// initilized output

			let count = list.length;

			while (count > 0) {
				let rand = Math.floor(Math.random() * count);
				let business = list[rand];
				business.targets.forEach((target) => {
					if (!output[target].length > 3) {
						output[target].push(business);
					}
				});
				count--;
			}
		})
		.then();

	Business.findOne({ google_place_id: google_place_id })
		.then((business) => {
			if (business) {
				let associations = [];

				business.association.forEach((element) => {
					associations.push(element.google_place_id);
				});
				Business.find(
					{
						google_place_id: { $in: associations }
					},
					function (err, docs) {
						// console.log(docs);
					}
				).then((connection) => {
					output.connections = connection;
				});
			}
		})
		.catch((err) => res.status(404).json((output.connections = connection)));
});

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ attributes_user: req.user.id, attributes_default: "true" }).then((profile) => {
		if (profile) {
			Business.findOne({ owner: profile._id, status: 'claimed', id: req.params.id }).then((place) => {
				if (business) {

					if (business.owner.toString() !== business.id) {
						return res.status(401).json({ notauthorized: ' Not authorized' });
					}

					// Delete
					business.remove().then(() => res.json({ success: true }));

				} else {
					res.status(404).json({ business: 'You do not have permision to delete this item' });
				}
			});
		} else {
			res.status(404).json({ profile: 'You must first create a profile' });
		}
	});
});

router.post('/quick-change/:field/:action/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id, attributes_default: "true" }).then((profile) => {
		if (profile) {



			// Delete
			let quickUpdate = {};
			let action = req.params.action;
			let field = req.params.field;
			quickUpdate[String(field)] = String(action);

			Business.findOneAndUpdate({ owner: profile._id, status: 'claimed', id: req.params.id }, { $set: quickUpdate }, { new: true })
				.then((business) => res.json(business))
				.catch((err) => res.status(428).json({ businessnotfound: 'could not save business' }));



		} else {
			res.status(404).json({ profile: 'You must first create a profile' });
		}
	});
});
module.exports = router;
