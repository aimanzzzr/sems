const mongoose = require('mongoose');

const Log = new mongoose.Schema({
    user_id         : {
        type        : mongoose.Schema.Types.ObjectId,
        required    : true,
        ref         : 'user',
    },
    admin_id        : {
        type        : mongoose.Schema.Types.ObjectId,
        required    : true,
        ref         : 'admin',
    },
    os_info         : {
        type        : String,
        required    : true,
        default     : null
    },
    browser_info    : {
        type        : String,
        required    : true,
        default     : null
    },
    device_info     : {
        type        : String,
        required    : true,
        default     : null
    },
    logs_session_id : {
        type        : String,
        required    : true,
        default     : null
    },
    created_at      : {
        type        : Date,
        required    : true,
        default     : Date.now
    },
    counter         : {
        type        : Number,
        required    : true,
        default     : 1
    }
});

module.exports = mongoose.model('log',Log,'logs'); 