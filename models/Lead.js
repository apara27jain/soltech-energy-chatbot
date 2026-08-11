const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        company: {
            type: String,
            trim: true,
            default: "N/A"
        },
        pincode: {
            type: String,
            trim: true
        },
        monthly_bill: {
            type: String,
            trim: true
        },
        action_context: {
            type: String,
            trim: true
        },
        language: {
            type: String,
            trim: true,
            default: "en"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
