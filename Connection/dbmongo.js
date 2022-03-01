const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/imw",{ useNewUrlParser: true,useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    uid: String,
    email: String,
    password: String,
    name: String,
    picture: String
});

const user = mongoose.model('user', userSchema, 'users');
module.exports = user;