import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/userActions";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom"

const LoginScreen = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();


    //get user from state
    const userLogin = useSelector((state) => state.userLogin);
    const { adminInfo, error, loading } = userLogin;

    useEffect(() => {
        //if user is logged
        if (adminInfo) {
            history.push("/order");
        }
    }, [history, adminInfo]);


  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
    console.log(error)
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
            <p className="login-box-msg">Sign in to start your session</p>
            {loading && <Loader variable={loading} />}
            {error && <Message message={error} color={"danger"} />}
            <form onSubmit={submitHandler}>
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
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>

              <div className="row justify-content-around">
                 
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                </div>
              </div>
              <div className="row justify-content-around mt-4">
                <h6>Are you <Link to="/forgot_password"><span className="text-primary " style={{cursor:"pointer"}}> Forgot password </span></Link>  ? </h6>
              </div>
              <br />
              {/* <div className="alert alert-info alert-dismissible">
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-hidden="true"
                ></button>
                <h5>
                  <i className="icon fas fa-info" /> Test Users
                </h5>
                <p>admin@example.com</p>
                <p>user@example.com</p>
                <hr />
                <p>pass: 123456</p>
              </div> */}
            </form>
            <div></div>
          </div>
          {/* /.login-card-body */}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
