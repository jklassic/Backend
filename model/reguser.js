const mongoose = require('mongoose');
const { Schema } = mongoose;

const users = new Schema ({
    username:{
        type:String,
        unique: true,
        trim:true,
        minlength:[10, 'Username must be more than 10'],
        required: true
    },
    
    password:{
        type:String,
        required: true,
        trim:true,
        minlength:[10, 'Password must be more than 8']        
    },

    fullname:{
        type:String,
        required: true,
        trim:true,
        minlength:[10, 'Password must be more than 8']
        
    },

    passport:{
        type:String,
        required: true,
        trim:true,
        minlength:[10, 'Password must be more than 8']        
    },

    phone:{
        type:String,
        unique: true,
        required: true,
        trim:true,
        minlength:[10, 'Password must be more than 8']
        
    },

    role:String,
    active:Boolean
})

module.exports = mongoose.model('User', users);
