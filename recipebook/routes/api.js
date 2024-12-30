var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to 'uploads/' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix); // Set unique filename
  },
});
const upload = multer({ storage });

/* Middleware to authenticate user */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token missing or invalid" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

/* POST Sign Up User */
router.post("/signup", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords don't match" });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: "E-mail already exists" });
      }
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      return newUser.save();
    })
    .then(() => res.status(201).json({ message: "Sign up successful" }))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
});

/* POST Log In User */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "E-mail not found" });
      }
      if (user.isBlocked) {
        return res
          .status(403)
          .json({ message: "Your account has been blocked" });
      }
      if (user.isAdmin) {
        return res
          .status(403)
          .json({ message: "Admins cannot access the client website." });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      const token = jwt.sign(
        { userId: user._id, userName: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token });
    })
    .catch((error) => {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

/* GET Profile User */
router.get("/profile", authenticate, (req, res) => {
  User.findById(req.user.userId)
    .select("email name _id")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ email: user.email, name: user.name, id: user._id });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
});

/* PATCH Reset Password */
router.patch("/resetpassword", authenticate, (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (newPassword !== confirmNewPassword) {
    return res
      .status(400)
      .json({ message: "New password and confirm password do not match" });
  }

  User.findById(req.user.userId)
    .then((user) => {
      if (!user) return res.status(404).json({ message: "User not found" });

      return bcrypt
        .compare(currentPassword, user.password)
        .then((isPasswordValid) => {
          if (!isPasswordValid) {
            return res
              .status(401)
              .json({ message: "Current password is incorrect" });
          }
          return bcrypt
            .hash(newPassword, 10)
            .then((hashedPassword) => {
              user.password = hashedPassword;
              return user.save();
            })
            .then(() =>
              res.status(200).json({ message: "Password updated successfully" })
            );
        });
    })
    .catch((error) => {
      console.error("Error during password reset:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

/* POST Add Recipe */
router.post("/addrecipe", upload.single("image"), authenticate, (req, res) => {
  const { title, description, ingredients, steps, cookingtime, difficulty } =
    req.body;

  if (
    !title ||
    !description ||
    !ingredients ||
    !steps ||
    !cookingtime ||
    !difficulty ||
    !req.file
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let parsedIngredients, parsedSteps, parsedCookingTime;
  try {
    parsedIngredients = JSON.parse(ingredients);
    parsedSteps = JSON.parse(steps);
    parsedCookingTime = JSON.parse(cookingtime);
  } catch (parseError) {
    return res.status(400).json({ message: "Invalid JSON format" });
  }

  const newRecipe = new Recipe({
    user_id: req.user.userId,
    title,
    description,
    ingredients: parsedIngredients,
    steps: parsedSteps,
    cookingtime: parsedCookingTime,
    difficulty,
    image: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
  });

  newRecipe
    .save()
    .then(() =>
      res.status(201).json({ message: "Recipe created successfully." })
    )
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    });
});

/* GET Dashboard Recipes & Search */
router.get("/allrecipes", authenticate, (req, res) => {
  const search = req.query.search || "";
  const searchRegex = new RegExp(search, "i");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  Recipe.find({ $or: [{ title: searchRegex }, { description: searchRegex }] })
    .select("_id title user_id description difficulty viewcount image")
    .populate("user_id", "name")
    .skip((page - 1) * limit)
    .limit(limit)
    .then((recipes) => {
      Recipe.countDocuments({
        $or: [{ title: searchRegex }, { description: searchRegex }],
      })
        .then((totalCount) => {
          res.status(200).json({
            recipes: recipes.map((recipe) => ({
              id: recipe._id,
              title: recipe.title,
              user: recipe.user_id.name,
              description: recipe.description,
              difficulty: recipe.difficulty,
              viewcount: recipe.viewcount,
              image: recipe.image,
            })),
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
          });
        })
        .catch((countError) => {
          console.error("Error counting recipes:", countError);
          res.status(500).json({ message: "Error counting recipes." });
        });
    })
    .catch((error) => {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Internal server error." });
    });
});

/* GET User Recipes */
router.get("/userrecipes", authenticate, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  Recipe.find({ user_id: req.user.userId })
    .select("_id title user_id description difficulty viewcount image")
    .populate("user_id", "name")
    .skip((page - 1) * limit)
    .limit(limit)
    .then((recipes) => {
      Recipe.countDocuments({ user_id: req.user.userId })
        .then((totalCount) => {
          res.status(200).json({
            recipes: recipes.map((recipe) => ({
              id: recipe._id,
              title: recipe.title,
              user: recipe.user_id.name,
              description: recipe.description,
              difficulty: recipe.difficulty,
              viewcount: recipe.viewcount,
              image: recipe.image,
            })),
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
          });
        })
        .catch((countError) => {
          console.error("Error counting user recipes:", countError);
          res.status(500).json({ message: "Error counting user recipes." });
        });
    })
    .catch((error) => {
      console.error("Error fetching user recipes:", error);
      res.status(500).json({ message: "Internal server error." });
    });
});

module.exports = router;
