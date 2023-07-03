const router = require('express').Router();

const authService = require('../services/authService');
const { USER_SESSION_NAME } = require('../constants');
const { isAuth, isGuest } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');

router.get('/register', isGuest, (req, res) => {
    const title = 'Register Page - Crypto Web';

    res.render('auth/register', { title });
});

router.post('/register', isGuest, async (req, res) => {
    const { username, email, password, repeatPassword } = req.body;

    if (password !== repeatPassword) {
        return res.render('auth/register', {error: 'Password missmatch!', title: 'Register Page - Crypto Web'});
    }

    try {
        const createdUser = await authService.create({username, email, password});

        res.redirect('/');
    } catch (error) {
        res.render('auth/register', {error: getErrorMessage(error), title: 'Register Page - Crypto Web'});
    }
});

router.get('/login', isGuest, (req, res) => {
    const title = 'Login Page - Crypto Web';

    res.render('auth/login', { title });
});

router.post('/login', isGuest, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authService.login(email, password);
        const token = await authService.createToken(user);

        res.cookie(USER_SESSION_NAME, token, { httpOnly: true });

        res.redirect('/');
    } catch (error) {
        res.render('auth/login', {error: getErrorMessage(error), title: 'Login Page - Crypto Web'});
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie(USER_SESSION_NAME);

    res.redirect('/');
});

module.exports = router;