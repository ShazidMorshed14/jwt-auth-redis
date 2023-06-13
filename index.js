require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();

app.use(express.json());

//middleware function

function verifyToken(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        status: false,
        message: "token not valid",
      });
    }
    //Bearer tokenstring
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    //console.log(error);
    return res
      .status(401)
      .json({ status: false, message: "token not valid", data: error });
  }
}

//routes
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "shazid" && password == "admin") {
    const access_token = jwt.sign(
      { sub: username },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TIME }
    );
    return res.json({
      status: true,
      message: "Success",
      data: { access_token: access_token },
    });
  } else {
    return res.status(401).json({ status: false, message: "Login failed" });
  }
});

//protected routes
app.get("/dashboard", verifyToken, (req, res) => {
  return res.json({ success: true, message: "Dashboard" });
});

app.listen(5000, () => {
  console.log(`app is listening to port 5000`);
});
