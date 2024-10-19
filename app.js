const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// view engine
app.set("view engine", "ejs");

// Start server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

// routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", (req, res) => res.render("smoothies"));
app.use(authRoutes);

// cookies
app.get("/set-cookies", (req, res) => {
  // res.setHeader("Set-Cookie", "newUser=true");

  res.cookie("newUser", false);
  res.cookie("isEmployee", false, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  res.send("you got this cookie");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);

  res.json(cookies);
});
