const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
{
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    },
    
    title:{
        type:String,
        required:true,
        trim:true
    },

    description:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    discountPrice:{
        type:Number
    },

    stock:{
        type:Number,
        default:0
    },

    brand:{
        type:String
    },

    images:[
        {
            type:String
        }
    ],

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },

    averageRating:{
        type:Number,
        default:0
    },

    totalReviews:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
});

let PRODUCTMODEL = mongoose.model('Product',productSchema);

module.exports=PRODUCTMODEL;