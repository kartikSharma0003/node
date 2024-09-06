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

        const data = jwt.verify(req.headers['authorization'], 'your_jwt_secret_key');
        res.status(200).json({
            "status": "1",
            "msg": "User Profile Get Sucessfully",
              "data": data
        });
  
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
