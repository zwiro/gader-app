const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

ImageSchema.virtual('avatar').get(function () {
    return this.url.replace('/upload', '/upload/c_crop,g_face,w_200,h_200');
})

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: [ImageSchema],
    location: String,
    age: Number,
    firstname: String,
    lastname: String,
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);