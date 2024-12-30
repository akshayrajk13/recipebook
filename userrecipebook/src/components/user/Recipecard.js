import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function Recipecard({ loggedInUserId, recipes, onRecipeDelete }) {
  const user = useSelector((store) => store.auth.user);

  const [recipeToDelete, setRecipeToDelete] = useState(null);

  const deleteRecipe = () => {
    if (recipeToDelete) {
      axios
        .delete(`http://localhost:4000/api/deleterecipe`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          params: { id: recipeToDelete },
        })
        .then((response) => {
          console.log("Recipe deleted:", response.data);
          const updatedRecipes = recipes.filter(
            (recipe) => recipe.id !== recipeToDelete
          );
          onRecipeDelete(updatedRecipes);
          setRecipeToDelete(null); // Reset the state after deletion
        })
        .catch((error) => {
          console.error("Error deleting recipe:", error);
        });
    }
  };

  return (
    <>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {recipes.map((recipe) => (
          <div className="col" key={recipe.id}>
            <div className="card h-100 recipe-card">
              <img
                src={recipe.image}
                className="card-img-top recipe-card-img"
                alt={recipe.title}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title">{recipe.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    by {recipe.user}
                  </h6>
                  <p className="card-text">
                    {recipe.description.length > 50
                      ? `${recipe.description.substring(0, 30)}...`
                      : recipe.description}
                  </p>
                </div>
                <div
                  className="btn-group shadow rounded mt-3"
                  role="group"
                  aria-label="Basic example"
                >
                  <NavLink
                    to={`/viewrecipe/${recipe.id}`}
                    className="btn btn-dark"
                  >
                    View
                  </NavLink>
                  {recipe.userId === loggedInUserId && (
                    <>
                      <NavLink
                        to={`/editrecipe/${recipe.id}`}
                        type="button"
                        className="btn btn-warning"
                      >
                        Edit
                      </NavLink>
                      <button
                        type="button"
                        className="btn btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#deleteRecipeModal"
                        onClick={() => setRecipeToDelete(recipe.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-eye"></i>
                    <span>{recipe.viewcount}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i
                      className={`bi bi-speedometer2 ${
                        recipe.difficulty === "Hard"
                          ? "text-danger" // Red for hard
                          : recipe.difficulty === "Medium"
                          ? "text-warning" // Yellow for medium
                          : "text-success" // Green for easy
                      }`}
                    ></i>
                    <span>{recipe.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="deleteRecipeModal"
        tabIndex="-1"
        aria-labelledby="deleteRecipeModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteRecipeModalLabel">
                Confirm Delete
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this recipe?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={deleteRecipe}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Recipecard;
