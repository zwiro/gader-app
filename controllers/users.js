const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comment');
const { cloudinary } = require('../cloudinary');
const post = require('../models/post');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome!');
            res.redirect('/posts/page/1');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req, res) => {
    if (req.query.returnTo) {
        req.session.returnTo = req.query.returnTo;
    }
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/';
    res.redirect(redirectUrl);
};

module.exports.logout = async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    })
    req.flash('success', 'Goodbye!');
    res.redirect('/posts/page/1');
};

module.exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.user });
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    user.image.push(...img);
    await user.save();
    if (req.body.deleteImage) {
        for (let filename of req.body.deleteImage) {
            await cloudinary.uploader.destroy(filename);
        }
    }
    await user.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage } } } })
    req.flash('success', 'Successfully updated user!');
    res.redirect(`/user/${user._id}`);
}

module.exports.renderUserProfile = async (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.params.page);
    const user = await User.findById(id);
    const posts = await Post.find({ author: id }).sort({ _id: -1 }).skip((page - 1) * 10).limit(10);
    const comments = await Comment.find({ author: id }).sort({ _id: -1 }).skip((page - 1) * 10).limit(10);
    res.render('users/show', { user, posts, comments, page })
};

module.exports.renderUserProfileComments = async (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.params.page);
    const user = await User.findById(id);
    const comments = await Comment.find({ author: id }).sort({ _id: -1 }).skip((page - 1) * 10).limit(10);
    res.render('users/showComments', { user, comments, page });
};

module.exports.renderUserProfileLikes = async (req, res) => {
    const { id } = req.params;
    const page = parseInt(req.params.page);
    const user = await User.findById(id).sort({ _id: -1 }).skip((page - 1) * 10).limit(10).populate({
        path: 'likes',
        populate: {
            path: 'author'
        }
    })
    const likedPosts = user.likes
    res.render('users/showLikes', { user, likedPosts, page })
};

module.exports.renderUserEdit = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        req.flash('error', 'Cannot find that user!');
        return res.redirect('/posts/page/1');
    }
    res.render('users/edit', { user });
}

module.exports.redirectToUser = (req, res) => {
    const { id } = req.params;
    res.redirect(`/user/${id}/page/1`);
}