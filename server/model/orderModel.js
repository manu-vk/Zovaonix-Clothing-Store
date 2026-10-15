const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            image: {
                type: String
            },
            description: {
                type: String
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Google Pay', 'Cash on Delivery', 'UPI', 'Credit/Debit Card', 'Net Banking'],
        default: 'Cash on Delivery'
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'return_requested','returned'],
        default: 'pending'
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },  
    razorpayOrderId: {
    type: String,
    default: null
},
razorpayPaymentId: {
    type: String,
    default: null
},
paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
},
    
});

module.exports = mongoose.model('Order', orderSchema);