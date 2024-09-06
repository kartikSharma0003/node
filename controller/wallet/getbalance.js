
const User = require("../../models/user.js");
async function getbalance(req, res) {

    if (!req.headers['authorization']) {
        return res.status(400).json({
            "status": "0",
            "msg": "Token is Required"
        });
    }

    try {

        //  jwt.verify(req.headers['authorization'], 'your_jwt_secret_key');


        existdata =    await User.findOne({ "token": req.headers['authorization'] });
        if (existdata) {
            res.status(200).json({
                "status": "1",
                "msg": "User Balance Get Sucessfully",
                  "data": existdata["wallet"]
            });
       }else{
        return res.status(404).json({
            status: 0,
            msg: "Data Not Found",
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
    getbalance
};
