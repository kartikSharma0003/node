const express = require("express");
const router = express.Router();
const { signup, } = require("../controller/auth/signup");
const { signin, } = require("../controller/auth/signin");
const { jwtVerifyToken, } = require("../controller/jwtverify.js");
const { profile, } = require("../controller/profile.js");
const { updateprofile, } = require("../controller/updateprofile.js");
const {withdrawBalance} =require("../controller/wallet/withdrawbalance.js");
const {getbalance} =require("../controller/wallet/getbalance.js");
const {addBalance} =require("../controller/wallet/addbalance.js");
const {getwallethistory} =require("../controller/wallet/wallethistory.js");
const {uploadImage} =require("../controller/uploadimage.js");


router.post("/signin", async (req, res) => {
     await signin(req, res)
});
router.post("/signup", async (req, res) => {
     await signup(req, res)
});

router.post("/verifytoken", async (req, res) => {
     await jwtVerifyToken(req, res)
});

router.get("/profile", async (req, res) => {
     await profile(req, res)
}).post("/profile", async (req, res) => {
     await updateprofile(req, res)
});


router.post("/balance", async (req, res) => {
     await addBalance(req, res)
}).get("/balance", async (req, res) => {
     await getbalance(req, res)
});

router.post("/withdrawbalance",async (req, res)=>{
    
     await withdrawBalance(req, res)
});
router.post("/uploadimage",async (req, res)=>{
    
     await uploadImage(req, res)
});


router.get("/userwallethistory",async(req,res)=>{
     await getwallethistory(req,res)
})






module.exports = router;
