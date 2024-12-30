import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const checkAuth = (Component) => {
  function Wrapper(props) {
    const user = useSelector((store) => store.auth.user);
    const navigate = useNavigate();
    useEffect(() => {
      if (!user && window.localStorage.getItem("user") === null) {
        navigate("/login");
      }
    }, [navigate, user]);
    return <Component {...props} />;
  }
  return Wrapper;
};

export default checkAuth;
