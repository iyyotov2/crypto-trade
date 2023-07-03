const router = require('express').Router();

const offerService = require('../services/offerService');
const authService = require('../services/authService');
const { preloadOffer, isOfferOwner } = require('../middlewares/offerMiddlewares');
const { getErrorMessage } = require('../utils/errorHelpers');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
    const title = 'Trade Catalog';
    const offers = await offerService.getAll().lean();

    res.render('offer', { offers, title });
});

router.get('/:offerId/details', async (req, res) => {
    const title = 'Details Page';
    const offer = await offerService.getOneDetailed(req.params.offerId).lean();
    const unleanedOffer = await offerService.getOneDetailed(req.params.offerId);
    const isOwner = offer.owner._id == req.user?._id;
    const isBuied = unleanedOffer.buyACrypto.includes(req.user?._id);

    res.render('offer/details', { offer, isOwner, isBuied, title });
});

router.get('/:offerId/edit', isAuth, preloadOffer, isOfferOwner, async (req, res) => {
    const title = 'Edit Page';

    console.log(req.offer.paymentMethod);
    req.offer[`paymentMethod${req.offer.paymentMethod}`] = true;

    res.render('offer/edit', { offer: req.offer, title });
});

router.post('/:offerId/edit', preloadOffer, isOfferOwner, isAuth, async (req, res) => {
    try {
        const offer = await offerService.getOne(req.params.offerId);

        offer.name = req.body.name;
        offer.image = req.body.image;
        offer.price = req.body.price;
        offer.cryptoDescription = req.body.cryptoDescription;
        offer.paymentMethod = req.body.paymentMethod;

        await offer.save();

        res.redirect(`/offers/${req.params.offerId}/details`);
    } catch (error) {
        res.render('offer/edit', { offer: req.body, error: getErrorMessage(error), title: 'Edit Page' });
    }
});

router.get('/create', isAuth, (req, res) => {
    const title = 'Create Page';

    res.render('offer/create', { title });
});

router.post('/create', isAuth, async (req, res) => {
    req.body.price = Number(req.body.price);
    const offerData = {...req.body, owner: req.user._id}

    try {
        await offerService.create(offerData);

        res.redirect('/offers');
    } catch (error) {
        res.render('offer/create', { offer: req.body, error: getErrorMessage(error), title: 'Create Page' });
    }
});



router.get('/:offerId/buy', isAuth, async (req, res) => {
    const offer = await offerService.getOne(req.params.offerId);

    offer.buyACrypto.push(req.user._id);

    await offer.save();

    res.redirect(`/offers/${req.params.offerId}/details`);
});

router.get('/:offerId/delete', isAuth, async (req, res) => {
    await offerService.delete(req.params.offerId)

    res.redirect('/offers');
});

module.exports = router;