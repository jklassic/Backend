const mongoose = require('mongoose');
const { Schema } = mongoose;

const admin = new Schema ({
    username:{
        type:String,
        required: [true, 'Username cannot be empty']
    },
    password:String,
    role:String,
    active:Boolean
})

module.exports = mongoose.model('Admin', admin);