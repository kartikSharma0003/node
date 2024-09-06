const jwt = require("jsonwebtoken");
const User = require("../models/user");



async function updateprofile(req, res) {
    const { email, fullname,walletaddress  } = req.body;

   

    let errorMsg = null;

    switch (true) { 

        case !req.headers['authorization']:
        errorMsg = "Token is Required";
        break;
        case !email:
            errorMsg = "Email is Required";
            break;
            case !new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email):
                errorMsg = "Invalid Email Format";
                break;

        case !fullname:
            errorMsg = "FullName is Required";
            break;
        case !walletaddress:
             errorMsg = "wallet Address is Required";
             break;
            //  case !new RegExp(/^[a-zA-Z0-9]{34}$/).test(walletaddress):  // Example pattern for wallet address
            //  errorMsg = "Invalid Wallet Address Format";
            //  break;

        default:
            errorMsg = null;
            break;
    }

    if (errorMsg) {
        return res.status(400).json({ status: 0, msg: errorMsg });
    }
    
    try {
         const userExistData = await User.findOne({ token: req.headers['authorization'] });

console.log(`exists ${userExistData}`);

        if (userExistData) {
            // Update the user's profile
            const updatedUser = await User.findOneAndUpdate(
                // { jwt: token },
                { "profile.email": email , "profile.fullName": fullname,"wallet.Walletaddress":walletaddress },
             
            );
            // data: updatedUser
            return res.status(200).json({ status: 1, msg: "Profile updated Sucessfully", });
        } else {
            return res.status(404).json({ status: 0, msg: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, msg: "Server error", error: error.message });
    }
}

module.exports = {updateprofile};
