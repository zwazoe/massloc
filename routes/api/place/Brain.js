const express = require('express');
const router = express.Router();
const passport = require('passport');
const { MAD, MadValues } = require('mad-form');
// const { MAD, MadValues } = require('../../../libraries/madform/index');

// Load People Models
const Profile = require('../../../models/people/Profile');

// Load Business Models
const Business = require('../../../models/place/business/Business');

// Load Option Models
const ContributingOptions = require('../../../models/admin/Options');

// Load Product Models
const Sample = require('../../../models/things/product/Sample');

class CRUD {
	constructor(item){
		this.profile_type = item.profile_type ? item.profile_type : "main"
		this.place_status = item.place_status ? item.place_status : "claimed"
		this.Collection = item.Collection ? item.Collection : Sample
		this.router = item.router ? item.router : router
	}

	Create() {
		this.router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
			console.log(req.body)
			

			Profile.findOne({ user: req.user.id, type: this.profile_type }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id, status: this.place_status }).then((place) => {
						if (place) {
							const mad = new MAD(
								req.body, // data source
								'name', // the form name
								[ '_', '|', '.' ], // spliters: key, value, and options (opitions uses on demarel)
								[ 'attributes' ], // melel field which will get by rows.
								[ 'field' ], //// demarel fields which will mix and match it.
								{
									attache: [],
									overide: {
										owner: place._id,
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
							console.log(data);

							// get values
							const madValues = new MadValues(mad.run(), [ 'attributes' ], [], {
								skip: [
									'field',
									'published',
									'public',
									'validated',
									'owner',
									'creator',
									'created_at',
									'__v',
									'_id'
								],
								keyed: {
									key: true,
									valueAsKey: false,
									categoryAsKey: true,
									categoryKey: 'name',
									valueKey: 'values',
									forceArray: true,
									prefix: '',
									suffix: '',
									addOnKeys: {
										include: true,
										prefix: '',
										categoryKey: 'types',
										spaceReplacer: ' ',
										addOns: {
											place_types: place.types,
											place_locations: place.location,
											contributors: [ place._id ]
										}
									}
								}
							});

							const optionValues = madValues.run();
							console.log(data)

							this.Collection.insertMany(data)
								.then((thing) => {
									
								})
								.catch((err) => 
								{
									res.status(404).json({ postnotfound: 'We cannot post this', error: err })
									console.log('there was an error on creating', err)
							
							});
							ContributingOptions.insertMany(optionValues)
										.then((contribution) => {
										
										})
										.catch((err) =>
											res
												.status(404)
												.json({ postnotfound: 'Cannot contribute these contents', error: err })
										);
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
	Read(){
		// get all
		this.router.get('/read', passport.authenticate('jwt', { session: false }), (req, res) => {
			Profile.findOne({ user: req.user.id, type: this.profile_type }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id, status: this.place_status }).then((place) => {
						if (place) {
							this.Collection.find({ owner: place._id })
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
	Associate(){
		// get all
		this.router.get('/associate', passport.authenticate('jwt', { session: false }), (req, res) => {
			Profile.findOne({ user: req.user.id, type: this.profile_type }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id, status: this.place_status }).then((place) => {
						if (place) {
							// console.log(place)
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
	Template(){
		this.router.get('/template', (req, res) => {
			this.Collection.find({ public: true, published: true })
				.then((items) => res.json(items))
				.catch((err) => res.status(404).json({ noItemsFound: 'Nothing found' }));
		});
	}
	Delete(){
		this.router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
			Profile.findOne({ user: req.user.id, type: 'main' }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile._id, status: 'claimed' }).then((place) => {
						if (place) {
							const errors = {};
		
							this.Collection.findById(req.params.id)
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

	QuickChange(){
		this.router.post('/quick-change/:field/:action/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
			Profile.findOne({ user: req.user.id, type: 'main' }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile._id, status: 'claimed' }).then((place) => {
						if (place) {
							const errors = {};
		
							this.Collection.findById(req.params.id)
								.then((ageRange) => {
									// Check for post owner
									if (ageRange.owner.toString() !== place.id && ageRange.owner.toString() !== place._id) {
										return res.status(401).json({ notauthorized: ' Not authorized' });
									}
									// Delete
									let quickUpdate = {};
									let action = req.params.action;
									let field = req.params.field;
									quickUpdate[String(field)] = String(action);
		
									this.Collection.findOneAndUpdate({ _id: req.params.id }, { $set: quickUpdate }, { new: true })
										.then((ageRange) => res.json(ageRange))
										.catch((err) => res.status(428).json({ ageRangenotfound: 'could not save ageRange' }));
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
	Run(){
		this.Create()
		this.Read()
		this.Template()
		this.Delete()
		this.QuickChange()
	}

}

module.exports.CRUD = CRUD;


