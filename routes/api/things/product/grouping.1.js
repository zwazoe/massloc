const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const { MAD, MadValues } = require('mad-form');
// const { MAD, MadValues } = require('../../../libraries/madform/index');

// Load People Models
const User = require('../../../../models/people/User');
const Profile = require('../../../../models/people/Profile');
// Load Place Models
const Place = require('../../../../models/place/Place');

// Load Groupings Models
const Grouping = require('../../../../models/things/product/Grouping');
const Access = require('../../../../models/things/product/Access');
const AgeRange = require('../../../../models/things/product/AgeRange');
const Associate = require('../../../../models/things/product/Associate');
const Availability = require('../../../../models/things/product/Availability');
const Booking = require('../../../../models/things/product/Booking');
const Credentials = require('../../../../models/things/product/Credential');
const DateRange = require('../../../../models/things/product/DateRange');
const Delivery = require('../../../../models/things/product/Delivery');
const Discount = require('../../../../models/things/product/Discount');
const FileManagement = require('../../../../models/things/product/FileManagement');
const Gallery = require('../../../../models/things/product/Gallery');
const Lifespan = require('../../../../models/things/product/Lifespan');
const Pricing = require('../../../../models/things/product/Pricing');
const ProductName = require('../../../../models/things/product/ProductName');
const QuantityRange = require('../../../../models/things/product/QuantityRange');
const Question = require('../../../../models/things/product/SizeRange');
const SizeRange = require('../../../../models/things/product/SizeRange');
const Staff = require('../../../../models/things/product/Staff');
const Strategy = require('../../../../models/things/product/Strategy');
const TimeRange = require('../../../../models/things/product/TimeRange');
const Variation = require('../../../../models/things/product/Variation');
const Warranty = require('../../../../models/things/product/Warranty');
const Wholesale = require('../../../../models/things/product/Wholesale');

// Load Option Models
const ContributingOptions = require('../../../../models/admin/Options');

//create-many
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id, type: 'main' }).then((profile) => {
		if (profile) {
			Place.findOne({ owner: profile.id, status: 'claimed' }).then((place) => {
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

					Grouping.insertMany(data)
						.then((thing) => {
							ContributingOptions.insertMany(optionValues)
								.then((contribution) => {
									res.json({ contribution });
								})
								.catch((err) =>
									res
										.status(404)
										.json({ postnotfound: 'Cannot contribute these contents', error: err })
								);
						})
						.catch((err) => res.status(404).json({ postnotfound: 'We cannot post this', error: err }));
				} else {
					res.status(404).json({ place: 'You must first create AND claim your business' });
				}
			});
		} else {
			res.status(404).json({ profile: 'You must first create a profile' });
		}
	});
});

// get all
router.get('/read', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id, type: 'main' }).then((profile) => {
		if (profile) {
			Place.findOne({ owner: profile.id, status: 'claimed' }).then((place) => {
				if (place) {
					Grouping.find({ owner: place._id })
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

// get all
router.get('/collections', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Profile.findOne({ user: req.user.id, type: 'main' }).then((profile) => {
	// 	if (profile) {
	// 		Place.findOne({ owner: profile.id, status: 'claimed' }).then((place) => {
	// 			if (place) {
	// 				let collections = {
	// 					grouping: [],
	// 					testing: [ { something } ]
	// 				};
	// 				Grouping.find({ owner: place._id })
	// 					.sort({ name: -1 })
	// 					.then((items) => {
	// 						if (items) {
	// 							collections.grouping = items;
	// 						}
	// 					})
	// 					.catch((err) => {
	// 						collections.grouping = [];
	// 					});

	// 				res.json(collections);
	// 			} else {
	// 				res.status(404).json({ place: 'You must first create AND claim your business' });
	// 			}
	// 		});
	// 	} else {
	// 		res.status(404).json({ profile: 'You must first create a profile' });
	// 	}
	// });
	Profile.findOne({ user: req.user.id, type: 'main' }).then((profile) => {
		if (profile) {
			Place.findOne({ owner: profile.id, status: 'claimed' }).then((place) => {
				let collections = {};
				if (place) {
					// collection start
					Grouping.find({ owner: place._id })
						.sort({ name: -1 })
						.then((items) => {
							if (items) {
								collections.grouping = items;
							}
							Access.find({ owner: place._id })
								.sort({ name: -1 })
								.then((items) => {
									if (items) {
										collections.access = items;
									} else {
									}
									// res.json(collections);
									// collection start

									AgeRange.find({ owner: place._id })
										.sort({ name: -1 })
										.then((items) => {
											if (items) {
												collections.agerange = items;
											} else {
											}
											// res.json(collections);
										})
										.catch((err) => res.status(404).json({ noItemsFound: 'Nothing found' }));
									// collection end

									// collection start

									Associate.find({ owner: place._id })
										.sort({ name: -1 })
										.then((items) => {
											if (items) {
												collections.associate = items;
											} else {
											}
											// res.json(collections);// collection start

											Availability.find({ owner: place._id })
												.sort({ name: -1 })
												.then((items) => {
													if (items) {
														collections.availability = items;
													} else {
													}
													// res.json(collections);

													// collection start

													Booking.find({ owner: place._id })
														.sort({ name: -1 })
														.then((items) => {
															if (items) {
																collections.booking = items;
															} else {
															}
															// res.json(collections);
															// collection start

															Credentials.find({ owner: place._id })
																.sort({ name: -1 })
																.then((items) => {
																	if (items) {
																		collections.credentials = items;
																	} else {
																	}
																	// res.json(collections);

																	// collection start

																	DateRange.find({ owner: place._id })
																		.sort({ name: -1 })
																		.then((items) => {
																			if (items) {
																				collections.daterange = items;
																			} else {
																			}
																			// res.json(collections);
																			// collection start

																			Delivery.find({ owner: place._id })
																				.sort({ name: -1 })
																				.then((items) => {
																					if (items) {
																						collections.delivery = items;
																					} else {
																					}
																					// res.json(collections);
																					// collection start

																					Discount.find({ owner: place._id })
																						.sort({ name: -1 })
																						.then((items) => {
																							if (items) {
																								collections.discount = items;
																							} else {
																							}
																							// res.json(collections);
																							// collection start

																							FileManagement.find({
																								owner: place._id
																							})
																								.sort({ name: -1 })
																								.then((items) => {
																									if (items) {
																										collections.filemanagement = items;
																									} else {
																									}
																									// res.json(collections);
																									// collection start

																									Gallery.find({
																										owner: place._id
																									})
																										.sort({
																											name: -1
																										})
																										.then(
																											(items) => {
																												if (
																													items
																												) {
																													collections.gallery = items;
																												} else {
																												}
																												// res.json(collections);

																												// collection start

																												Lifespan.find(
																													{
																														owner:
																															place._id
																													}
																												)
																													.sort(
																														{
																															name: -1
																														}
																													)
																													.then(
																														(
																															items
																														) => {
																															if (
																																items
																															) {
																																collections.lifespan = items;
																															} else {
																															}
																															// res.json(collections);
																															// collection start

																															Pricing.find(
																																{
																																	owner:
																																		place._id
																																}
																															)
																																.sort(
																																	{
																																		name: -1
																																	}
																																)
																																.then(
																																	(
																																		items
																																	) => {
																																		if (
																																			items
																																		) {
																																			collections.pricing = items;
																																		} else {
																																		}
																																		// res.json(collections);
																																		// collection start

																																		ProductName.find(
																																			{
																																				owner:
																																					place._id
																																			}
																																		)
																																			.sort(
																																				{
																																					name: -1
																																				}
																																			)
																																			.then(
																																				(
																																					items
																																				) => {
																																					if (
																																						items
																																					) {
																																						collections.productname = items;
																																					} else {
																																					}
																																					// res.json(collections);

																																					// collection start

																																					QuantityRange.find(
																																						{
																																							owner:
																																								place._id
																																						}
																																					)
																																						.sort(
																																							{
																																								name: -1
																																							}
																																						)
																																						.then(
																																							(
																																								items
																																							) => {
																																								if (
																																									items
																																								) {
																																									collections.quantityrange = items;
																																								} else {
																																								}
																																								// res.json(collections);
																																								// collection start

																																								Question.find(
																																									{
																																										owner:
																																											place._id
																																									}
																																								)
																																									.sort(
																																										{
																																											name: -1
																																										}
																																									)
																																									.then(
																																										(
																																											items
																																										) => {
																																											if (
																																												items
																																											) {
																																												collections.question = items;
																																											} else {
																																											}
																																											// res.json(collections);
																																											// collection start

																																											SizeRange.find(
																																												{
																																													owner:
																																														place._id
																																												}
																																											)
																																												.sort(
																																													{
																																														name: -1
																																													}
																																												)
																																												.then(
																																													(
																																														items
																																													) => {
																																														if (
																																															items
																																														) {
																																															collections.sizerange = items;
																																														} else {
																																														}
																																														// res.json(collections);
																																														// collection start

																																														Staff.find(
																																															{
																																																owner:
																																																	place._id
																																															}
																																														)
																																															.sort(
																																																{
																																																	name: -1
																																																}
																																															)
																																															.then(
																																																(
																																																	items
																																																) => {
																																																	if (
																																																		items
																																																	) {
																																																		collections.staff = items;
																																																	} else {
																																																	}
																																																	// res.json(collections);
																																																	// collection start

																																																	Strategy.find(
																																																		{
																																																			owner:
																																																				place._id
																																																		}
																																																	)
																																																		.sort(
																																																			{
																																																				name: -1
																																																			}
																																																		)
																																																		.then(
																																																			(
																																																				items
																																																			) => {
																																																				if (
																																																					items
																																																				) {
																																																					collections.strategy = items;
																																																				} else {
																																																				}
																																																				TimeRange.find(
																																																					{
																																																						owner:
																																																							place._id
																																																					}
																																																				)
																																																					.sort(
																																																						{
																																																							name: -1
																																																						}
																																																					)
																																																					.then(
																																																						(
																																																							items
																																																						) => {
																																																							if (
																																																								items
																																																							) {
																																																								collections.timerange = items;
																																																							} else {
																																																							}
																																																							Variation.find(
																																																								{
																																																									owner:
																																																										place._id
																																																								}
																																																							)
																																																								.sort(
																																																									{
																																																										name: -1
																																																									}
																																																								)
																																																								.then(
																																																									(
																																																										items
																																																									) => {
																																																										if (
																																																											items
																																																										) {
																																																											collections.variation = items;
																																																										} else {
																																																										}
																																																										Warranty.find(
																																																											{
																																																												owner:
																																																													place._id
																																																											}
																																																										)
																																																											.sort(
																																																												{
																																																													name: -1
																																																												}
																																																											)
																																																											.then(
																																																												(
																																																													items
																																																												) => {
																																																													if (
																																																														items
																																																													) {
																																																														collections.warranty = items;
																																																													} else {
																																																													}
																																																													// res.json(collections);
																																																													// collection start

																																																													Wholesale.find(
																																																														{
																																																															owner:
																																																																place._id
																																																														}
																																																													)
																																																														.sort(
																																																															{
																																																																name: -1
																																																															}
																																																														)
																																																														.then(
																																																															(
																																																																items
																																																															) => {
																																																																if (
																																																																	items
																																																																) {
																																																																	collections.wholesale = items;
																																																																} else {
																																																																}
																																																																res.json(
																																																																	collections
																																																																);
																																																															}
																																																														)
																																																														.catch(
																																																															(
																																																																err
																																																															) =>
																																																																res
																																																																	.status(
																																																																		404
																																																																	)
																																																																	.json(
																																																																		{
																																																																			noItemsFound:
																																																																				'Nothing found'
																																																																		}
																																																																	)
																																																														);
																																																													// collection end
																																																												}
																																																											)
																																																											.catch(
																																																												(
																																																													err
																																																												) =>
																																																													res
																																																														.status(
																																																															404
																																																														)
																																																														.json(
																																																															{
																																																																noItemsFound:
																																																																	'Nothing found'
																																																															}
																																																														)
																																																											);
																																																										// collection end
																																																									}
																																																								)
																																																								.catch(
																																																									(
																																																										err
																																																									) =>
																																																										res
																																																											.status(
																																																												404
																																																											)
																																																											.json(
																																																												{
																																																													noItemsFound:
																																																														'Nothing found'
																																																												}
																																																											)
																																																								);
																																																							// collection end
																																																						}
																																																					)
																																																					.catch(
																																																						(
																																																							err
																																																						) =>
																																																							res
																																																								.status(
																																																									404
																																																								)
																																																								.json(
																																																									{
																																																										noItemsFound:
																																																											'Nothing found'
																																																									}
																																																								)
																																																					);
																																																				// collection end
																																																			}
																																																		)
																																																		.catch(
																																																			(
																																																				err
																																																			) =>
																																																				res
																																																					.status(
																																																						404
																																																					)
																																																					.json(
																																																						{
																																																							noItemsFound:
																																																								'Nothing found'
																																																						}
																																																					)
																																																		);
																																																	// collection end
																																																}
																																															)
																																															.catch(
																																																(
																																																	err
																																																) =>
																																																	res
																																																		.status(
																																																			404
																																																		)
																																																		.json(
																																																			{
																																																				noItemsFound:
																																																					'Nothing found'
																																																			}
																																																		)
																																															);
																																														// collection end
																																													}
																																												)
																																												.catch(
																																													(
																																														err
																																													) =>
																																														res
																																															.status(
																																																404
																																															)
																																															.json(
																																																{
																																																	noItemsFound:
																																																		'Nothing found'
																																																}
																																															)
																																												);
																																											// collection end
																																										}
																																									)
																																									.catch(
																																										(
																																											err
																																										) =>
																																											res
																																												.status(
																																													404
																																												)
																																												.json(
																																													{
																																														noItemsFound:
																																															'Nothing found'
																																													}
																																												)
																																									);
																																								// collection end
																																							}
																																						)
																																						.catch(
																																							(
																																								err
																																							) =>
																																								res
																																									.status(
																																										404
																																									)
																																									.json(
																																										{
																																											noItemsFound:
																																												'Nothing found'
																																										}
																																									)
																																						);
																																					// collection end
																																				}
																																			)
																																			.catch(
																																				(
																																					err
																																				) =>
																																					res
																																						.status(
																																							404
																																						)
																																						.json(
																																							{
																																								noItemsFound:
																																									'Nothing found'
																																							}
																																						)
																																			);
																																		// collection end
																																	}
																																)
																																.catch(
																																	(
																																		err
																																	) =>
																																		res
																																			.status(
																																				404
																																			)
																																			.json(
																																				{
																																					noItemsFound:
																																						'Nothing found'
																																				}
																																			)
																																);
																															// collection end
																														}
																													)
																													.catch(
																														(
																															err
																														) =>
																															res
																																.status(
																																	404
																																)
																																.json(
																																	{
																																		noItemsFound:
																																			'Nothing found'
																																	}
																																)
																													);
																												// collection end
																											}
																										)
																										.catch((err) =>
																											res
																												.status(
																													404
																												)
																												.json({
																													noItemsFound:
																														'Nothing found'
																												})
																										);
																									// collection end
																								})
																								.catch((err) =>
																									res
																										.status(404)
																										.json({
																											noItemsFound:
																												'Nothing found'
																										})
																								);
																							// collection end
																						})
																						.catch((err) =>
																							res.status(404).json({
																								noItemsFound:
																									'Nothing found'
																							})
																						);
																					// collection end
																				})
																				.catch((err) =>
																					res.status(404).json({
																						noItemsFound: 'Nothing found'
																					})
																				);
																			// collection end
																		})
																		.catch((err) =>
																			res
																				.status(404)
																				.json({ noItemsFound: 'Nothing found' })
																		);
																	// collection end
																})
																.catch((err) =>
																	res
																		.status(404)
																		.json({ noItemsFound: 'Nothing found' })
																);
															// collection end
														})
														.catch((err) =>
															res.status(404).json({ noItemsFound: 'Nothing found' })
														);
													// collection end
												})
												.catch((err) =>
													res.status(404).json({ noItemsFound: 'Nothing found' })
												);
											// collection end
										})
										.catch((err) => res.status(404).json({ noItemsFound: 'Nothing found' }));
									// collection end
								})
								.catch((err) => res.status(404).json({ noItemsFound: 'Nothing found' }));
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

router.get('/template', (req, res) => {
	Grouping.find({ public: true, published: true })
		.then((items) => res.json(items))
		.catch((err) => res.status(404).json({ noItemsFound: 'Nothing found' }));
});

router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id, type: 'main' }).then((profile) => {
		if (profile) {
			Place.findOne({ owner: profile._id, status: 'claimed' }).then((place) => {
				if (place) {
					const errors = {};

					Grouping.findById(req.params.id)
						.then((Grouping) => {
							// Check for post owner
							if (Grouping.owner.toString() !== place.id) {
								return res.status(401).json({ notauthorized: ' Not authorized' });
							}

							// Delete
							Grouping.remove().then(() => res.json({ success: true }));
						})
						.catch((err) => res.status(404).json({ Groupingnotfound: 'Grouping not  found' }));
				} else {
					res.status(404).json({ place: 'You do not have permision to delete this item' });
				}
			});
		} else {
			res.status(404).json({ profile: 'You must first create a profile' });
		}
	});
});

router.post('/quick-change/:field/:action/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id, type: 'main' }).then((profile) => {
		if (profile) {
			Place.findOne({ owner: profile._id, status: 'claimed' }).then((place) => {
				if (place) {
					const errors = {};

					Grouping.findById(req.params.id)
						.then((Grouping) => {
							// Check for post owner
							if (Grouping.owner.toString() !== place.id && Grouping.owner.toString() !== place._id) {
								return res.status(401).json({ notauthorized: ' Not authorized' });
							}
							// Delete
							let quickUpdate = {};
							let action = req.params.action;
							let field = req.params.field;
							quickUpdate[String(field)] = String(action);

							Grouping.findOneAndUpdate({ _id: req.params.id }, { $set: quickUpdate }, { new: true })
								.then((Grouping) => res.json(Grouping))
								.catch((err) => res.status(428).json({ Groupingnotfound: 'could not save Grouping' }));
						})
						.catch((err) => res.status(404).json({ Groupingnotfound: 'Grouping not  found' }));
				} else {
					res.status(404).json({ place: 'You do not have permision to delete this item' });
				}
			});
		} else {
			res.status(404).json({ profile: 'You must first create a profile' });
		}
	});
});
module.exports = router;
