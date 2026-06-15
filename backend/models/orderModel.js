const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product'
            },

            quantity:{
                type:Number,
                required:true
            },

            price:{
                type:Number,
                required:true
            }
        }
    ],

    shippingAddress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Address'
    },

    totalAmount:{
        type:Number,
        required:true
    },

    paymentMethod:{
        type:String,
        enum:['COD','UPI','CARD']
    },

    paymentStatus:{
        type:String,
        enum:['Pending','Paid','Failed'],
        default:'Pending'
    },

    orderStatus:{
        type:String,
        enum:[
            'Placed',
            'Processing',
            'Shipped',
            'Delivered',
            'Cancelled'
        ],
        default:'Placed'
    }
},
{
    timestamps:true
});

const ORDERMODEL= mongoose.model('Order',orderSchema);