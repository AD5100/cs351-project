const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: 
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [
        {
            product:
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Product" 
            },
            quantity:
            {
                type: Number,
                required: true
            },
            price:
            {
                type: Number,
                required: true
            },
        },
        ],
        totalAmount:
        {
            type: Number,
            required: true
        },
        paymentMethod:
        {
            type: String,
            enum: ["COD", "Stripe"],
            default: "COD"
        },
        isPaid:
        {
            type: Boolean,
            default: false
        },
        paidAt:
        {
            type: Date
        },
        status:
        {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered"],
        default: "Pending",
        },
    },
    { 
        timestamps: true
    }
);
module.exports = mongoose.model("Order", orderSchema);
