import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Modal from "react-modal";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";

import "../../style/product.css";
import "../../style/confirmModal.css";
import "../../style/button.css";

/* Actions */
import {
  listOrders,
  updateOrderToPaid,
  listOrdersByStatus,
} from "../../actions/orderActions";

const OrderScreen = ({ history }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusParams = queryParams.get("status");
  const [orderID, setOrderID] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [keyword, setKeyword] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { adminInfo } = userLogin;

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders, page, pages } = orderList;
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = (value, orderID) => {
    setStatus(value);
    setModalIsOpen(true);
    setOrderID(orderID);
  };

  const closeModal = (value, orderID) => {
    setStatus(value);
    setModalIsOpen(false);
    setOrderID(orderID);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedOrder = {
      id: orderID,
      status: status,
    };
    dispatch(updateOrderToPaid(updatedOrder));
    closeModal(0, 0);

    if (statusParams != null) {
      dispatch(
        listOrdersByStatus({
          keyword,
          pageNumber,
          delivery: false,
          status: statusParams,
        })
      );
    } else {
      dispatch(listOrders({ keyword, pageNumber, delivery: false }));
    }
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

    if (statusParams != null) {
      dispatch(
        listOrdersByStatus({
          keyword,
          pageNumber,
          delivery: false,
          status: statusParams,
        })
      );
    } else {
      dispatch(listOrders({ keyword, pageNumber, delivery: false }));
    }
  }, [dispatch, history, adminInfo, pageNumber, keyword]);

  const handleSearch = (event) => {
    console.log("Searching...", event.target.value);
    // Add your search logic here
  };

  const renderModal = () => {
    return (
      <>
        {modalIsOpen && (
          <div id="modal" className="registration-form">
            <form style={{ position: "relative" }} onSubmit={handleSubmit}>
              <img
                onClick={() => closeModal(0, 0)}
                style={{
                  width: 20,
                  height: 20,
                  cursor: "pointer",
                  position: "absolute",
                  right: 0,
                  top: 0,
                  margin: 25,
                }}
                src={"/close.png"}
                alt="Close button"
              />
              <span>
                <h3 className="text-center mb-4">Change order status </h3>
                <p className="text-center mb-4">
                  Do you want to change order satus ?
                </p>
              </span>

              <div className="form-group d-flex justify-content-around mt-5">
                <button
                  type="submit"
                  className="custom_submit_btn"
                  style={{ width: "40%" }}
                >
                  Submit
                </button>
                <div
                  onClick={() => closeModal(0, 0)}
                  className="custom_delete_btn"
                  style={{ width: "40%" }}
                >
                  Cancel
                </div>
              </div>
            </form>
          </div>
        )}
      </>
    );
  };

  const renderTable = () => (
    <table className="table table-hover text-nowrap">
      <thead>
        <tr className="header_table">
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
          <th className="border-right border-bottom-0 border-left-0 border-top-0 "></th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="py-4 border-right border border-light">
              {order.user ? order.user.name : ""}
            </td>
            <td className="py-4 border-right border border-light">
              {order.user ? order.user.phone : ""}
            </td>

            <td className="py-4 border-right border border-light d-flex justify-content-center">
              <div class="btn-group w-75">
                <button
                  type="button"
                  className={`btn btn-outline-secondary dropdown-toggle d-flex align-items-center justify-content-center  `}
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {order.status === 0 ? (
                    <span>
                      <strong>Pending</strong>
                    </span>
                  ) : order.status === 1 ? (
                    <span>
                      <strong>Paid</strong>
                    </span>
                  ) : order.status === 2 ? (
                    <span>
                      <strong>Completed</strong>
                    </span>
                  ) : (
                    <span>
                      <strong>Canceled</strong>
                    </span>
                  )}
                </button>
                <div class="dropdown-menu dropdown-menu-right w-100">
                  <button
                    value={0}
                    class="dropdown-item"
                    type="button"
                    onClick={() => openModal(0, order.id)}
                  >
                    Pending
                  </button>
                  <button
                    value={1}
                    class="dropdown-item"
                    type="button"
                    onClick={() => openModal(1, order.id)}
                  >
                    Paid
                  </button>
                  <button
                    value={2}
                    class="dropdown-item"
                    type="button"
                    onClick={() => openModal(2, order.id)}
                  >
                    Completed
                  </button>
                  <button
                    value={3}
                    class="dropdown-item"
                    type="button"
                    onClick={() => openModal(3, order.id)}
                  >
                    Canceled
                  </button>
                </div>
              </div>
            </td>
            <td className="d-none d-sm-table-cell  py-4 border-right border border-light">
              {formatMoney(parseInt(order.total_amount))}
            </td>
            <td className="py-4 border-right border border-light">
              {order.createdAt.slice(0, 10)}
            </td>
            <td className="py-4 border-right border border-light  ">
              <Link to={`/order/${order.id}/view`}>
                <button className="btn  btn-light text-sm border border-black ">
                  View
                </button>
              </Link>
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
          <h3 className="card-title">All orders</h3>
          <div className="card-tools">
            <Search
              keyword={keyword}
              setKeyword={setKeyword}
              setPage={setPageNumber}
            />
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
      <HeaderContent name={"Orders"} />

      <section className="content">
        <div className="container-fluid">
          {renderModal()}
          <div className="row">
            <div className="col-12">
              <hr />
              {renderOrders()}
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </section>
    </>
  );
};

export default OrderScreen;
