import React, { useCallback, useEffect, useState } from "react";
import checkAuth from "../auth/checkAuth";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../../store/authSlice";
import axios from "axios";
import Nav from "../Nav";
import Footer from "../Footer";
import Pagination from "./Pagination";
import Profilecard from "./Profilecard";
import Recipecard from "./Recipecard";
import Header from "./Header";
import headerPhoto from "./images/ProfileHeader.jpg";
import { useNavigate } from "react-router-dom";

function Profile() {
  const user = useSelector((store) => store.auth.user);
  const [recipes, setRecipes] = useState([]);
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user?.token) {
      return;
    }
    window.scrollTo(0, 0);
    // Fetch recipes
    axios
      .get(`http://localhost:4000/api/userrecipes`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          page: currentPage,
          limit: 6, // Recipes per page
        },
      })
      .then((response) => {
        setRecipes(response.data.recipes);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          console.error("Unauthorized: Token has expired or is invalid");
          setRecipes([]);
          setUserData({});
          dispatch(removeUser());
          navigate("/login");
        } else {
          console.error("Error fetching recipes:", error);
        }
      });

    // Fetch user data
    axios
      .get(`http://localhost:4000/api/profile`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [currentPage, dispatch, navigate, user?.token]);

  const onRecipeDelete = useCallback(
    (updatedRecipes) => {
      setRecipes(updatedRecipes);
    },
    [setRecipes]
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const loggedInUser = userData?.name || "";
  const loggedInEmail = userData?.email;
  const loggedInUserId = userData?.id || "";

  return (
    <div className="container pb-5 pt-5 d-flex flex-column min-vh-100">
      <Nav />
      <Header
        headerText={loggedInUser ? `${loggedInUser}'s Profile` : "Profile"}
        headerSubText={`Share Your Flavor, Inspire the World! Add Your Favorite Recipes
            Today!`}
        headerPhoto={headerPhoto}
      />
      <Profilecard loggedInUser={loggedInUser} loggedInEmail={loggedInEmail} />
      <div className="container bg-dark shadow rounded mt-5 p-5">
        <h1 className="display-4 text-light">My Recipies</h1>
        {recipes.length === 0 ? (
          <p className="text-light">You haven't added any recipes yet.</p>
        ) : (
          <Recipecard
            loggedInUserId={loggedInUserId}
            recipes={recipes}
            onRecipeDelete={onRecipeDelete}
          />
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <Footer />
    </div>
  );
}

export default checkAuth(Profile);
