const router = require('express').Router();

const offerService = require('../services/offerService');

router.get('/', async (req, res) => {
    const title = 'Home Page - Crypto Web';
    const offers = await offerService.getAll().lean();

    res.render('home', { offers, title });
});

module.exports = router;