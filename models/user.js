const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: [String],
        default: ["user"]
    },
    profile: {
        userid: {
            type: String,
            unique: true
        },
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        profileImageURL: { type: String, default: "/images/default.png" }
    },
    wallet: {
        Walletaddress: {
            type: String,
            required: true,
            unique: true
        },
        totalBalance: {
            type: Number,
            default: 0
        },

        addBalance: {
            type: Number,
            default: 0
        },
        winBalance:   {
            type: Number,
            default: 0
        },

        withdrawableBalance: {
            type: Number,
            default: 10
        },
        currency: {
            type: String,
            default: "USD"
        }
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function(next) {
    const user = this;

    // Automatically generate user ID if not set
    if (!user.profile.userid) {
        try {
            const userCount = await model('User').countDocuments({});
            const nextUserId = `threepatti${String(userCount + 1).padStart(4, "0")}`;
            user.profile.userid = nextUserId;
        } catch (err) {
            return next(err);
        }
    }

    // Hash the password only if it has been modified (or new user)
    if (user.isModified("password")) {
        const salt = crypto.randomBytes(16).toString("hex");
        const hashedPassword = crypto.createHmac("sha256", salt).update(user.password).digest("hex");
        user.password = hashedPassword;  // Save the hashed password
    }

    // Generate JWT token
    const token = jwt.sign(
        { 
            fullName: user.profile.fullName,
            email: user.profile.email,
            profileImageURL: user.profile.profileImageURL,
            walletAddress: user.wallet.Walletaddress,
            userid :user.profile.userid,
            dateTime: new Date().toISOString() 

        },
        'your_jwt_secret_key',
        // { expiresIn: "5h" }
    );
    user.token = token;

    next();
});

const User = model("User", userSchema);
module.exports = User;
