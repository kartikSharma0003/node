const User = require("../../models/user");

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

    if(userexistdata){
    res.status(200).json({ status:1,msg: "Login Sucessfully",body:userexistdata});
        
    }else{
        res.status(404).json({ status:0,msg: "User Does't Exists",});
      
    }
}

module.exports = {signin}