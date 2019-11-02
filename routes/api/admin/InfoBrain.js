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
const Category = require('../../../models/admin/product/Category');

class CRUD {
	constructor(item){
		this.profile_type = item.profile_type ? item.profile_type : "main"
		this.place_status = item.place_status ? item.place_status : "claimed"
		this.Collection = item.Collection ? item.Collection : Sample
		this.router = item.router ? item.router : router
	}
	
	Associate(){
		// get all
		this.router.get('/associate', passport.authenticate('jwt', { session: false }), (req, res) => {

			Profile.findOne({ user: req.user.id, type: this.profile_type }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id }).then((place) => {
						if (place) {
							var associations = []
					
						var promises =	place.association.place.map(( associate => {
								// does the assocaite matach
								return Business.findOne({ google_place_id: associate.google_place_id}).then((foundAssociate => {
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
												category: associate.category ? associate.category : foundAssociate.category
										};
										associations.push(output)
										console.log(output)
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
	Message(){
		// get all
		this.router.get('/message', passport.authenticate('jwt', { session: false }), (req, res) => {
			Profile.findOne({ user: req.user.id, type: this.profile_type }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id }).then((place) => {
						if (place) {
							var associations = []
					
						var promises =	place.association.place.map(( associate => {
								// does the assocaite matach
								return Business.findOne({ google_place_id: associate.google_place_id}).then((foundAssociate => {
									// if(foundAssociate.association.filter(connect => connect.google_place_id === place.google_place_id && connect.connected === true)){
										
										let output = {
											icon: foundAssociate.image ? foundAssociate.image : foundAssociate.icon,
											name: foundAssociate.name,
											description: foundAssociate.name,
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
	Category(){
		// get all
		this.router.get('/category', passport.authenticate('jwt', { session: false }), (req, res) => {
			Category.find().then((category) => {
				let output = category ? category : []
				res.status(200).json(output)
			})
		});
	}
	ProductDetail(){
		// get all
		this.router.get('/product-detail', passport.authenticate('jwt', { session: false }), (req, res) => {
			Product.find().then((product) => {
				let output = [];
				

				res.status(200).json(output)
			})
		});
	}
	Content(){
		// get all
		this.router.get('/content', passport.authenticate('jwt', { session: false }), (req, res) => {
			Profile.findOne({ user: req.user.id, type: this.profile_type }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id }).then((place) => {
						if (place) {
							var associations = []
					
						var promises =	place.association.place.map(( associate => {
								// does the assocaite matach
								return Business.findOne({ google_place_id: associate.google_place_id}).then((foundAssociate => {
									// if(foundAssociate.association.filter(connect => connect.google_place_id === place.google_place_id && connect.connected === true)){
										let output = {
											icon: foundAssociate.image ? foundAssociate.image : foundAssociate.icon,
											name: foundAssociate.name,
											description: foundAssociate.name,
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
	Staff(){
		// get all
		this.router.get('/staff', passport.authenticate('jwt', { session: false }), (req, res) => {
			Profile.findOne({ user: req.user.id, type: this.profile_type }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id }).then((place) => {
						if (place) {
							var associations = []
					
						var promises =	place.association.place.map(( associate => {
								// does the assocaite matach
								return Business.findOne({ google_place_id: associate.google_place_id}).then((foundAssociate => {
									// if(foundAssociate.association.filter(connect => connect.google_place_id === place.google_place_id && connect.connected === true)){
										let output = {
											icon: foundAssociate.image ? foundAssociate.image : foundAssociate.icon,
											name: foundAssociate.name,
											description: foundAssociate.name,
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
	Endorcement(){
		// get all
		this.router.get('/endorcement', passport.authenticate('jwt', { session: false }), (req, res) => {
			Profile.findOne({ user: req.user.id, type: this.profile_type }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id }).then((place) => {
						if (place) {
							var associations = []
					
						var promises =	place.association.place.map(( associate => {
								// does the assocaite matach
								return Business.findOne({ google_place_id: associate.google_place_id}).then((foundAssociate => {
									// if(foundAssociate.association.filter(connect => connect.google_place_id === place.google_place_id && connect.connected === true)){
										let output = {
											icon: foundAssociate.image ? foundAssociate.image : foundAssociate.icon,
											name: foundAssociate.name,
											description: foundAssociate.name,
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
	Award(){
		// get all
		this.router.get('/award', passport.authenticate('jwt', { session: false }), (req, res) => {
			Profile.findOne({ user: req.user.id, type: this.profile_type }).then((profile) => {
				if (profile) {
					Business.findOne({ owner: profile.id }).then((place) => {
						if (place) {
							var associations = []
					
						var promises =	place.association.place.map(( associate => {
								// does the assocaite matach
								return Business.findOne({ google_place_id: associate.google_place_id}).then((foundAssociate => {
									// if(foundAssociate.association.filter(connect => connect.google_place_id === place.google_place_id && connect.connected === true)){
										let output = {
											icon: foundAssociate.image ? foundAssociate.image : foundAssociate.icon,
											name: foundAssociate.name,
											description: foundAssociate.name,
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
	
	Run(){
		this.Content()
		this.Category()
		this.Associate()
		this.Message()
		this.Endorcement()
		this.Staff()
	}

}

module.exports.CRUD = CRUD;


