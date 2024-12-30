import React, { useState, useEffect } from "react";
import Nav from "../Nav";
import Footer from "../Footer";
import Header from "./Header";
import headerPhoto from "./images/Header.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import checkAuth from "../auth/checkAuth";

function Addrecipe() {
  const user = useSelector((store) => store.auth.user);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [ingredient, setIngredient] = useState({
    ingredientname: "",
    quantity: "",
    unit: "",
  });
  const [ingredients, setIngredients] = useState([]);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!ingredient.ingredientname.trim()) {
      setError("Ingredient name is required.");
      return;
    }
    if (!ingredient.quantity) {
      setError("Ingredient quantity is required.");
      return;
    }
    if (!ingredient.unit.trim()) {
      setError("Ingredient unit is required.");
      return;
    }
    setError("");
    if (
      ingredient.ingredientname.trim() &&
      ingredient.quantity &&
      ingredient.unit.trim()
    ) {
      setIngredients([...ingredients, ingredient]);
      setIngredient({ ingredientname: "", quantity: "", unit: "" });
    }
  };

  const handleDeleteIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const [step, setStep] = useState("");
  const [steps, setSteps] = useState([]);

  const handleAddStep = (e) => {
    e.preventDefault();
    if (!step.trim()) {
      setError("Step description is required.");
      return;
    }
    setError("");
    if (step.trim()) {
      setSteps([...steps, step]);
      setStep("");
    }
  };

  const handleDeleteStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const [cookingtime, setCookingtime] = useState({ hours: 0, minutes: 0 });
  const [difficulty, setDifficulty] = useState("Easy");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should not exceed 5MB.");
        return;
      }
      setError("");
      setRecipe({ ...recipe, image: file });
    }
  };

  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [],
    steps: [],
    cookingtime: { hours: 0, minutes: 0 },
    difficulty: "Easy",
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!recipe.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!recipe.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (ingredients.length === 0) {
      setError("At least one ingredient is required.");
      return;
    }
    if (steps.length === 0) {
      setError("At least one step is required.");
      return;
    }
    if (!recipe.image) {
      setError("An image is required.");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("title", recipe.title);
    formData.append("description", recipe.description);
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("steps", JSON.stringify(steps));
    formData.append("cookingtime", JSON.stringify(cookingtime));
    formData.append("difficulty", difficulty);
    formData.append("image", recipe.image);

    axios
      .post("http://localhost:4000/api/addrecipe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then(() => {
        navigate("/profile");
      })
      .catch((error) => {
        if (error.response) {
          const serverError = error.response.data.errors
            ? Object.values(error.response.data.errors).join("")
            : error.response.data.message || "An unexpected error occurred.";
          setError(serverError);
        } else if (error.request) {
          setError("Unable to reach the server. Please try again later.");
        } else {
          setError(`Error: ${error.message}`);
        }
      });
  };
  return (
    <>
      <div className="container pb-5 pt-5 d-flex flex-column min-vh-100">
        <Nav />
        <Header
          headerText={`Add Recipe`}
          headerSubText={`Share Your Flavor, Inspire the World! Add Your Favorite Recipes
            Today!`}
          headerPhoto={headerPhoto}
        />
        <div className="w-100 pt-5">
          <form
            className="pb-5 mb-5"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            {/* Title */}
            <div className="form-floating mb-3 shadow rounded">
              <input
                type="text"
                className="form-control"
                id="title"
                placeholder="Title"
                value={recipe.title}
                onChange={(e) =>
                  setRecipe({ ...recipe, title: e.target.value })
                }
              />
              <label htmlFor="title">Title</label>
            </div>
            {/* Description */}
            <div className="form-floating mb-3 shadow rounded">
              <textarea
                className="form-control"
                id="description"
                placeholder="Description"
                value={recipe.description}
                onChange={(e) =>
                  setRecipe({ ...recipe, description: e.target.value })
                }
              />
              <label htmlFor="description">Description</label>
            </div>
            {/* Ingredient */}
            <div className="input-group mb-3">
              <label
                htmlFor="addingredient"
                className="input-group-text bg-warning border-0 shadow"
              >
                Ingredient
              </label>
              <input
                type="text"
                className="form-control shadow"
                id="addingredient"
                placeholder="Add Ingredient"
                value={ingredient.ingredientname}
                onChange={(e) =>
                  setIngredient({
                    ...ingredient,
                    ingredientname: e.target.value,
                  })
                }
              />

              <label
                htmlFor="addquantity"
                className="input-group-text bg-warning border-0 shadow"
              >
                Quantity
              </label>
              <input
                type="number"
                className="form-control shadow"
                id="addquantity"
                placeholder="Add Quantity"
                value={ingredient.quantity}
                onChange={(e) =>
                  setIngredient({ ...ingredient, quantity: e.target.value })
                }
              />

              <label
                htmlFor="addunit"
                className="input-group-text bg-warning border-0 shadow"
              >
                Unit
              </label>
              <input
                type="text"
                className="form-control me-2 rounded-end shadow"
                id="addunit"
                placeholder="Add Unit"
                value={ingredient.unit}
                onChange={(e) =>
                  setIngredient({ ...ingredient, unit: e.target.value })
                }
              />
              <button
                type="button"
                className="btn btn-outline-dark shadow rounded"
                onClick={handleAddIngredient}
                disabled={
                  !ingredient.ingredientname.trim() ||
                  !ingredient.quantity.trim() ||
                  !ingredient.unit.trim()
                }
              >
                +
              </button>
            </div>
            {/* List of Ingredients */}
            <ul
              className="list-group mb-3 shadow rounded"
              style={{
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {ingredients.map((ing, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {`${ing.ingredientname} - ${ing.quantity} ${ing.unit}`}
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteIngredient(index)}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
            {/* Steps */}
            <div className="form-floating mb-3 d-flex">
              <input
                type="text"
                className="form-control me-2 shadow rounded"
                id="addstep"
                placeholder="Add Step"
                value={step}
                onChange={(e) => setStep(e.target.value)}
              />
              <label htmlFor="addstep">Add Step</label>
              <button
                type="button"
                className="btn btn-outline-dark shadow rounded"
                onClick={handleAddStep}
                disabled={!step.trim()}
              >
                +
              </button>
            </div>
            {/* List of Steps */}
            <ul
              className="list-group mb-3 shadow rounded"
              style={{
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {steps.map((step, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {`${index + 1}. ${step}`}
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteStep(index)}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
            {/* Cooking Time */}
            <div className="input-group mb-3 shadow rounded">
              <span className="input-group-text bg-warning border-0">
                Cooking Time
              </span>

              <span className="input-group-text">Hours</span>
              {/* Hours Dropdown */}
              <select
                className="form-select"
                aria-label="Select Hours"
                value={cookingtime.hours}
                onChange={(e) =>
                  setCookingtime({
                    ...cookingtime,
                    hours: parseInt(e.target.value, 10),
                  })
                }
              >
                {[...Array(24).keys()].map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <span className="input-group-text">Minutes</span>
              {/* Minutes Dropdown */}
              <select
                className="form-select"
                aria-label="Select Minutes"
                value={cookingtime.minutes}
                onChange={(e) =>
                  setCookingtime({
                    ...cookingtime,
                    minutes: parseInt(e.target.value, 10),
                  })
                }
              >
                {[...Array(60).keys()].map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>
            {/* Difficulty Level */}
            <div className="input-group mb-3 gap-2">
              <span className="input-group-text bg-warning border-0 shadow rounded">
                Difficulty
              </span>
              <div className="d-flex align-items-center gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="difficulty"
                    id="easy"
                    checked={difficulty === "Easy"}
                    onChange={() => setDifficulty("Easy")}
                  />
                  <label className="form-check-label" htmlFor="easy">
                    Easy
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="difficulty"
                    id="medium"
                    value="Medium"
                    checked={difficulty === "Medium"}
                    onChange={() => setDifficulty("Medium")}
                  />
                  <label className="form-check-label" htmlFor="medium">
                    Medium
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="difficulty"
                    id="hard"
                    value="Hard"
                    checked={difficulty === "Hard"}
                    onChange={() => setDifficulty("Hard")}
                  />
                  <label className="form-check-label" htmlFor="hard">
                    Hard
                  </label>
                </div>
              </div>
            </div>
            {/* Add Image */}
            <div className="input-group mb-3 shadow rounded">
              <span className="input-group-text bg-warning border-0">
                Add Image
              </span>
              <input
                type="file"
                className="form-control"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {/* Post Recipe */}
            <button
              type="submit"
              className="btn btn-dark w-100 shadow rounded"
              disabled={
                !recipe.title.trim() ||
                !recipe.description.trim() ||
                ingredients.length === 0 ||
                steps.length === 0 ||
                !recipe.image
              }
            >
              Post Recipe
            </button>
            {error && (
              <div className="alert alert-danger mt-3 text-center p-2 rounded">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default checkAuth(Addrecipe);
