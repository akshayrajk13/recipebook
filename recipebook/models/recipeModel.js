const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    ingredients: [
      {
        ingredientname: {
          type: String,
          required: [true, "Ingredient is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
        },
        unit: {
          type: String,
          required: [true, "Unit is required"],
        },
        _id: false,
      },
    ],

    steps: [
      {
        type: String,
        required: [true, "Steps are required"],
      },
    ],

    cookingtime: {
      hours: {
        type: Number,
        default: 0,
        required: [true, "Hours are required"],
      },
      minutes: {
        type: Number,
        default: 0,
        required: [true, "Minutes are required"],
      },
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: [true, "Difficulty level is required"],
    },

    viewcount: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
