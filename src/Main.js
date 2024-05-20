import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";

/* SCREENS */
import AllOrderScreen from "./screens/order/AllOrderScreen";
import MyOrderScreen from "./screens/order/MyOrderScreen";
import DeliveryScreen from "./screens/order/DeliveryScreen";
import OrderCreateScreen from "./screens/order/OrderCreateScreen";
import OrderViewScreen from "./screens/order/OrderViewScreen ";
import ActiveOrdersScreen from "./screens/order/ActiveOrdersScreen";
import OrderEditScreen from "./screens/order/OrderEditScreen";

import TableScreen from "./screens/table/TableScreen";
import TableEditScreen from "./screens/table/TableEditScreen";

import ProductScreen from "./screens/product/ProductScreen";
import ProductCreateScreen from "./screens/product/ProductCreateScreen";
import ProductEditScreen from "./screens/product/ProductEditScreen";

import ClientScreen from "./screens/client/ClientScreen";
import ClientEditScreen from "./screens/client/ClientEditScreen";

import CategoryScreen from "./screens/category/CategoryScreen";
import CategoryEditScreen from "./screens/category/CategoryEditScreen";

import UserScreen from "./screens/user/UserScreen";
import UserEditScreen from "./screens/user/UserEditScreen";
import UserOrderListScreen from "./screens/user/UserListOrders";
import ProfileScreen from "./screens/user/ProfileScreen";

import StoreScreen from "./screens/store/StoreScreen";
import StoreEditScreen from "./screens/store/StoreEditScreen";
import DashboardScreen from "./screens/DashboardScreen";
import PrivateRoute from "./auth/PrivateRoute";
import NotFoundScreen from "./screens/NotFoundScreen";
import AdminRoute from "./auth/AdminRoute";
import NotAuthorizedScreen from "./screens/NotAuthorizedScreen";

const Main = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { adminInfo } = userLogin;

  return (
    <>
      <Header />
      <Menu />

      <div className="content-wrapper">
        <Switch>
          <PrivateRoute path="/active" exact component={ActiveOrdersScreen} />
          <PrivateRoute path="/profile" component={ProfileScreen} />
          <PrivateRoute path="/user/:id/edit" component={UserEditScreen} />

          <PrivateRoute path="/user" component={UserScreen} />

          <PrivateRoute
            path="/list/:id/orders"
            component={UserOrderListScreen}
          />

          <PrivateRoute
            path="/category/:id/edit"
            component={CategoryEditScreen}
          />
          <PrivateRoute path="/category" component={CategoryScreen} />

          {/* <PrivateRoute path="/delivery" component={DeliveryScreen} />

                    <PrivateRoute
                        path="/client/:id/edit"
                        component={ClientEditScreen}
                    />

                    <PrivateRoute path="/client" component={ClientScreen} /> */}

          <PrivateRoute
            path="/product/:id/edit"
            component={ProductEditScreen}
          />
          <PrivateRoute
            path="/product/create"
            component={ProductCreateScreen}
          />
          <PrivateRoute path="/product" component={ProductScreen} />

          {/* <PrivateRoute
                        path="/table/:id/edit"
                        component={TableEditScreen}
                    />
                    <PrivateRoute path="/table" component={TableScreen} /> */}

          <PrivateRoute
            path="/order/create/:id/table"
            component={OrderCreateScreen}
          />

          <PrivateRoute
            path="/order/:id/edit"
            component={OrderEditScreen}
            exact
          />

          <PrivateRoute
            path="/order/:id/view"
            component={OrderViewScreen}
            exact
          />
          <PrivateRoute path="/order/create" component={OrderCreateScreen} />
          <PrivateRoute path="/all-order" component={AllOrderScreen} />
          <PrivateRoute path="/my-order" component={MyOrderScreen} />
          <PrivateRoute
            path="/not-authorized"
            component={NotAuthorizedScreen}
          />
          <PrivateRoute path="/store/list" component={StoreScreen} />
          <PrivateRoute
            path="/store/:id/edit"
            component={StoreEditScreen}
            exact
          />
          <PrivateRoute path="/" component={DashboardScreen} />

          <Route component={NotFoundScreen} />
        </Switch>
      </div>
      <Footer />
    </>
  );
};

export default Main;
