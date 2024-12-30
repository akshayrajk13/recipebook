import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "../Nav";
import Footer from "../Footer";
import axios from "axios";
import Header from "./Header";
import headerPhoto from "./images/Header.jpg";
import { useSelector } from "react-redux";
import checkAuth from "../auth/checkAuth";

function Viewrecipe() {
  const user = useSelector((store) => store.auth.user);
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
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

  return (
    <div className="container pb-5 pt-5 d-flex flex-column min-vh-100">
      <Nav />
      <Header
        headerText={`Welcome to Recipe Book!`}
        headerSubText={`Share Your Flavor, Inspire the World! Add Your Favorite Recipes
        Today!`}
        headerPhoto={headerPhoto}
      />
      <div className="w-100 pt-5">
        <div className="card text-bg-dark mb-5 border-0 shadow rounded">
          <img
            src={recipe?.image}
            className="card-img"
            alt="Recipe"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
          <div
            className="card-img-overlay"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <h1 className="card-title text-white p-3">{recipe?.title}</h1>
            <p className="card-text text-white p-3">
              <strong>Cooking Time:</strong> {recipe?.cookingtime?.hours}{" "}
              hour(s) and {recipe?.cookingtime?.minutes} minute(s)
            </p>
            <p className="card-text text-white p-3">
              <i
                className={`bi bi-speedometer2 ${
                  recipe?.difficulty === "Hard"
                    ? "text-danger"
                    : recipe?.difficulty === "Medium"
                    ? "text-warning"
                    : "text-success"
                }`}
              ></i>
              <span>&ensp;{recipe?.difficulty}</span>
            </p>
            <p className="card-text text-white p-3">
              <i className="bi bi-eye"></i>
              <span>&ensp;{recipe?.viewcount}</span>
            </p>
          </div>
        </div>
        <div className="container bg-dark shadow rounded mt-5 mb-5 p-5">
          {/* Description */}
          <div className="mb-5">
            <h4 className="text-light">Description:</h4>
            <p className="lead text-light">{recipe?.description}</p>
          </div>
          {/* Ingredients */}
          <div className="mb-5">
            <h4 className="text-light">Ingredients:</h4>
            <ol className="list-group list-group-numbered">
              {recipe?.ingredients?.map((ing, index) => (
                <li key={index} className="list-group-item">
                  {`${ing.ingredientname} - ${ing.quantity} ${ing.unit}`}
                </li>
              ))}
            </ol>
          </div>
          {/* Steps */}
          <div className="mb-5 pb-5">
            <h4 className="text-light">Steps:</h4>
            <ol className="list-group list-group-numbered">
              {recipe?.steps?.map((step, index) => (
                <li key={index} className="list-group-item">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger mt-3 text-center p-2 rounded">
          {error}
        </div>
      )}
      <Footer />
    </div>
  );
}

export default checkAuth(Viewrecipe);
