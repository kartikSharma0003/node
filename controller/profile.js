const jwt = require("jsonwebtoken");
const User = require("../models/user");
async function profile(req, res) {

    if (!req.headers['authorization']) {
        return res.status(400).json({
            "status": "0",
            "msg": "Token is Required"
        });
    }

    try {

        const tokenData = jwt.verify(req.headers['authorization'], 'your_jwt_secret_key');


        const userExistData = await User.findOne({ "profile.userid": tokenData.userid });


        if(userExistData){
          
       
        res.status(200).json({
            "status": "1",
            "msg": "User Profile Get Sucessfully",
              "data": userExistData.profile
        });
    }else {
        res.status(404).json({
            "status": "0",
            "msg": "No Data Found"
        });
    }



  
    } catch (err) {
        res.status(401).json({
            "status": "0",
            "msg": "Invalid token"
        });
        console.error(err);
    }
}

module.exports = {
    profile
};
