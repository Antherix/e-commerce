const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
{
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    },
    
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    description:{
        type:String
    }
},
{
    timestamps:true
});

const CATEGORYMODEL = mongoose.model('Category',categorySchema);
module.exports = CATEGORYMODEL;