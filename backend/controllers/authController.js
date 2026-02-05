const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

const createRefreshToken = (user) => {
  jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
};

const registerUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // User.create() : creates and saves immediately in db , use it when no extra logic before saving
  // new User(): creates an object in memory  and requires .save() for saving to db ,more control

  const newUser = new User({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  //Tokens are created at registration only if the app supports auto-login or OAuth signup.
  // OAuth : mean A user creates an account or logs in using another trusted third-party service (like Google, Facebook, etc.) .
  const accessToken = createAccessToken(newUser);
  const refreshToken = createRefreshToken(newUser);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  newUser.refreshToken = refreshToken;

  await newUser.save();
  res
    .status(201)
    .json({ message: "User registered successfully", accessToken });
};

// Login User

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email }).exec();

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json({ message: "Login successful", accessToken });
};

const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).json({ message: "No token provided" });

  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken }).exec();

  if (!user) {
    return res.status(403).json({ message: "Forbidden" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user._id.toString() !== decoded.id)
      return res.status(403).json({ message: "Failed to authenticate token" });

    const accessToken = createAccessToken(user);
    res.status(200).json({ accessToken });
  });
};

// Logout User

const logoutUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const user = await User.findOne({ refreshToken: cookies.jwt }).exec();
  if (user) {
    user.refreshToken = "";
    await user.save();
  }
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, refresh, logoutUser };
