import classes from "./ProfileForm.module.css";
import { useRef, useContext, useState } from "react";
import authContext from "../../store/auth-context";

const ProfileForm = () => {
  const passRef = useRef();
  const ctx = useContext(authContext);
  const [success, setSuccess] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();

    const newpass = passRef.current.value;

    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCDnUPZ7ajDlX4Q65RhSKrNMnGh3anOf48";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken: ctx.idToken,
        password: newpass,
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
        setSuccess(true);
        passRef.current.value = "";
      })
      .catch((error) => alert(error));
  };
  return (
    <>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="new-password">New Password</label>
          <input type="password" id="new-password" ref={passRef} />
        </div>
        <div className={classes.action}>
          <button>Change Password</button>
        </div>
        {success && (
          <div className={classes.success}>
            Your password was changed successfully!
          </div>
        )}
      </form>
    </>
  );
};

export default ProfileForm;
