const mongoose = require('mongoose');

const user = new mongoose.Schema({
    fullname        : {
        type        : String,
        required    : true
    },
    username        : {
        type        : String,
        required    : true
    },
    password        : {
        type        : String,
        required    : true
    },
    birth_date      : {
        type        : String,
        required    : true
    },
    is_active       : {
        type        : Boolean,
        required    : true,
        default     : true
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
    is_firework     : {
        type        : Boolean,
        required    : true,
        default     : false
    },
    has_password    : {
        type        : Boolean,
        required    : true,
        default     : false
    },
    countdown_title : {
        type        : mongoose.Schema.Types.Mixed,
        required    : true,
        default     : {before : null,on: null}
    },
    firework_setting: {
        type        : mongoose.Schema.Types.Mixed,
        required    : true,
        default     : {
            shell_type      : null,
            shell_size      : null,
            quality         : null,
            sky_lighting    : null,
            scale           : null,
            finale_mode     : null,
            auto_fire       : null,
            is_finale_mode  : null,
            is_sound        : null
        }
    }
});

module.exports = mongoose.model('user',user,'users'); 