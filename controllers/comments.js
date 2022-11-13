const Comment = require('../models/comment')
const Post = require('../models/post')

module.exports.createComment = async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    comment.post = post;
    post.comments.push(comment);
    await comment.save();
    await post.save();
    req.flash('success', 'Created new comment!');
    res.redirect(`/posts/${post._id}`);
};

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted comment');
    res.redirect(`/posts/${id}`);
}