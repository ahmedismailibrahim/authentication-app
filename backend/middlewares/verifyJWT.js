const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const verifyJWT = (req, res, next) => {
  // in express , headers names are automatically converted to lowercase
  //Authorization header supports MULTIPLE schemes , Authorization : (Basic , Bearer , Digest ..) <token> .
  // we use Bearer scheme because it is the most common for JWTs and required for OAuth 2.0

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.Access_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = verifyJWT;
