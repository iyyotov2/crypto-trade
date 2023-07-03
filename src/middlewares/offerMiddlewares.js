const offerService = require('../services/offerService');

exports.preloadOffer = async (req, res, next) => {
    const offer = await offerService.getOne(req.params.offerId).lean();

    req.offer = offer;

    next();
}

exports.isOfferOwner = (req, res, next) => {
    if (req.offer.owner != req.user._id) {
        return next({error: 'You are not authorized', status: 401});
    }

    next();
}