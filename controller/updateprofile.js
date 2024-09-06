const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function updateprofile(req, res) {
    const { email, fullname,  } = req.body;

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
            errorMsg = "Full Name is Required";
            break;
        // case !walletaddress:
            // errorMsg = "Wallet Address is Required";
            // break;
        // Uncomment this if you want to validate wallet address with regex
        // case !new RegExp(/^[a-zA-Z0-9]{34}$/).test(walletaddress):
        //     errorMsg = "Invalid Wallet Address Format";
        //     break;
        default:
            errorMsg = null;
            break;
    }

    if (errorMsg) {
        return res.status(400).json({ status: 0, msg: errorMsg });
    }

    try {
       
        const tokenData = jwt.verify(req.headers['authorization'], "your_jwt_secret_key");
        console.log(`Token data: ${JSON.stringify(tokenData)}`);
  
        const checkUser =  await User.findOne({"profile.email": email});
                 
        

        if (checkUser ) {
            return res.status(409).json({ status: 0, msg: "A user with this email already exists" });
        }

   
        const userExistData = await User.findOne({ "profile.userid": tokenData.userid });

        if (userExistData) {
            // Update the user's profile fields
            const updatedUser = await User.findOneAndUpdate(
                { "profile.userid": tokenData.userid },
                {
                    $set: {
                        "profile.email": email,
                        "profile.fullName": fullname,
                        // "wallet.Walletaddress": walletaddress
                    }
                },
                { new: true } // return the updated document
            );

        
           
          
            return res.status(200).json({ status: 1, msg: "Profile updated successfully",  });
        } else {
            return res.status(404).json({ status: 0, msg: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, msg: "Server error", error: error.message });
    }
}

module.exports = { updateprofile };
