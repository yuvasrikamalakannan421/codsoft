const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/lockdown_browser", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String, // "admin" or "student"
});

const User = mongoose.model("User", UserSchema);

// Register User
app.post("/register", async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    res.json({ message: "User Registered!" });
});

// Login User
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, "SECRET_KEY", { expiresIn: "1h" });
    res.json({ token, role: user.role });
});

// Get Users (Admin Only)
app.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Serve React Frontend (For Deployment)
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));