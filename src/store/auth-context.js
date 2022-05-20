import React, { useState, useReducer } from "react";
import { useEffect } from "react";

const authContext = React.createContext({
  idToken: "",
  isLoggedIn: false,
  logIn: (token) => {},
  logOut: () => {},
});

const reducer = (prevstate, action) => {
  if (action.type === "set")
    return {
      token: action.value.token,
      exrirationTime: action.value.time,
    };
  else if (action.type === "reset")
    return {
      token: "",
      exrirationTime: 0,
    };
  else
    return {
      token: "",
      exrirationTime: 0,
    };
};
let remainTimer;

export const AuthContextProvider = (props) => {
  const [isLogIn, setIsLogin] = useState(false);
  const [token, tokenDispatch] = useReducer(reducer, {
    token: "",
    exrirationTime: 0,
  });

  const remaintimeHandler = (expirationDate) => {
    const currentTime = new Date().getTime();
    return expirationDate - currentTime;
  };

  useEffect(() => {
    const storeToken = localStorage.getItem("storeToken");
    const TokenExpTime = localStorage.getItem("storeExpToken");

    tokenDispatch({
      type: "set",
      value: {
        token: storeToken ? storeToken : "",
        time: TokenExpTime ? +TokenExpTime : 0,
      },
    });
    setIsLogin(storeToken ? true : false);
    //settimer
    if (storeToken) {
      const remainTime = remaintimeHandler(+TokenExpTime);
      remainTimer = setTimeout(logOutHandler, remainTime);
    }
  }, []);

  const logOutHandler = () => {
    setIsLogin(false);
    tokenDispatch({
      type: "reset",
    });
    clearTimeout(remainTimer);
    localStorage.removeItem("storeToken");
    localStorage.removeItem("storeExpToken");
  };

  const logInHandler = (newtoken, expirationDate) => {
    const expirationTime = new Date().getTime() + Number(expirationDate) * 1000;
    setIsLogin(true);
    tokenDispatch({
      type: "set",
      value: {
        token: newtoken,
        time: expirationTime,
      },
    });
    localStorage.setItem("storeToken", newtoken);
    localStorage.setItem("storeExpToken", +expirationTime);

    const remainTime = remaintimeHandler(expirationTime);
    remainTimer = setTimeout(logOutHandler, remainTime);
  };

  const contextValue = {
    idToken: token.token,
    isLoggedIn: isLogIn,
    logIn: logInHandler,
    logOut: logOutHandler,
  };
  return (
    <authContext.Provider value={contextValue}>
      {props.children}
    </authContext.Provider>
  );
};
export default authContext;
