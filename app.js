const express = require("express");
const path  = require("path");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const app = express();
const PORT = process.env.PORT ||8000;
app.use(express.json());

const MONGO_URI = "mongodb+srv://kartiksharmalbm0003:ebErYQOy3sBfVCX1@cluster0.wy5km.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ThreePatti";

mongoose.connect(MONGO_URI).then(() => console.log("MongoDB Connected"));


app.get("/", (req,res)=>{
    res.send("Hi api is working THREE PATTI 😇 👍");
console.log("running");

});

app.use("/user",userRoute);


app.listen(PORT,()=> console.log(`server startd PORT ${PORT}`));
