const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    fullName:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    addressLine1:{
        type:String,
        required:true
    },

    addressLine2:{
        type:String
    },

    city:{
        type:String,
        required:true
    },

    state:{
        type:String,
        required:true
    },

    country:{
        type:String,
        default:'India'
    },

    pincode:{
        type:String,
        required:true
    }
},
{
    timestamps:true
});

let ADDRESSMODEL = mongoose.model('Address',addressSchema);
module.exports=ADDRESSMODEL;