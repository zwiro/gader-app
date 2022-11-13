const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')
const users = require('../controllers/users');
const { isLoggedIn, isCurrentUser, validateUser, checkReturnTo } = require('../middleware');
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.route('/user/:id')
    .get(users.redirectToUser)
    .patch(isLoggedIn, isCurrentUser, upload.array('image'), validateUser, catchAsync(users.updateUser))

router.get('/logout', catchAsync(users.logout));

router.get('/user/:id/page/:page', catchAsync(users.renderUserProfile))

router.get('/user/:id/comments/page/:page', catchAsync(users.renderUserProfileComments));

router.get('/user/:id/edit', isLoggedIn, isCurrentUser, catchAsync(users.renderUserEdit));

router.get('/user/:id/liked/page/:page', catchAsync(users.renderUserProfileLikes));

module.exports = router;