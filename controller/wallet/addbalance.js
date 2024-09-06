const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const WalletHistory = require("../../models/userwallethistory"); // Assuming this is your wallet history model

async function addBalance(req, res) {
    let { amount } = req.body;
    let errorMsg = null;

    // Convert amount to an integer if it's a string
    amount = parseInt(amount, 10);

    switch (true) {
        case !req.headers['authorization']:
            errorMsg = "Token is Required";
            break;
        case isNaN(amount) || amount <= 0: // Validate if amount is a positive number
            errorMsg = "Please Enter A Valid Amount Greater Than 0";
            break;
        default:
            errorMsg = null;
            break;
    }

    if (errorMsg) {
        return res.status(400).json({ status: 0, msg: errorMsg });
    }

    try {
        // Find user by token
        const userExist = await User.findOne({ "token": req.headers['authorization'] });
        console.log(`User Exist: ${userExist}`);

        if (userExist) {
            // Update user's addBalance by adding the amount to the existing balance
            const updatedUser = await User.findOneAndUpdate(
                { "token": req.headers['authorization'] }, // Find user by token
                { $inc: { "wallet.addBalance": amount } }, // Increment addBalance by the amount
                { new: true } // Return the updated document after update
            );

            // Check if the update was successful
            if (!updatedUser) {
                return res.status(400).json({ status: 0, msg: "Balance update failed" });
            }

            try {
                // Create a wallet history record
                const walletHistory = new WalletHistory({
                    userId: userExist.profile.userid,
                    "profile.email": userExist.profile.email,
                    "profile.fullName": userExist.profile.fullName,
                    "wallet.transactionType": 'Credit', // For credit transaction
                    walletBalance: updatedUser.wallet.addBalance, // Updated balance after increment
                    "wallet.Walletaddress": updatedUser.wallet.Walletaddress,
                    "wallet.transactionAmount": amount
                });

                // Save wallet history
                await walletHistory.save();

                return res.status(200).json({ status: 1, msg: "Balance Added Successfully", updatedUser });
            } catch (e) {
                console.error("Error during wallet history update:", e);
                return res.status(500).json({ status: 0, msg: "Server error during wallet history update" });
            }

        } else {
            return res.status(404).json({ status: 0, msg: "User not found" });
        }

    } catch (e) {
        console.error("Error during add balance:", e);
        return res.status(500).json({ status: 0, msg: "Server error during balance update", error: e.message });
    }
}

module.exports = { addBalance };
