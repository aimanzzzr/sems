const mongoose = require('mongoose');

const admin = new mongoose.Schema({
    google_id   : {
        type    : String,
        required: true,
        default : ""
    },
    username    : {
        type    : String,
        required: true
    },
    password    : {
        type    : String,
        required: false
    },
    email       : {
        type    : String,
        required: true,
        default : ""
    },
    created_at  : {
        type    : Date,
        required: true,
        default : Date.now
    },
    profile_img : {
        type    : String,
        required: false,
        default : "/img/profile/default.jpg"
    },
    login_method: {
        type    : Number,
        required: false,
        default : 1
    }
});

module.exports = mongoose.model('admin',admin,'admin');