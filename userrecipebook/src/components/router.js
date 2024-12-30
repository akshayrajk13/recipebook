import { createBrowserRouter } from "react-router-dom";
import Login from "./auth/Login";
import App from "../App";
import Signup from "./Signup";
import Dashboard from "./user/Dashboard";
import Profile from "./user/Profile";
import Addrecipe from "./user/Addrecipe";
import Editrecipe from "./user/Editrecipe";
import Viewrecipe from "./user/Viewrecipe";

const router = createBrowserRouter([
  { path: "", element: <App /> },
  { path: "login", element: <Login /> },
  { path: "signup", element: <Signup /> },
  { path: "dashboard", element: <Dashboard /> },
  { path: "profile", element: <Profile /> },
  { path: "addrecipe", element: <Addrecipe /> },
  { path: "viewrecipe/:recipeId", element: <Viewrecipe /> },
  { path: "editrecipe/:recipeId", element: <Editrecipe /> },
]);

export default router;
