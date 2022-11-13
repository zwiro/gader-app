const Post = require('../models/post');
const { cloudinary } = require('../cloudinary');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports.index = async (req, res) => {
    const page = parseInt(req.params.page);
    const allPosts = await Post.find({})
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const posts = await Post.find({ text: regex }).sort({ _id: -1 }).skip((page - 1) * 10).limit(10).populate('author').populate('comments');
        res.render('posts/index', { allPosts, posts, page });
    } else {
        const posts = await Post.find({}).sort({ _id: -1 }).skip((page - 1) * 10).limit(10).populate('author').populate('comments');
        res.render('posts/index', { allPosts, posts, page });
    }
}

module.exports.renderNewForm = (req, res) => res.render('posts/new');

module.exports.createPost = async (req, res) => {
    const post = new Post(req.body.post);
    post.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    post.author = req.user._id;
    await post.save();
    req.flash('success', 'Successfully made a new post!');
    res.redirect('/posts/page/1');
};

module.exports.showPost = async (req, res) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'comments',
        options: { sort: { _id: -1 } },
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/posts/page/1');
    }
    res.render('posts/show', { post });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        req.flash('error', 'Cannot find that post!');
        return res.redirect('/posts/page/1');
    }
    res.render('posts/edit', { post });
};

module.exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    post.image.push(...img);
    await post.save();
    if (req.body.deleteImage) {
        for (let filename of req.body.deleteImage) {
            await cloudinary.uploader.destroy(filename);
        }
        await post.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage } } } })
    }
    req.flash('success', 'Successfully updated post!');
    res.redirect(`/posts/${post._id}`);
};

module.exports.deletePost = async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted post')
    res.redirect('/posts/page/1');
};

module.exports.likePost = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    if (!user.likes.includes(post._id)) {
        user.likes.push(post);
        post.likes++;
    } else {
        const postIndex = user.likes.indexOf(post)
        user.likes.splice(postIndex, 1);
        post.likes--;
    }
    await user.save();
    await post.save();
}



