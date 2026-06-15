const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
     status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    },
    
    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },

    password:{
        type:String,
        required:true
    },

    phone:{
        type:String
    },

    avatar:{
        type:String
    },

    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },

    isVerified:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true
});

let USERMODEL= mongoose.model('User',userSchema);

module.exports=USERMODEL;