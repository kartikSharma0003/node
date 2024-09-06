const { Schema, model } = require("mongoose");

const WalletHistorySchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    // profile: {
    //     email: {
    //         type: String,
    //         required: true
    //     },
    //     fullName: {
    //         type: String,
    //         required: true
    //     }
    // },
    wallet: {
        transactionType: {
            type: String, // "credit" or "debit"
            required: true
        },
        transactionAmount: {
            type: Number, // should be a number
            required: true
        },
        // Walletaddress: {
        //     type: String,
        //     required: true
        // },
        walletBalance: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Create the model for the Wallet History schema
const WalletHistory = model("WalletHistory", WalletHistorySchema);

module.exports = WalletHistory;
