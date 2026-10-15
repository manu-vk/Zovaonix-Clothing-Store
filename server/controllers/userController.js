const userModel = require("../model/userModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                message: "Google credential is required"
            });
        }

        // Verify the Google ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.sub || !payload.email || !payload.email_verified) {
            return res.status(401).json({
                message: "Invalid or unverified Google account"
            });
        }

        const googleId = payload.sub;
        const email = payload.email.toLowerCase();
        const name = payload.name || email.split("@")[0];

        let user = await userModel.findOne({ email });

        if (user) {
            // Reject if this Google account is already linked to another user
            if (user.googleId && user.googleId !== googleId) {
                return res.status(409).json({
                    message: "This email is linked to a different Google account"
                });
            }

            // Link an existing verified-email account to Google
            if (user.authProvider !== "google") {
                user.authProvider = "google";
            }

            user.googleId = googleId;
            user.isOnline = true;
            user.lastSeen = null;
            await user.save();
        } else {
            user = await userModel.create({
                name,
                email,
                googleId,
                authProvider: "google",
                isOnline: true,
                lastSeen: null,
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: "1y" }
        );

        const safeUser = user.toObject();
        delete safeUser.password;

        return res.status(200).json({
            message: "Google login successful",
            token,
            user: safeUser
        });

    } catch (error) {
        console.error("Google login error:", error.message);

        return res.status(401).json({
            message: "Google authentication failed"
        });
    }
};



const addUser = async (req, res) => {

    console.log(req.body, 'frontend dt');

    try {
        const { name, email, password } = req.body;

        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // console.log(hashedPassword, "hashedPassword");

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error); // Print the actual error
        res.status(500).json({
            message: error.message,
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const ismatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!ismatch) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        await userModel.findByIdAndUpdate(user._id, {
            isOnline: true,
            lastSeen: null
        });

        const token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: "1y" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getUsers = async (req, res) => {
    console.log('frontend data');

    try {
        const users = await userModel.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        const { userId } = req.body;

        await userModel.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
        });

        res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = { getUsers, addUser, loginUser, logoutUser, getProfile,googleLogin, }