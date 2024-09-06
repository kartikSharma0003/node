const jwt = require("jsonwebtoken");

async function jwtVerifyToken(req, res) {

    // console.log(`token ${req.body.token}`)
    if (!req.body.token) {
        return res.status(400).json({
            "status": "0",
            "msg": "JWT token is required"
        });
    }

    try {

        jwt.verify(req.body.token, 'your_jwt_secret_key');
        res.status(200).json({
            "status": "1",
            "msg": "Token is valid"
            //  "data": data
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
    jwtVerifyToken
};
