const mongoose = require('mongoose');

const DailyMessage = new mongoose.Schema({
    message_header  : {
        type        : String,
        required    : true
    },
    is_active       : {
        type        : Boolean,
        required    : true,
        default     : true
    },
    is_weekend      : {
        type        : Boolean,
        required    : false,
        default     : null
    },
    time_interval   : {
        type        : Number,
        required    : false,
        default     : null
    },
    created_at      : {
        type        : Date,
        required    : true,
        default     : Date.now
    },
    admin_id        : {
        type        : mongoose.Schema.Types.ObjectId,
        ref         : 'admin',
        required    : true
    },
    user_id         : {
        type        : mongoose.Schema.Types.ObjectId,
        ref         : 'user',
        require     : true,
        default     : null 
    }
});

module.exports = mongoose.model('daily-message',DailyMessage,'daily-message');