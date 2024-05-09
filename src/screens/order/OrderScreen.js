import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
// import Modal from "react-modal";

/* Components */

import HeaderContent from "../../components/HeaderContent";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";
import Select from "../../components/Select";
import Input from "../../components/form/Input";
import OrderViewScreen from "./OrderViewScreen ";
import { DateRangePicker } from "rsuite";

import "rsuite/dist/rsuite-rtl.css"; // Import for right-to-left layout

import "../../style/product.css";
import "../../style/confirmModal.css";
import "../../style/button.css";
import "../../style/calendar.css";

/* Actions */
import {
  listOrders,
  updateOrderToPaid,
  listOrdersByStatus,
} from "../../actions/orderActions";
import Checkbox from "../../components/form/Checkbox";
import CustomCheckBox from "../../components/form/CustomCheckbox";

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
  const [status, setStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState(5);
  const [currentStatus, setCurrentStatus] = useState(5);
  const [userType, setUserType] = useState("2");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [newStartDate, setNewStartDate] = useState(null);
  const [newEndDate, setNewEndDate] = useState(null);

  const [dateRange, setDateRange] = useState([]); // State for start and end dates

  // Handle date range selection and validation
  const handleChange = (range) => {
    // Check if both start and end dates are cleared by the user
    if (!range || range.length === 0) {

      setDateRange([]); // Set state to empty array when selection is cleared
      return; // Prevent further processing if selection is cleared
    }
    setDateRange(range);
  };

  const [startDate, endDate] = dateRange;

  const orderStatusItems = [
    { id: 5, name: "All" },
    { id: 0, name: "Pending" },
    { id: 1, name: "Paid" },
    { id: 2, name: "Completed" },
    { id: 3, name: "Canceled" },
    { id: 4, name: "Shipping" },
  ];
  const userTypeItems = [
    { id: "2", name: "All" },
    { id: "0", name: "Guest" },
    { id: "1", name: "Member" },
  ];
  const openModal = (value) => {
    setStatus(value);
    setModalIsOpen(true);
  };

  const closeModal = (value) => {
    setStatus(value);
    setModalIsOpen(false);
  };

  // const isButtonDisabled = (buttonStatus) => {
  //   return currentStatus === 2 || currentStatus === 3 || currentStatus === 4 || currentStatus === buttonStatus;
  // };
  const isButtonDisabled = (buttonStatus) => {
    if (currentStatus === 2 || currentStatus === 3) {
      return true; // Disable if current status is 2 or 3
    }
    if (buttonStatus !== 2 && currentStatus === 4) {
      return true; // Disable other buttons if current status is 4
    }
    if (currentStatus === buttonStatus) {
      return true;
    }
    return false; // Otherwise, enable the button
  };

  const handleSetOrderID = (orderID, status) => {
    setOrderID(orderID);
    setCurrentStatus(status);
  };

  const formatDate =(date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedOrder = {
      id: orderID,
      status: status,
    };

    dispatch(updateOrderToPaid(updatedOrder));
    setOrderID(0);
    setOrderStatus(5);
    closeModal(0, 0);

    // if (orderStatus != null) {
    //   dispatch(
    //     listOrdersByStatus({
    //       keyword,
    //       pageNumber,
    //       delivery: false,
    //       status: orderStatus,
    //     })
    //   );
    // } else {
    dispatch(listOrders({ keyword, pageNumber, delivery: false }));
    // }
  };
  const formatMoney = (money) => {
    return money.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
  };

  const renderOrderDetail = (orderID) => {

    return <OrderViewScreen orderID={parseInt(orderID)}></OrderViewScreen>;
  };

  const renderDateRangePicker = () => {
    return (
      <div className="dates">
        <DateRangePicker
          format="yyyy-MM-dd"
          value={dateRange} // Pass the complete date range state
          onChange={handleChange}
        />
      </div>
    );
  };

  useEffect(() => {
    if (!adminInfo) {
      history.push("/login");
    }
    setOrderID(0);
    // Only dispatch listOrders if orderStatus changes to a value other than 5
    // and both startDate and endDate have valid values
    if (orderStatus !== 5 && startDate !== undefined && endDate !== undefined) {


      const newStartDate = formatDate(startDate);
      const newEndDate = formatDate(endDate);

      dispatch(
        listOrders({
          keyword,
          pageNumber,
          delivery: false,
          status: orderStatus,
          userType,
          newStartDate,
          newEndDate,
        })
      );
    }
    if (orderStatus === 5 && startDate !== undefined && endDate !== undefined) {

      const newStartDate = formatDate(startDate);
      const newEndDate = formatDate(endDate);
      dispatch(
        listOrders({
          keyword,
          pageNumber,
          delivery: false,
          status: orderStatus,
          userType,
          newStartDate,
          newEndDate,
        })
      );
    } 
    if(startDate === undefined && endDate === undefined){


       dispatch(
         listOrders({
           keyword,
           pageNumber,
           delivery: false,
           status: orderStatus,
           userType: userType,
         })
       );
 
    }
  }, [
    dispatch,
    history,
    adminInfo,
    pageNumber,
    keyword,
    orderStatus,
    userType,
    startDate,
    endDate,
  ]);


  
  const renderModal = () => {
    return (
      <>
        {modalIsOpen && (
          <div id="modal" className="registration-form">
            <form onSubmit={handleSubmit}>
              <span>
                <h3 className="text-center mb-4">Change order status </h3>
                <p className="text-center mb-4">
                  Do you want to change order status ?
                </p>
              </span>

              <div className="form-group d-flex justify-content-around mt-5">
                <div
                  onClick={() => closeModal(0, 0)}
                  className="btn  btn-light  border border-black"
                  style={{ width: "40%" }}
                >
                  Cancel
                </div>
                <button
                  type="submit"
                  className="btn  btn-secondary  border border-black"
                  style={{ width: "40%" }}
                >
                  Submit
                </button>
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
          <th className="border-right border-bottom-0 border-left-0 border-top-0 "></th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Customer name
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Phone
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Total
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Created date
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Order type
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Order status
          </th>
          {/* <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Action
          </th> */}
        </tr>
      </thead>
      <tbody>
        {orders?.length === 0 && "No data"}
        {orders?.length > 0 &&
          orders?.map((order) => (
            <tr key={order?.id}>
              <td className="py-2 border-right border border-light text-center pl-1">
                <input
                  id="option-disabled"
                  type="radio"
                  name="Order"
                  value={order?.id}
                  onClick={() => handleSetOrderID(order?.id, order?.status)}
                  style={{ cursor: "pointer" }}
                  className=" border-gray-200 focus:ring-2 focus:ring-blue-300"
                  aria-labelledby="option-disabled"
                  aria-describedby="option-disabled"
                />
              </td>
              <td className="py-2 border-right border border-light">
                {order?.user ? (
                  order?.user?.name
                ) : (
                  <span className="" style={{ textDecoration: "line-through" }}>
                    Deleted User
                  </span>
                )}
              </td>
              <td className="py-2 border-right border border-light">
                {order?.user ? (
                  order?.user?.phone
                ) : (
                  <span className="" style={{ textDecoration: "line-through" }}>
                    Deleted User
                  </span>
                )}
              </td>
              <td className="d-none d-sm-table-cell  py-2 border-right border border-light">
                {formatMoney(parseInt(order?.total_amount))}
              </td>

              <td className="py-2 border-right border border-light">
                {new Date(order?.createdAt).toLocaleString()}
              </td>

              <td className="py-2 border-right border border-light">
                {order?.user?.userType === "1" ? (
                  <span>Member</span>
                ) : (
                  <span>Guest</span>
                )}
              </td>

              <td className="py-2 border-right border border-light ">
                {order?.status === 0 ? (
                  <p>
                    <strong>Pending</strong>
                  </p>
                ) : order?.status === 1 ? (
                  <span>
                    <strong>Paid</strong>
                  </span>
                ) : order?.status === 2 ? (
                  <span>
                    <strong>Completed</strong>
                  </span>
                ) : order?.status === 4 ? (
                  <span>
                    <strong>Shipping</strong>
                  </span>
                ) : (
                  <span>
                    <strong>Canceled</strong>
                  </span>
                )}
                {/* <button
                    type="button"
                    className={`btn btn-outline-secondary dropdown-toggle d-flex align-items-center justify-content-center  `}
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {order?.status === 0 ? (
                      <span>
                        <strong>Pending</strong>
                      </span>
                    ) : order?.status === 1 ? (
                      <span>
                        <strong>Paid</strong>
                      </span>
                    ) : order?.status === 2 ? (
                      <span>
                        <strong>Completed</strong>
                      </span>
                    ) : (
                      <span>
                        <strong>Canceled</strong>
                      </span>
                    )}
                  </button>
                  <div className="dropdown-menu dropdown-menu-right w-100">
                    <button
                      value={0}
                      className="dropdown-item"
                      type="button"
                      onClick={() => openModal(0, order?.id)}
                    >
                      Pending
                    </button>
                    <button
                      value={1}
                      className="dropdown-item"
                      type="button"
                      onClick={() => openModal(1, order?.id)}
                    >
                      Paid
                    </button>
                    <button
                      value={2}
                      className="dropdown-item"
                      type="button"
                      onClick={() => openModal(2, order?.id)}
                    >
                      Completed
                    </button>
                    <button
                      value={3}
                      className="dropdown-item"
                      type="button"
                      onClick={() => openModal(3, order?.id)}
                    >
                      Canceled
                    </button>
                  </div> */}
              </td>
              {/* <td className="py-2 border-right border border-light  ">
                <Link to={`/order/${order?.id}/view`}>
                  <button className="btn  btn-light text-sm border border-black ">
                    View
                  </button>
                </Link>
              </td> */}
            </tr>
          ))}
      </tbody>
    </table>
  );

  const renderOrders = () => (
    <>
      <div className="card ">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center border-bottom mb-4">
            <h3 className="card-title my-2">All orders</h3>
            {orderID === 0 ? (
              <div className="d-flex col-5 justify-content-end">
                <button
                  disabled
                  className="btn  btn-light text-sm border border-black mr-4 w-25"
                >
                  Pending
                </button>
                <button
                  disabled
                  className="btn  btn-light text-sm border border-black mr-4 w-25"
                >
                  Paid
                </button>
                <button
                  disabled
                  className="btn  btn-light text-sm border border-black mr-4 w-25"
                >
                  Shipping
                </button>
                <button
                  disabled
                  className="btn  btn-light text-sm border border-black mr-4 w-25"
                >
                  Completed
                </button>
                {/* <button disabled className="btn  btn-light text-sm border border-black mr-4 w-25">Canceled</button> */}
              </div>
            ) : (
              <div className="d-flex col-5">
                <button
                  onClick={() => openModal(0, orderID)}
                  className="btn btn-light text-sm border border-black mr-4 w-25"
                  disabled={isButtonDisabled(0)}
                >
                  Pending
                </button>
                <button
                  onClick={() => openModal(1, orderID)}
                  className="btn btn-light text-sm border border-black mr-4 w-25"
                  disabled={isButtonDisabled(1)}
                >
                  Paid
                </button>
                <button
                  onClick={() => openModal(4, orderID)}
                  className="btn btn-light text-sm border border-black mr-4 w-25"
                  disabled={isButtonDisabled(4)}
                >
                  Shipping
                </button>
                <button
                  onClick={() => openModal(2, orderID)}
                  className="btn btn-light text-sm border border-black mr-4 w-25"
                  disabled={isButtonDisabled(2)}
                >
                  Completed
                </button>

                {/* <button onClick={() => openModal(3, orderID)} className="btn btn-light text-sm border border-black mr-4 w-25" disabled={isButtonDisabled(3)}>Canceled</button> */}
              </div>
            )}
          </div>
          <div>
            <div className="d-flex">
              <div style={{ height: 90, marginRight: 30, width: 300 }}>
                <p>Order Status</p>
                <Select
                  data={orderStatus}
                  setData={setOrderStatus}
                  items={orderStatusItems}
                />
              </div>
              <div style={{ height: 90, marginRight: 30, width: 300 }}>
                <p>Order Type</p>
                <Select
                  data={userType}
                  setData={setUserType}
                  items={userTypeItems}
                />
              </div>
              <div style={{ height: 90, marginRight: 30, width: 300 }}>
                <p>Order Date</p>
                {renderDateRangePicker()}
              </div>
              <div className="card-tools">
                <p>Username</p>
                <Search
                  placeholder={"Search by customer name, phone..."}
                  keyword={keyword}
                  setKeyword={setKeyword}
                  setPage={setPageNumber}
                />
              </div>
            </div>
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
          <div className="row mb-2">
            <div className="col-12">{renderOrders()}</div>
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
      </section>
    </>
  );
};

export default OrderScreen;
