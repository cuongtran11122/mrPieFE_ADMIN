import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { forgotPassword } from "../../actions/userActions";
import IconGoBack from "../../components/IconGoBack";
import { USER_UPDATEPASSWORD_SUCCESS} from "../../constants/userConstants";

const ForgotPasswordScreen = ({ history }) => {
  
  const [email,setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  
  //get user from state
  const userForgotPassword = useSelector((state) => state.userUpdatePassword);
  const { success, error, loading } = userForgotPassword;
  //get user from state
//   const userLogin = useSelector((state) => state.userLogin);
//   const { userInfo, error, loading } = userLogin;

  useEffect(() => {
    if (success) {
        dispatch({ type: USER_UPDATEPASSWORD_SUCCESS });
        
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

    // If there are validation errors, set them in state and return
    if (Object.keys(errors).length > 0) {
        setErrors(errors);
      } else {
        setErrors({});
    }
    
    dispatch(forgotPassword(email))
    // dispatch(login(username, password));
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
                  alt="User profile "
                />
              </div>
            </div>
          </div>
          <div className="card-body login-card-body">
            <p className="login-box-msg">Forgot password service</p>
            {loading && <Loader variable={loading} />}
            {error && <Message message={error} color={"danger"} />}
            <form onSubmit={submitHandler}>
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

              <div className="row justify-content-between">
                <div className="col-4">
                  <IconGoBack history={history} />
                </div>
                <div className="col-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
            <div></div>
          </div>
          {/* /.login-card-body */}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
