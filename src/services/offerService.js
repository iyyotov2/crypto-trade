const Offer = require('../models/Crypto');

exports.getOne = (offerId) => Offer.findById(offerId);

exports.getOneDetailed = (offerId) => Offer.findById(offerId).populate('owner');

exports.getAll = () => Offer.find();

exports.create = (offerData) => Offer.create(offerData);

exports.delete = (offerId) => Offer.deleteOne({_id: offerId});