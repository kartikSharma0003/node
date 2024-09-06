const User = require("../../models/user");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex pattern
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // Password must be 8 characters long, with at least one digit, one lowercase, and one uppercase letter

async function signup(req, res) {
    console.log("Request SignUp Request body:", req.body);
    const { fullName, email, password, Walletaddress } = req.body;

    let errorMsg = null;
    if (!fullName) {
        errorMsg = "Full name is required";
    } else if (!email) {
        errorMsg = "Email is required";
    } else if (!emailRegex.test(email)) {
        errorMsg = "Invalid Email Format";
    } else if (!password) {
        errorMsg = "Password is required";
    } else if (!passwordRegex.test(password)) {
        errorMsg = "Password must be at least 8 characters long, with at least one digit, one lowercase, and one uppercase letter";
    } else if (!Walletaddress) {
        errorMsg = "Wallet address is required";
    }

    if (errorMsg) {
        return res.status(400).json({ status: 0, msg: errorMsg });
    }

    try {
        const userExist = await User.findOne({ "profile.email": email });
        console.log(`userExist -> ${userExist}`);

        if (userExist) {
            return res.status(400).json({
                status: 0,
                msg: "Email Already Exists"
            });
        }

         const Existswalletaddress = await User.findOne({ "wallet.Walletaddress": Walletaddress });
         if (Existswalletaddress) {
            return res.status(400).json({
                status: 0,
                msg: "Wallet Address Already Exists"
            });
        }
        // Create user with wallet address and profile information
        await User.create({
            profile: { fullName, email },
            password,
            wallet: { Walletaddress }
        });

        console.log("Post signup");
        res.status(201).json({ status: 1, msg: "User created successfully. Now please login." });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ status: 0, msg: "Internal Server Error" });
    }
}

module.exports = {
    signup
};
