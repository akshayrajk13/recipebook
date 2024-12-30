var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userEmail) {
    console.log("User E-mail:", req.session.userEmail);
    return next(); // User is authenticated
  }
  console.log("User email not found in session:", req.session);
  return res.redirect("/login"); // Redirect to login if not authenticated
};

/* GET login page. */
router.get("/login", function (req, res, next) {
  res.render("login", {
    message: "",
    errors: [],
    title: "Admin: Login",
    nav: false,
    active: "null",
  });
});

/* POST login page. */
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Invalid E-mail address"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("login", {
        errors: errors.array(),
        message: null,
        title: "Admin: Login",
        nav: false,
        active: "null",
      });
    }

    const { email, password } = req.body;

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.render("login", {
            message: "E-mail not found",
            errors: [],
            title: "Admin: Login",
            nav: false,
            active: "null",
          });
        }

        // Check if the user is an admin
        if (!user.isAdmin) {
          return res.render("login", {
            message: "Access Denied: You are not an admin.",
            errors: [],
            title: "Admin: Login",
            nav: false,
            active: "null",
          });
        }

        // Validate password
        return bcrypt
          .compare(password, user.password)
          .then((isPasswordValid) => {
            if (!isPasswordValid) {
              return res.render("login", {
                message: "Incorrect Password",
                errors: [],
                title: "Admin: Login",
                nav: false,
                active: "null",
              });
            }

            // If admin and password valid, proceed with login
            req.session.userId = user._id;
            req.session.userName = user.name;
            req.session.userEmail = user.email;

            return res.redirect("/");
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Server Error");
      });
  }
);

/* GET home page. */
router.get("/", isAuthenticated, function (req, res, next) {
  const page = parseInt(req.query.page) || 1; // Current page number, default to 1
  const limit = parseInt(req.query.limit) || 10; // Items per page, default to 10
  const skip = (page - 1) * limit; // Calculate the number of items to skip

  // Fetch recipes with pagination
  Recipe.find()
    .select("_id title user_id createdAt viewcount")
    .populate("user_id", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .then((data) => {
      if (data.length === 0) {
        return res.render("index", {
          data: [],
          message: "No recipes found.",
          title: "Admin: Home",
          nav: true,
          active: "home",
        });
      }

      // Format the `createdAt` date for each recipe
      const formattedData = data.map((item) => ({
        ...item.toObject(),
        createdAt: new Date(item.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      // Fetch total count for pagination
      Recipe.countDocuments()
        .then((totalCount) => {
          res.render("index", {
            data: formattedData,
            title: "Admin: Home",
            nav: true,
            active: "home",
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
          });
        })
        .catch((error) => {
          console.error("Error fetching total count:", error);
          res.status(500).send("Error fetching total count");
        });
    })
    .catch((error) => {
      console.error("Error fetching recipes:", error);
      res.status(500).send("Error fetching recipes");
    });
});

/* GET logout page. */
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.redirect("/login");
    }
  });
});

/* GET userslist page. */
router.get("/userslist", isAuthenticated, function (req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  User.find({ isAdmin: false }) // Exclude admins
    .select("_id name email isBlocked isAdmin createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .then((data) => {
      if (data.length === 0) {
        return res.render("userslist", {
          data: [],
          message: "No users found.",
          title: "Admin: Users List",
          nav: true,
          active: "userslist",
        });
      }

      const formattedData = data.map((item) => ({
        ...item.toObject(),
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
      }));

      User.countDocuments()
        .then((totalCount) => {
          res.render("userslist", {
            data: formattedData,
            title: "Admin: Users List",
            nav: true,
            active: "userslist",
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error fetching total user count");
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error fetching users");
    });
});

// Toggle Block
router.post("/toggleblock/:userId", (req, res) => {
  const { userId } = req.params;
  const { isBlocked } = req.body;

  User.findByIdAndUpdate(userId, { isBlocked: isBlocked }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User block status updated successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    });
});

/* GET report page. */
router.get("/report", isAuthenticated, function (req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  Recipe.find()
    .select("_id title user_id createdAt viewcount")
    .populate("user_id", "name email")
    .sort({ viewcount: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .then((data) => {
      if (data.length === 0) {
        return res.render("report", {
          data: [],
          message: "No recipes found.",
          title: "Admin: Report",
          nav: true,
          active: "report",
        });
      }

      const formattedData = data.map((item) => ({
        ...item.toObject(),
        createdAt: item.createdAt
          ? new Date(item.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
      }));

      Recipe.countDocuments()
        .then((totalCount) => {
          res.render("report", {
            data: formattedData,
            title: "Admin: Report",
            nav: true,
            active: "report",
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
          });
        })
        .catch((error) => {
          console.error("Error fetching total count:", error);
          res.status(500).send("Error fetching total count");
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error fetching recipes");
    });
});

/* GET userrecipelist page. */
router.get(
  "/userrecipelist/:userId",
  isAuthenticated,
  function (req, res, next) {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    Recipe.find({ user_id: userId })
      .select("_id title viewcount createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .then((data) => {
        if (data.length === 0) {
          return res.render("userrecipelist", {
            data: [],
            message: "No recipes found for this user.",
            title: "Admin: User Recipe List",
            nav: true,
            active: "null",
            userId: userId,
          });
        }

        const formattedData = data.map((item) => ({
          ...item.toObject(),
          createdAt: item.createdAt
            ? new Date(item.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A",
        }));

        Recipe.countDocuments({ user_id: userId })
          .then((totalCount) => {
            res.render("userrecipelist", {
              data: formattedData,
              title: "Admin: User Recipe List",
              nav: true,
              active: "null",
              currentPage: page,
              totalPages: Math.ceil(totalCount / limit),
              userId: userId,
            });
          })
          .catch((error) => {
            console.error("Error fetching total count:", error);
            res.status(500).send("Error fetching total count.");
          });
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        res.status(500).send("Error fetching recipes.");
      });
  }
);

/* GET viewrecipe page. */
router.get("/viewrecipe/:recipeId", isAuthenticated, function (req, res, next) {
  const recipeId = req.params.recipeId;

  Recipe.findById(recipeId)
    .populate("user_id", "name")
    .select(
      "_id title description ingredients steps cookingtime difficulty viewcount image"
    )
    .then((data) => {
      if (!data) {
        return res.status(404).render("viewrecipe", {
          title: "Admin: View Recipe",
          nav: true,
          active: "null",
          message: "Recipe not found.",
        });
      }

      res.render("viewrecipe", {
        title: "Admin: View Recipe",
        nav: true,
        active: "null",
        data: data,
        message: null,
      });
    })
    .catch((error) => {
      console.error("Error fetching recipe:", error);
      res.status(500).render("viewrecipe", {
        title: "Admin: View Recipe",
        nav: true,
        active: "null",
        message: "An error occurred while fetching the recipe details.",
      });
    });
});

/* GET delete recipe page. */
router.get("/deleterecipe/:recipeId", isAuthenticated, (req, res) => {
  const { recipeId } = req.params;

  Recipe.findByIdAndDelete(recipeId)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).send("Recipe not found");
      }

      const userId = recipe.user_id;

      res.redirect(`/userrecipelist/${userId}`);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server error");
    });
});

module.exports = router;
