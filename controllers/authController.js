const User = require("../models/User");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

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

  const newUser = new User({
    first_name, last_name, email, password: hashedPassword
  });

  const accessToken = jwt.sign(
    { id: User._id, email: User.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: 30 });
  
  const refreshToken = jwt.sign(
    { id: User._id, email: User.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' });
  
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  await newUser.save();
  res.status(201).json({ message: "User registered successfully", accessToken });
}

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

  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' });
  
  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' });
  
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({ message: "Login successful", accessToken });


  
}

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: 'No token provided' });

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {

    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
    
    const accessToken = jwt.sign( 
      { id: decoded.id, email: decoded.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' });
    
    res.status(200).json({ accessToken });
  });
}

const logoutUser = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'None' });
  
  res.status(200).json({ message: 'Logged out successfully' });
}


module.exports = { registerUser, loginUser, refreshToken, logoutUser };
  



