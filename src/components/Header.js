import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";


const Header = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { adminInfo } = userLogin;
  const dispatch = useDispatch();
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="/" role="button">
            <i className="fas fa-bars" />
          </a>
        </li>
      </ul>

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <div className="user-panel  mr-3 d-flex pb-2 align-items-center">
            <div className="d-flex mr-4">
              <div className="image">
                <img
                  // src={adminInfo ? adminInfo.image : "/avatar.png"}
                  src="https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                  className="img-circle elevation-2"
                  alt="User"
                />
              </div>
              <div className="info">
                <p>
                {adminInfo ? adminInfo.username : ""}
                </p>
                
              </div>
            </div>

            <div className="w-fit d-flex justify-content-end ">
              <span
                style={{ cursor: "pointer" }}
                onClick={(e) => handleLogout(e)}
                data-widget="control-sidebar"
                data-slide="true"
                role="button"
              >
                <i className="fas fa-power-off"></i> Logout
              </span>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
