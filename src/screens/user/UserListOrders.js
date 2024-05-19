import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";

import ButtonGoBack from "../../components/ButtonGoBack";

import HeaderContent from "../../components/HeaderContent";
import DataTableLoader from "../../components/loader/DataTableLoader";
// import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";

import { listOrdersUserDetail } from "../../actions/orderActions";
import OrderViewScreen from "../order/OrderViewScreen ";

import "../../style/button.css"

const UserListOrders = ({ history, match }) => {
  const userId = parseInt(match.params.id);

  const [pageNumber, setPageNumber] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [orderID, setOrderID] = useState(0);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { adminInfo } = userLogin;

  //order details state
  const orderUserList = useSelector((state) => state.orderUserList);
  const { loading, error, orders, page, pages } = orderUserList;

  const handleSetOrderID = (orderID) =>{
    setOrderID(orderID)
  }

  const renderOrderDetail = (orderID) => {

    return <OrderViewScreen orderID={parseInt(orderID)}></OrderViewScreen>;
  };

  const formatMoney = (money) => {
    return money.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
  };

  useEffect(() => {
    if (!adminInfo) {
      history.push("/login");
    }

    dispatch(
      listOrdersUserDetail({ keyword, pageNumber, delivery: false }, userId)
    );
  
  }, [dispatch, history, adminInfo, pageNumber, keyword]);

  const renderTable = () => (
    <table className="table table-hover text-nowrap">
      <thead>
        <tr className="header_table">
        <th className="border-right border-bottom-0 border-left-0 border-top-0 "></th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Customer name
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Phone
          </th>

          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Status
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Total
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Created date
          </th>
          
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="py-2 border-right border border-light text-center pl-1">
                <input
                  id="option-disabled"
                  type="radio"
                  name="Order"
                  value={order?.id}
                  onClick={() => handleSetOrderID(order?.id)}
                  style={{ cursor: "pointer" }}
                  className=" border-gray-200 focus:ring-2 focus:ring-blue-300"
                  aria-labelledby="option-disabled"
                  aria-describedby="option-disabled"
                />
              </td>
            <td className="py-2 border-right border border-light">
              {order.user ? order.user.name : ""}
            </td>
            <td className="py-2 border-right border border-light">
              {order.user ? order.user.phone : ""}
            </td>

            <td className="py-2 border-right border border-light">
              {/* {order.status}
              {/* {order.isPaid ? (
                            <h4 className="text-success">
                                <i className="fas fa-check"></i>
                            </h4>
                        ) : (
                            <h4 className="text-danger">
                                <i className="far fa-times-circle"></i>
                            </h4>
                        )} */}

              <div class="btn-group">
                <div
                  className={` `}
                >
                  {order.status === 0 ? (
                    <span>
                      <p>pending</p>
                    </span>
                  ) : order.status === 1 ? (
                    <span>
                      <p>Paid</p>
                    </span>
                  ) : order.status === 2 ? (
                    <span>
                      <p>Completed</p>
                    </span>
                  ) : (
                    <span>
                      <p>Canceled</p>
                    </span>
                  )}
                </div>
              </div>
            </td>
            <td className="d-none d-sm-table-cell  py-2 border-right border border-light">
            {formatMoney(parseInt(order.total_amount))}
            </td>
            <td className="py-2 border-right border border-light">
              {order.createdAt.slice(0, 10)}
            </td>
            
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderOrders = () => (
    <>
      <div className="card ">
        <div className="card-header">
          <div className="d-flex  d-flex justify-content-between">
          <div className="d-flex align-items-center">
          <ButtonGoBack history={history} />

          {orders.length > 0 ? (
            <h3 className="card-title ml-4">
              User orders:{" "}
              <strong>
                {orders[0].user ? orders[0].user.name : "Unknown User"}
              </strong>
            </h3>
          ) : (
            <h4 className="ml-4">User Order</h4>
          )}
          </div>
        

          {/* <div className="card-tools">
            <Search
              keyword={keyword}
              setKeyword={setKeyword}
              setPage={setPageNumber}
            />
          </div> */}
          </div>
          
          
        </div>
        {/* /.card-header */}
        <div className="card-body table-responsive p-0">
          <LoaderHandler
            loading={loading}
            error={error}
            loader={DataTableLoader()}
            render={renderTable}
          />
        </div>
        {/* /.card-body */}
      </div>

      <Pagination page={page} pages={pages} setPage={setPageNumber} />
    </>
  );

  return (
    <>
      <HeaderContent name={"User's Order"} />

      <section className="content">
        
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {/* {renderCreateButton()} */}
              <hr />
              {renderOrders()}
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
          {orderID > 0 && (<div className="row">
            <div className="col-12">
              {/* {renderOrders()} */}
              <div className="card ">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center  ">
                    <h3 className="card-title my-2">Order Detail</h3>
                  </div>
                  {
                    renderOrderDetail(orderID)
                  }
                  
                </div>

                {/* /.card-header */}
              </div>
            </div>
            {/* /.col */}
          </div>) }
        </div>
        {/* /.container-fluid */}
      </section>
    </>
  );
};

export default UserListOrders;
