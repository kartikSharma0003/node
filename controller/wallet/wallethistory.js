const User = require("../../models/user");
const WalletHistory = require("../../models/userwallethistory.js");

async function getwallethistory(req, res) {
    let errorMsg = null;

    // Check if the authorization header is provided
    switch (true) {
        case !req.headers['authorization']:
            errorMsg = "Token is Required";
            break;
        default:
            errorMsg = null;
            break;
    }

    if (errorMsg) {
        return res.status(400).json({ status: 0, msg: errorMsg });
    }

    try {
        // Find the user by token
        const userExist = await User.findOne({ "token": req.headers['authorization'] });

        if (userExist) {
            // Fetch all wallet history for the user
            const walletHistories = await WalletHistory.find({ "userId": userExist.profile.userid });

            // Return wallet history
            return res.status(200).json({ status: 1, msg: "Wallet history fetched successfully", body: walletHistories });
        } else {
            return res.status(404).json({ status: 0, msg: "User Does Not Exist" });
        }
    } catch (e) {
        console.error("Error during get wallet history:", e);
        return res.status(500).json({ status: 0, msg: "Server error", error: e.message });
    }
}

module.exports = { getwallethistory };
