import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import { useContext } from "react";
import authContext from "../../store/auth-context";

const MainNavigation = () => {
  const ctx = useContext(authContext);
  const history = useHistory();
  const logOutHandler = () => {
    ctx.logOut();
    history.replace("/");
  };
  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>Authentication From</div>
      </Link>
      <nav>
        <ul>
          {!ctx.isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {ctx.isLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {ctx.isLoggedIn && (
            <li>
              <button onClick={logOutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
