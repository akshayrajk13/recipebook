// Load environment variables
require("dotenv").config();
console.log("JWT Secret:", process.env.JWT_SECRET);
console.log("Database URI:", process.env.DB_URI);

var createError = require("http-errors");
var express = require("express");
const cors = require("cors");
const session = require("express-session");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const db = require("./database/db"); // Ensure this file contains your DB connection logic

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const apiRouter = require("./routes/api");
const expressLayouts = require("express-ejs-layouts");

var app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Layout setup
app.use(expressLayouts);
app.set("layout", "layouts/layout");

// Middlewares
app.use(logger("dev"));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
