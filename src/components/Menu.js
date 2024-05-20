import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const Menu = ({ history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { adminInfo } = userLogin;

  useEffect(() => {
    if (!adminInfo) {
      redirectTo();
    }
  }, [dispatch, adminInfo]);

  const redirectTo = () => {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: { referrer: "/" },
        }}
      />
    );
  };

  return (
    <aside className="main-sidebar min-vh-100 h-100 d-flex justify-content-center  sidebar-dark-primary elevation-4">
      {/* Brand Logo */}

      {/* Sidebar */}
      <div className="sidebar w-100  ">
        {/* Sidebar user panel (optional) */}
        <Link
          to={"/dashboard"}
          className="brand-link pb-3 d-flex justify-content-center  "
        >
          <img
            src="/logo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
        </Link>

        {/* Sidebar Menu */}
        <nav className="">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-header"></li>

            <li className="nav-header">MANAGEMENT</li>

            {/**Order */}
            <li className="nav-item has-treeview ">
              <Link className="nav-link ">
                <i className="nav-icon far fa-clipboard" />
                <p>
                  Orders
                  <i className="fas fa-angle-left right"></i>
                </p>
              </Link>

              <span className="brand-text font-weight-light "></span>
              <ul className=" nav-treeview ">
                <li className="nav-item pl-4">
                  <Link to="/all-order" className="nav-link">
                    <i className="fa fa-shopping-basket nav-icon"></i>
                    <p>All Orders</p>
                  </Link>
                </li>

                <li className="nav-item pl-4">
                  <Link to="/my-order" className="nav-link">
                    <i className="fa fa-hourglass-half  nav-icon"></i>
                    <p>My Orders</p>
                  </Link>
                </li>
              </ul>
            </li>
            <div class="dropdown-divider"></div>
            <li className="nav-item ">
              <Link to="/user" className="nav-link">
                <i className="nav-icon fas fa-users" /> <p> Users</p>
              </Link>
            </li>
            <div class="dropdown-divider"></div>
            <li className="nav-item">
              <Link to="/category" className="nav-link">
                <i className="nav-icon fas fa-list-alt" /> <p> Categories</p>
              </Link>
            </li>
            <div class="dropdown-divider"></div>
            <li className="nav-item">
              <Link to="/product" className="nav-link">
                <i className="nav-icon fas fa-hamburger" /> <p> Products</p>
              </Link>
            </li>

            {/* <li className="nav-item">
              <Link to="/store/list" className="nav-link">
                <i className="nav-icon fas fa-store" /> <p> Store</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt" /> <p> Report</p>
              </Link>
            </li> */}
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  );
};

export default Menu;
