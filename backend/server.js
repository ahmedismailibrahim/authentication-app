const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnenct");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());


app.use("/",express.static(path.join(__dirname , "public")));
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));

app.use((req, res) => {
       res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
        return;
    }else if (req.accepts("json")) {
        res.json({ message: "404 Not Found" });
        return;
    }else {
        res.type("txt").send("404 Not Found");
    }
      

});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
