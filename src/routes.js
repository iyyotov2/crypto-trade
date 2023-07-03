const router = require('express').Router();

const authController = require('./controllers/authController');
const homeController = require('./controllers/homeController');
const offerController = require('./controllers/offerController');

router.use(homeController);
router.use('/auth', authController);
router.use('/offers', offerController);
router.use('*', (req, res) => {
    res.render('404', { title: '404 Page' });
});

module.exports = router;