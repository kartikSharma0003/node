const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

// Use your MongoDB URI with the password
const MONGO_URI = "mongodb+srv://kartiksharmalbm0003:ebErYQOy3sBfVCX1@cluster0.wy5km.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//ebErYQOy3sBfVCX1
mongoose.connect(MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB Connected");
}).catch((err) => {
    console.error("MongoDB Connection Error:", err);
});

app.get("/", (req, res) => {
    res.send("Hi API is working THREE PATTI 😇 👍");
});

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
