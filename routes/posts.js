const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validatePost } = require('../middleware')
const posts = require('../controllers/posts')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })


router.get('/page/:page', catchAsync(posts.index))

router.post('/', isLoggedIn, upload.array('image'), validatePost, catchAsync(posts.createPost));

router.get('/new', isLoggedIn, posts.renderNewForm);

router.route('/:id')
    .get(catchAsync(posts.showPost))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePost, catchAsync(posts.updatePost))
    .patch(isLoggedIn, catchAsync(posts.likePost))
    .delete(isLoggedIn, isAuthor, catchAsync(posts.deletePost));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(posts.renderEditForm));

module.exports = router;