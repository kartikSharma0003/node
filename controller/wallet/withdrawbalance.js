const jwt = require("jsonwebtoken");
const User = require("../../models/user.js");
const WalletHistory = require("../../models/userwallethistory.js"); // Ensure this points to the correct model

async function withdrawBalance(req, res) {
    const { winBalance } = req.body;

    console.log(`${winBalance}`);
    let errorMsg = null;

    switch (true) {
        case !req.headers['authorization']:
            errorMsg = "Token is Required";
            break;
        case !winBalance:
            errorMsg = "Please Enter The Amount";
            break;
        case winBalance <= 0:
            errorMsg = "Please Enter An Amount Greater Than 0";
            break;
        default:
            errorMsg = null;
            break;
    }

    if (errorMsg) {
        return res.status(400).json({ status: 0, msg: errorMsg });
    }

    try {
        const userExist = await User.findOne({ "token": req.headers['authorization'] });
        console.log(`User Exist: ${userExist}`);

        if (userExist) {
            if (userExist.wallet.winBalance < winBalance) {
                return res.status(200).json({ status: 0, msg: "You don't have enough win balance to withdraw." });
            }

            // Update user's winBalance
            userExist.wallet.winBalance -= winBalance;
            const updatedUser = await User.findOneAndUpdate(
                { "token": req.headers['authorization'] },
                { $set: { "wallet.winBalance": userExist.wallet.winBalance } },
                { new: true } // Return the updated document
            );

            // Check if the update was successful
            if (!updatedUser) {
                return res.status(400).json({ status: 0, msg: "Balance update failed" });
            }

            // Create and save wallet history
            try {
                const walletHistory = new WalletHistory({
                    userId: userExist.profile.userid,
                    "profile.email": userExist.profile.email,
                    "profile.fullName": userExist.profile.fullName,
                    "wallet.transactionType": 'debit', // Debit transaction for withdrawal
                    walletBalance: userExist.wallet.winBalance,
                    "wallet.Walletaddress": userExist.wallet.Walletaddress,
                    "wallet.transactionAmount": winBalance
                });

                // Save wallet history
                await walletHistory.save();

                return res.status(200).json({ status: 1, msg: "Withdraw Balance Successfully", });
            } catch (e) {
                console.error("Error during wallet history update:", e);
                return res.status(500).json({ status: 0, msg: "Server error during wallet history update" });
            }

        } else {
            return res.status(404).json({ status: 0, msg: "User not found" });
        }

    } catch (e) {
        console.error("Error during withdraw balance:", e);
        return res.status(500).json({ status: 0, msg: "Server error during withdraw balance", error: e.message });
    }
}

module.exports = { withdrawBalance };
