const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const { RouterPost } = require('../../../libraries/router-post/index');

// Load People Models
const User = require('../../../models/people/User');

// Load Associate Models
const Associate = require('../../../models/place/Associate');
let routerPost = new RouterPost();

//  @Route GET api/associate/test
//  @desc Tests associate route
//  @access Public

router.get('/test', (req, res) => {
	res.json({ msg: 'Associate Works' });
});

//  @Route GET api/associate/address-list
//  @desc get current users addresses
//  @access Private
router.get('/address-list', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	Associate.findOne({ owner: { $all: [ req.user.id ] } })
		.then((associate) => {
			if (!associate) {
				errors.noassociate = 'This user has yet to add an address';
				return res.status(404).json(errors);
			}
			res.json(associate);
		})
		.catch((kk) => {
			return kk.status(404).json(kk);
		});
});

//  @Route POST api/associate/create-associate
//  @desc get current users address
//  @access Private

router.post('/create-associate', passport.authenticate('jwt', { session: false }), (req, res) => {
	// _ indicate a subdomain. Camelcase multiple words.
	let payload = [
		'creator',
		'owner',
		'id',
		'place_id',
		'icon',
		'name',
		'formated_address',
		'formated_phone_number',
		'location',
		'label',
		'types',
		'address-apartment',
		'address-category',
		'address-creator',
		'notes-detail',
		'notes-creator',
		'details-phone_number',
		'details-email',
		'details-category',
		'details-terms',
		'details-logo'
	];
	let myArray = { myArrays: [ 'address', 'notes' ], level: 0 };
	let data = routerPost.objectify(req.body, payload, '-', myArray);
	data.updated_at = Date.now();
	routerPost.findPostOne(Associate, [ data, req, res ], { id: data.id }, [
		{
			condition: data.address[0].creator !== undefined,
			push: [
				{
					field: 'address',
					value: data.address[0]
				}
			],
			addons: [
				{
					field: 'updated_at',
					value: Date.now()
				}
			]
		},
		{
			condition: data.notes[0].creator !== undefined,
			push: [
				{
					field: 'notes',
					value: data.notes[0]
				}
			],
			addons: [
				{
					field: 'updated_at',
					value: Date.now()
				}
			]
		},
		{
			condition: data.details[0].creator !== undefined,
			push: [
				{
					field: 'details',
					value: data.details[0]
				}
			],
			addons: [
				{
					field: 'updated_at',
					value: Date.now()
				}
			]
		}
	]);
});

//  @Route DELETE api/address-delete/:id
//  @desc DELETE the address
//  @access address
router.delete('/address-delete/:the_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Associate.findOne({ id: req.body.id })
		.then((associate) => {
			const errors = {};
			const removeIndex = associate.address.map((item) => item.id).indexOf(req.params.the_id);
			// splice out array
			if (removeIndex > -1) {
				associate.address.splice(removeIndex, 1);
			} else {
				errors.noaddress = 'This address does not exist!';
			}
			// Save
			if (Object.keys(errors).length > 0) {
				res.json(errors);
			} else {
				associate.save().then((item) => res.json(item));
			}
		})
		.catch((kk) => {
			return kk.status(404).json(kk);
		});
});

//  @Route DELETE api/notes-delete/:id
//  @desc DELETE the notes
//  @access NOTES
router.delete('/notes-delete/:the_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Associate.findOne({ id: req.body.id })
		.then((associate) => {
			const errors = {};

			const removeIndex = associate.notes.map((item) => item.id).indexOf(req.params.the_id);

			// splice out array
			if (removeIndex > -1) {
				associate.notes.splice(removeIndex, 1);
			} else {
				errors.nonotes = 'This note does not exist!';
			}
			// Save
			if (Object.keys(errors).length > 0) {
				res.json(errors);
			} else {
				associate.save().then((item) => res.json(item));
			}
		})
		.catch((kk) => {
			return kk.status(404).json(errors);
		});
});

module.exports = router;
