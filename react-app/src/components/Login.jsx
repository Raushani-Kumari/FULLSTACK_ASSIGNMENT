import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validator";

import "../App.css";
import { loginUser } from "../utils/authentication";
import UserContext from "../context/userContext";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailerror, setEmailError] = useState("");
  const [passworderror, setPasswordError] = useState("");
  const [loginerror, setLoginError] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);

  const usercontext = useContext(UserContext);

  const navigate = useNavigate();
  function handleEmail(event) {
    const mail = event.target.value;
    setEmail(mail);
    if (validateEmail(mail)) {
      setEmailError("");
    } else {
      setEmailError("Please enter valid email");
    }
  }

  function handlePassword(event) {
    const pass = event.target.value;
    setPassword(pass);
    setPasswordError(validatePassword(pass));
  }
  const sendWelcomeEmail = (email) => {
    // Mock notification system (e.g., alert)
    alert(`Welcome email sent to ${email}`);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      // console.log("email: " , email, "password : ", password );
      // navigate("/postlist");
      // setLoginError(" ");
      
      try {
        const response = await loginUser({
          identifier: email,
          password,
        });
        

      if (response.error) {
        throw response.error;
      }

      if (response.user.accessToken) {
        sessionStorage.setItem("token", response.user.accessToken);

        usercontext.setUser({
          ...response.user,
          jwt: response.user.accessToken,
          isAuthenticated: true,
        });
       navigate("/postlist");
        setLoginError(" ");
        sendWelcomeEmail(email);
        setIsSignedUp(true);
      }
    } catch (error) {
      setLoginError(error.message);

      console.log(error);
    }
  };
  return (
    <>
    {/* <h1 className="my-4  text-center h1-font">
        LogIn
      </h1> */}
      {!isSignedUp ? ( 
      <div className="container" id="login">
      <h1 className="text-center mb-3 h1-font">LogIn</h1>
        <hr />
        <div>
          <form className="novalidate" onSubmit={handleSubmit}>
            <div className="form-outline mb-2">
              <label className="form-label" htmlFor="form3Example15">
                Email<label style={{ color: "red" }}>*</label>
              </label>
              <input
                type="email"
                value={email}
                 onChange={handleEmail}
                id="form3Example9"
                className="form-control"
                required
              />
            </div>
            { emailerror && <div style={{ color: "red" }}>{ emailerror}</div>}

            <div className="form-outline mb-2">
              <label className="form-label" htmlFor="form3Example16">
                Password<label style={{ color: "red" }}>*</label>
              </label>
              <input
                type="password"
                value={password}
                 onChange={handlePassword}
                id="form3Example10"
                className="form-control"
                required
              />
            </div>
            { passworderror && (
              <div style={{ color: "red" }}>{ passworderror}</div>
            )}
            <div class="form-check mt-1">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label class="form-check-label mb-2" for="flexCheckDefault">
                Terms and Conditions
              </label>
            </div>
            <button type="submit" className="btn btn-primary btn-block mb-2">
              Log in
            </button>
            { loginerror && <div style={{ color: "red" }}>{ loginerror}</div>}

            <p className="text-center mt-3">
              New member? <Link to="/register">Create new account</Link>
            </p>
          </form>
        </div>
      </div>
      ) : (
        <div>
            <h2>Thank you for revisiting!</h2>
            <p> A Welcome back email has been sent to {email}.</p>
          </div>
        )
        };
    </>
  );
}

export default Login;
