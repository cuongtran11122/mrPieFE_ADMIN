import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../actions/userActions";

import Loader from "../../components/Loader";
import Message from "../../components/Message";
import IconGoBack from "../../components/IconGoBack";

import { USER_REGISTER_SUCCESS} from "../../constants/userConstants";

const RegisterScreen = ({ history }) => {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setCofirmPassword] = useState("");

  const dispatch = useDispatch();

  //get user from state
  const userRegister = useSelector((state) => state.userRegister);
  const { success, error, loading } = userRegister;

  useEffect(() => {
    // if user is register success
    if (success) {
        dispatch({ type: USER_REGISTER_SUCCESS });
        
      history.push("/login");
    }
  }, [history, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    let errors = {};

    // Email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email address";
    }

    // Password validation
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // If there are validation errors, set them in state and return
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      setErrors({});
    }

    // If no validation errors, proceed with registration
    const admin = {
      name,
      username,
      email,
      password,
    };

    dispatch(register(admin));
    // e.preventDefault();

    // const admin ={
    //     name: name,
    //     username: username,
    //     email: email,
    //     password: password
    // }
    // dispatch(register(admin));
  };

  return (
    <div
      className="row justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#cad5df" }}
    >
      <div className="login-box">
        {/* /.login-logo */}
        <div className="card">
          <div className="card-header ">
            <div className="login-logo">
              <b></b>

              <div className="text-center">
                <img
                  className="profile-user-img img-fluid img-circle"
                  src={"/logo.png"}
                  alt="User profile"
                />
              </div>
            </div>
          </div>
          <div className="card-body login-card-body">
            <p className="login-box-msg">Register to use service</p>
            {loading && <Loader variable={loading} />}
            {error && <Message message={error} color={"danger"} />}

            <form onSubmit={submitHandler}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
              </div>
              
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
              </div>

              <div className="mb-3">
              <div className="input-group ">
                <input
                  type="text"
                  className="form-control"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
              </div>
              {errors["email"] && (
                <label className="text-danger mb-1">{errors["email"]} </label>
              )}
              </div>
              
              
              <div className="mb-3">
              <div className="input-group ">
                <input
                  type="password"
                  className="form-control"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              {errors["password"] && (
                <label className="text-danger mb-1">{errors["password"]} </label>
              )}
              </div>
              
            
             <div className="mb-3">
             <div className="input-group ">
                <input
                  type="password"
                  className="form-control"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={(e) => setCofirmPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              {errors["confirmPassword"] && (
                <label className="text-danger mb-1">{errors["confirmPassword"]} </label>
              )}
             </div>

              
              

              <div className="row justify-content-between">
                <div className="col-4">
                  <IconGoBack history={history} />
                </div>
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign up
                  </button>
                </div>
              </div>
              <br />
            </form>
            <div></div>
          </div>
          {/* /.login-card-body */}
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
