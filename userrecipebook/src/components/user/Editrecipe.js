import React, { useState, useEffect } from "react";
import Nav from "../Nav";
import Footer from "../Footer";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import headerPhoto from "./images/ProfileHeader.jpg";
import { useSelector } from "react-redux";
import checkAuth from "../auth/checkAuth";

function Editrecipe() {
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [],
    steps: [],
    cookingtime: { hours: 0, minutes: 0 },
    difficulty: "Easy",
    image: null,
  });
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user?.token) {
      return;
    }
    window.scrollTo(0, 0);
    axios
      .get(`http://localhost:4000/api/viewrecipe`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          recipeId,
        },
      })
      .then((response) => {
        setRecipe(response.data.recipe);
      })
      .catch((error) => {
        setError(
          error.response?.data?.message ||
            "Failed to load the recipe. Please try again."
        );
      });
  }, [recipeId, user?.token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      cookingtime: { ...prevRecipe.cookingtime, [name]: parseInt(value, 10) },
    }));
  };

  const [ingredient, setIngredient] = useState({
    ingredientname: "",
    quantity: "",
    unit: "",
  });

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (
      ingredient.ingredientname.trim() &&
      ingredient.quantity &&
      ingredient.unit.trim()
    ) {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        ingredients: [...prevRecipe.ingredients, ingredient],
      }));
      setIngredient({ ingredientname: "", quantity: "", unit: "" });
    }
  };

  const handleDeleteIngredient = (index) => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: prevRecipe.ingredients.filter((_, i) => i !== index),
    }));
  };

  const [step, setStep] = useState("");

  const handleAddStep = () => {
    if (step.trim()) {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        steps: [...prevRecipe.steps, step],
      }));
      setStep("");
    }
  };

  const handleDeleteStep = (index) => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      steps: prevRecipe.steps.filter((_, i) => i !== index),
    }));
  };

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
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        image: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(recipe);
    if (!recipe.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!recipe.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (recipe.ingredients.length === 0) {
      setError("At least one ingredient is required.");
      return;
    }
    if (recipe.steps.length === 0) {
      setError("At least one step is required.");
      return;
    }
    if (!recipe.image) {
      setError("An image is required.");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("title", recipe.title || "");
    formData.append("description", recipe.description || "");
    formData.append("ingredients", JSON.stringify(recipe.ingredients || []));
    formData.append("steps", JSON.stringify(recipe.steps || []));
    formData.append(
      "cookingtime",
      JSON.stringify(recipe.cookingtime || { hours: 0, minutes: 0 })
    );
    formData.append("difficulty", recipe.difficulty || "Easy");

    if (recipe.image instanceof File) {
      formData.append("image", recipe.image);
    } else if (recipe.image) {
      // If no new file is selected but the recipe already has an image, you can send the existing image URL.
      formData.append("image", recipe.image);
    }
    axios
      .patch("http://localhost:4000/api/editrecipe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
        params: { id: recipeId },
      })
      .then(() => {
        navigate(`/viewrecipe/${recipeId}`);
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
          headerText={`Edit Recipe`}
          headerSubText={`Share Your Flavor, Inspire the World! Add Your Favorite Recipes
            Today!`}
          headerPhoto={headerPhoto}
        />
        <div className="w-100 pt-5">
          <form className="pb-5 mb-5" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-floating mb-3 shadow rounded">
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                placeholder="Title"
                value={recipe?.title}
                onChange={handleInputChange}
              />
              <label htmlFor="title">Title</label>
            </div>
            {/* Description */}
            <div className="form-floating mb-3 shadow rounded">
              <textarea
                className="form-control"
                id="description"
                name="description"
                placeholder="Description"
                value={recipe?.description}
                onChange={handleInputChange}
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
                  !ingredient.quantity ||
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
              {recipe?.ingredients.map((ing, index) => (
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
              {recipe?.steps.map((step, index) => (
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
              <select
                className="form-select"
                aria-label="Select Hours"
                name="hours"
                value={recipe?.cookingtime?.hours}
                onChange={handleDurationChange}
              >
                {[...Array(24).keys()].map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <span className="input-group-text">Minutes</span>
              <select
                className="form-select"
                aria-label="Select Minutes"
                name="minutes"
                value={recipe?.cookingtime?.minutes}
                onChange={handleDurationChange}
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
                    value="Easy"
                    checked={recipe?.difficulty === "Easy"}
                    onChange={handleInputChange}
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
                    checked={recipe?.difficulty === "Medium"}
                    onChange={handleInputChange}
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
                    checked={recipe?.difficulty === "Hard"}
                    onChange={handleInputChange}
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
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {/* Update Recipe*/}
            <div
              className="btn-group w-100 shadow rounded"
              role="group"
              aria-label="Basic example"
            >
              <button
                type="submit"
                className="btn btn-success"
                disabled={
                  !recipe.title.trim() ||
                  !recipe.description.trim() ||
                  recipe.ingredients.length === 0 ||
                  recipe.steps.length === 0 ||
                  !recipe.image
                }
              >
                Update Recipe
              </button>

              <NavLink
                to={`/viewrecipe/${recipeId}`}
                type="button"
                className="btn btn-warning"
              >
                Cancel
              </NavLink>
            </div>
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

export default checkAuth(Editrecipe);
