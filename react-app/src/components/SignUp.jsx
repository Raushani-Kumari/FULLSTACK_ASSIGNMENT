import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../utils/authentication";
import UserContext from "../context/userContext";



function SignUp() {
//   const usercontext = useContext(UserContext);

  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const [fnameerror, setFNameError] = useState("");
  const [lnameerror, setLNameError] = useState("");
  const [phoneerror, setPhoneError] = useState("");
  const [emailerror, setEmailError] = useState("");
  const [passworderror, setPasswordError] = useState("");
  const [confirmpassworderror, setConfirmPasswordError] = useState("");
  const [confirmpasswordsuccess, setConfirmPasswordSuccess] = useState("");
  const [signuperror, setSignupError] = useState("");

  const [isauthenticated, setIsAuthenticated] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const navigate = useNavigate();

  function handleFName(event) {
    const firstname = event.target.value;
    setFName(firstname);

    var fname_regx = "^[A-Z](?=.{1,40}$)[a-zA-Z]+(?:[-'s][a-zA-Z]+)*$";
    if (firstname.match(fname_regx)) {
      setFNameError("");
    } else {
      setFNameError("Please enter your first name");
    }
  }

  function handleLName(event) {
    const lastname = event.target.value;
    setLName(lastname);

    var lname_regx = "^(?=.{1,40}$)[a-zA-Z]+(?:[-'s][a-zA-Z]+)*$";
    if (lastname.match(lname_regx)) {
      setLNameError("");
    } else if (lastname.length < 1) {
      setLNameError("");
    } else {
      setLNameError("Please enter your valid last name");
    }
  }


  function handlePhone(event) {
    const phone_no = event.target.value;
    setPhone(phone_no);

    if (phone_no.length > 10 || phone_no.length < 10) {
      setPhoneError("Check your phone number again");
    } else {
      setPhoneError("");
    }
  }

  function handleEmail(event) {
    const new_mail = event.target.value;
    setEmail(new_mail);

    var email_regx = "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{3,3})$";

    if (new_mail.match(email_regx)) {
      setEmailError("");
    } else {
      setEmailError("Please enter valid email");
    }
  }

  function handlePassword(event) {
    const pass = event.target.value;
    setPassword(pass);

    var lowerCase = /[a-z]/g;
    var upperCase = /[A-Z]/g;
    var numbers = /[0-9]/g;

    if (!pass.match(lowerCase)) {
      setPasswordError("Password should contain lowercase letters!");
    } else if (!pass.match(upperCase)) {
      setPasswordError("Password should contain uppercase letters!");
    } else if (!pass.match(numbers)) {
      setPasswordError("Password should contain numbers also!");
    } else if (pass.length < 6) {
      setPasswordError("Password should contain atleast 6 characters!");
    } else {
      setPasswordError("");
    }
  }

  const checkValidation = (e) => {
    const reppassword = e.target.value;
    setConfirmPassword(reppassword);

    if (password !== reppassword) {
      setConfirmPasswordError("Confirm Passwoord should match with Password");
    } else {
      setConfirmPasswordError("");
    }
    if (password === reppassword) {
      setConfirmPasswordSuccess("Password matched");
    }
  };

  const sendWelcomeEmail = (email) => {
    // Mock notification system (e.g., alert)
    alert(`Welcome email sent to ${email}`);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!fname || !phone || !email || !password || !confirmpassword) {
        return;
      } else {
        const response = await registerUser(email, password, {
          first_name: fname,
          last_name: lname,
          phone,
        });

        console.log("response is: ", response);
        if (response.error) {
          throw response.error;
        }

        setIsAuthenticated(true);
        console.log(signuperror);

        if (response.jwt) {
          sessionStorage.setItem("token", response.jwt);

          UserContext.setUser({
            ...response.user,
            jwt: response.jwt,
            isauthenticated,
          });
        sendWelcomeEmail(email);
        setIsSignedUp(true);
        navigate("/postlist");
        setSignupError(" ");
      }
    }
  }catch (error) {
      setIsAuthenticated(false);
      setSignupError(error.message);

      console.log(error.message);
    }
  };

  return (
    <>
    {!isSignedUp ? (
      <div className="container mt-2" id="signup">
        <h1 className="text-center h1-font fw-bold">Sign Up</h1>
        <p className="text-center fw-bold">Please fill in the details</p>
        <hr />
        <div>
          <form className="novalidate" onSubmit={handleSignupSubmit}>
            <div className="row mb-1">
              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="form3Example1">
                    First name<label style={{ color: "red" }}>*</label>
                  </label>
                  <input
                    type="text"
                    value={fname}
                    onChange={handleFName}
                    id="form3Example1"
                    className="form-control"
                    required
                  />
                </div>
                {fnameerror && <div style={{ color: "red" }}>{fnameerror}</div>}
              </div>

              <div className="col">
                <div className="form-outline">
                  <label className="form-label" htmlFor="form3Example2">
                    Last name <label htmlFor="">*</label>
                  </label>
                  <input
                    type="text"
                    value={lname}
                    onChange={handleLName}
                    id="form3Example2"
                    className="form-control"
                  />
                </div>
                {lnameerror && <div style={{ color: "red" }}>{lnameerror}</div>}
              </div>
            </div>

            <div className="form-outline mb-2">
              <label className="form-label" htmlFor="form3Example4">
                Phone Number<label style={{ color: "red" }}>*</label>
              </label>
              <input
                type="number"
                value={phone}
                onChange={handlePhone}
                id="form3Example4"
                className="form-control"
                required
              />
            </div>
            {phoneerror && <div style={{ color: "red" }}>{phoneerror}</div>}

            <div className="form-outline mb-2">
              <label className="form-label" htmlFor="form3Example5">
                Email<label style={{ color: "red" }}>*</label>
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmail}
                id="form3Example5"
                className="form-control"
                required
              />
            </div>
            {emailerror && <div style={{ color: "red" }}>{emailerror}</div>}

            <div className="form-outline mb-2">
              <label className="form-label" htmlFor="form3Example6">
                Password<label style={{ color: "red" }}>*</label>
              </label>
              <input
                type="password"
                value={password}
                onChange={handlePassword}
                id="form3Example6"
                className="form-control"
                required
              />
            </div>
            {passworderror && (
              <div style={{ color: "red" }}>{passworderror}</div>
            )}

            <div className="form-outline mb-2  ">
              <label className="form-label" htmlFor="form3Example7">
                Confirm Password<label style={{ color: "red" }}>*</label>
              </label>
              <input
                type="password"
                onChange={(e) => {
                  checkValidation(e);
                }}
                id="form3Example7"
                className="form-control"
                required
              />
            </div>

            {confirmpassworderror && (
              <div style={{ color: "red" }}>{confirmpassworderror}</div>
            )}
            {confirmpasswordsuccess && (
              <div style={{ color: "green" }}>{confirmpasswordsuccess}</div>
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
              Sign up
            </button>
            {signuperror && <div style={{ color: "red" }}>{signuperror}</div>}
            <p className="text-center mt-2">
              Already a member? <Link to="/login">Signin</Link>
            </p>
          </form>
        </div>
      </div>
    ): (
        <div>
        <h2>Thank you for signing up!</h2>
        <p>A welcome email has been sent to {email}.</p>
      </div>
    )}
    </>
  );
}
export default SignUp;
