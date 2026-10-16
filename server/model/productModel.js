const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    // title: { type: String, required: true },
    title: { type: String, required: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    brand: { type: String, required: true },
    // category: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    ratingCount: { type: Number, required: true },
    sizes: {
    type: [String],
    enum: ["S", "M", "L", "XL", "XXL"],
    default: ["S", "M", "L", "XL", "XXL"],
},
isLimitedEdition: {
    type: Boolean,
    default: false,
},
    image: { type: [String], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);






// ---------------------------

// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     category: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Category",
//     }
// }, { timestamps: true });

// module.exports = mongoose.model("Product", productSchema);