import { useState, useRef, useContext } from "react";
import authContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const ctx = useContext(authContext);
  const history = useHistory();
  const passRef = useRef();
  const emailRef = useRef();
  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const pass = passRef.current.value;

    let url;

    if (isLogin)
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDm7PGC4GrA61N3sGu-8_vNuSURtNEi8KI";
    else
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDm7PGC4GrA61N3sGu-8_vNuSURtNEi8KI";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: pass,
        returnSecureToken: true,
      }),
    })
      .then((resp) => {
        if (!resp.ok) {
          return resp.json().then((data) => {
            throw new Error(data.error.message);
          });
        } else return resp.json();
      })
      .then((data) => {
        ctx.logIn(data.idToken, data.expiresIn);
        history.replace("/profile");
      })
      .catch((error) => alert(error));
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passRef} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
