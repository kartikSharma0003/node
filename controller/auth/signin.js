const User = require("../../models/user");
const jwt = require("jsonwebtoken");

async function signin(req, res) {
   
    const { email, password } = req.body;

    let errorMsg = null;
    switch (true) {
        case !email:
            errorMsg = "Email is Required";
            break;
        case !password:
            errorMsg = "Password is Required";
            break;

            default:
                errorMsg = null;
                break;

    }

    if(errorMsg){
        return res.status(400).json({status:0,msg:errorMsg});
    }

    const userexistdata = await User.findOne({"profile.email": email })

    // const token = jwt.sign(
    //     { 
    //         fullName: userexistdata.profile.fullName,
    //         email: userexistdata.profile.email,
    //         profileImageURL: userexistdata.profile.profileImageURL,
    //         walletAddress: userexistdata.wallet.Walletaddress,
    //         userid :userexistdata.profile.userid,
    //         dateTime: new Date().toISOString() 

    //     },
    //     'your_jwt_secret_key',
    //     { expiresIn: "5h" }
    // );

    // const updatedUser = await User.findOneAndUpdate(
    //     { "profile.email": email },
    //     {
    //         $set: {
    //             "token": token,
    //             // "profile.fullName": fullname,
    //             // "wallet.Walletaddress": walletaddress
    //         }
    //     },
    //     { new: true } // return the updated document
    // );



    if(userexistdata){
    res.status(200).json({ status:1,msg: "Login Sucessfully",data:userexistdata});
        
    }else{
        res.status(404).json({ status:0,msg: "User Does't Exists",});
      
    }
}

module.exports = {signin}