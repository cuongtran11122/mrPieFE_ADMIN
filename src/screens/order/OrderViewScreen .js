import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import ViewBox from "../../components/ViewBox";
import LoaderHandler from "../../components/loader/LoaderHandler";
import ModalButton from "../../components/ModalButton";
import { BigSpin } from "../../components/loader/SvgLoaders";
import Checkbox from "../../components/form/Checkbox";
import Select from "../../components/Select";

/* constants */
import { ORDER_UPDATE_RESET } from "../../constants/orderConstants";

/* actions */
import {
  listOrderDetails,
  updateOrderToPaid,
} from "../../actions/orderActions";

/* Styles */
// import { modalStyles } from "../../utils/styles";
import "../../style/button.css";

const OrderViewScreen = ({ history, match }) => {
  const orderId = parseInt(match.params.id);

  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const items = [
    { id: 0, name: "Pending" },
    { id: 1, name: "Paid" },
    { id: 2, name: "Completed" },
    // { id: 3, name: "Canceled" },
  ];

  const formatMoney = (money) => {
    return money.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
  };

  const openModal = (value) => {
    setStatus(value);
    setModalIsOpen(true);
  };

  const closeModal = (value) => {
    setStatus(value);
    setModalIsOpen(false);
  };

  const userLogin = useSelector((state) => state.userLogin);
  const { adminInfo } = userLogin;

  //order details state
  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order, user } = orderDetails;

  const [totalPrice, setTotalPrice] = useState(0);

  //order edit state
  const orderUpdate = useSelector((state) => state.orderUpdate);
  const {
    loading: loadingUpdate,
    success: successUpdate,
    errorUpdate,
  } = orderUpdate;

  // const calculateTotalPrice = () => {
  //   if (order && order.orderItems && order.orderItems.length > 0) {
  //     const total = order.orderItems.reduce((acc, item) => {
  //       return acc + item.attribute.product_price * item.quantity;
  //     }, 0);
  //     console.log(total);
  //     setTotalPrice(total);
  //   } else {
  //     setTotalPrice(0); // Set to 0 if no order items
  //   }
  // };

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: ORDER_UPDATE_RESET });
      dispatch(listOrderDetails(orderId));

      // if (order.delivery) {
      //   history.push("/delivery");
      // } else {
      //   history.push("/active");
      // }
    }
    if (order) {
      if (!order.id || order.id !== orderId) {
        dispatch(listOrderDetails(orderId));
      }

      setStatus(order.status);
    }
  }, [dispatch, history, order, orderId, successUpdate]);

  // const renderModalPay = () => (
  //   <Modal
  //     style={modalStyles}
  //     isOpen={modal}
  //     onRequestClose={() => setModal(false)}
  //   >
  //     <h2 className="text-center">Order Payment</h2>
  //     <p className="text-center">Is order already paid?.</p>
  //     <form onSubmit={handlePay}>
  //       <div className="d-flex justify-content-between align-items-center ">
  //         <Checkbox name={"status"} data={status} setData={setStatus} />
  //         <div className="d-flex justify-content-center  w-75 ">
  //           <button
  //             type="submit"
  //             className="btn  btn-secondary  border border-black w-35 mx-2 "
  //           >
  //             Submit
  //           </button>

  //           <ModalButton
  //             modal={modal}
  //             setModal={setModal}
  //             classes={"custom_delete_btn w-35"}
  //           />
  //         </div>
  //       </div>
  //     </form>
  //   </Modal>
  // );

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedOrder = {
      id: orderId,
      status: status,
    };
    dispatch(updateOrderToPaid(updatedOrder));
    closeModal(status);
    dispatch(listOrderDetails(orderId));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    let statusPay = 0;
    if (status) {
      statusPay = 1;
    }
    const updatedOrder = {
      id: orderId,
      status: statusPay,
    };
    setModal(false);
    dispatch(updateOrderToPaid(updatedOrder));
    dispatch(listOrderDetails(orderId));
  };

  // const handleEdit = (e) => {
  //   e.preventDefault();
  //   history.push(`/order/${orderId}/edit`);
  // };
  // const handleSearch = (event) => {
  //   console.log("Searching...", event.target.value);
  //   // Add your search logic here
  // };

  const renderModal = () => {
    return (
      <>
        {modalIsOpen && (
          <div id="modal" className="registration-form">
            <form style={{ position: "relative" }} onSubmit={handleSubmit}>
              <img
                onClick={() => closeModal(status)}
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
                <div style={{ height: 90 }}>
                  <Select
                    data={status}
                    setData={setStatus}
                    items={items}
                    // search={handleSearch}
                  />
                </div>
              </span>

              <div className="form-group d-flex justify-content-around mt-5">
                <button
                  type="submit"
                  className="btn  btn-secondary  border border-black"
                  style={{ width: "40%" }}
                >
                  Submit
                </button>
                <div
                  onClick={() => closeModal(status)}
                  className="btn  btn-light  border border-black"
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

  //get all order items
  const totalItems = (productsIn) => {
    return productsIn.reduce((acc, item) => acc + item.quantity, 0);
  };

  const renderCartInfo = () =>
    order &&
    order?.orderItems &&
    order?.shipment && (
      <>
        <div className="d-flex flex-column flex-md-row ">
          <div className="col-12 col-md-8">
            <div className="small-box bg-light">
              <div className="inner">
                <h4>TOTAL {formatMoney(parseInt(order?.total_amount))}</h4>
                <p>
                  {order?.orderItems.length > 0
                    ? totalItems(order?.orderItems)
                    : 0}{" "}
                  Items in Order
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <ViewBox
              title={formatMoney(parseInt(order.shipment.fee))}
              paragraph={"Fee shipping"}
              icon={"fas fa-truck"}
              color={"bg-light"}
            />
          </div>
        </div>
      </>
    );

  const renderOrderProducts = () => (
    <table
      id="orderTable"
      className="table table-bordered table-hover table-striped text-center table-overflow"
    >
      <thead>
        <tr>
          <th>Product</th>
          <th>Size</th>
          <th>Type</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {order &&
          order?.orderItems &&
          order?.orderItems.length > 0 &&
          order?.orderItems.map((product) => {
            return (
              <tr key={product?.id}>
                <td>{product?.product?.name}</td>
                <td>{product?.attribute?.product_size}</td>
                <td>
                  {product?.type === 1 ? <span>Cold</span> : <span>Hot</span>}
                </td>
                <td className="text-center ">{product?.quantity}</td>
                <td className="text-center ">
                  {formatMoney(parseInt(product?.attribute?.product_price))}
                </td>
                <td className="text-center ">
                  {formatMoney(
                    parseInt(
                      product?.attribute?.product_price * product?.quantity
                    )
                  )}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );

  const renderOrderInfo = () =>
    order && (
      <>
        <div className="row">
          <div className="col-12 col-md-6">
            <ViewBox
              title={order?.id}
              paragraph={"ORDER ID"}
              color={"bg-light"}
            />
          </div>

          {order?.status === 0 ? (
            <div className="col-12 col-md-6">
              <ViewBox
                title={"Pending"}
                paragraph={"Order is pending"}
                color={"bg-light"}
              />
            </div>
          ) : order?.status === 1 ? (
            <div className="col-12 col-md-6">
              <ViewBox
                title={"Paid"}
                paragraph={"Order is already paid"}
                color={"bg-light"}
              />
            </div>
          ) : order?.status === 2 ? (
            <div className="col-12 col-md-6">
              <ViewBox
                title={"Completed"}
                paragraph={"Order is completed"}
                color={"bg-light"}
              />
            </div>
          ) : (
            <div className="col-12 col-md-6">
              <ViewBox
                title={"Canceled"}
                paragraph={"Order is canceled"}
                color={"bg-light"}
              />
            </div>
          )}

          <div className="col-12 col-md-6">
            {order?.client && (
              <ViewBox
                title={order?.client?.name}
                paragraph={`ID: ${order?.client.id}`}
                icon={"fas fa-user"}
                color={"bg-info"}
              />
            )}
          </div>

          {order?.table ? (
            <div className="col-12 col-md-6">
              <ViewBox
                title={order?.table?.name}
                paragraph={`ID: ${order?.table.id}`}
                icon={"fas fa-utensils"}
                color={"bg-info"}
              />
            </div>
          ) : (
            <div className="col-12 col-md-6">
              {order?.client && (
                <ViewBox
                  title={"Delivery"}
                  paragraph={order?.client?.address}
                  icon={"fas fa-truck"}
                  color={"bg-primary"}
                />
              )}
            </div>
          )}
        </div>
      </>
    );
  const renderUserInfo = () =>
    order && (
      <>
        {order && order?.user && (
          <div className="col-12">
            <div
              className="border rounded  d-flex  mb-3 pl-2 bg-light d-flex justify-content-start align-items-center "
              style={{ minHeight: 40 }}
            >
              <span className="pr-1">
                Customer name: <strong>{order?.user?.name}</strong>
              </span>
            </div>
          </div>
        )}

        <div className="col-12 mt-1 ">
          <ViewBox
            title={"Address "}
            paragraph={
              order?.shipment?.address
                ? order?.shipment?.address
                : "Pickup at Store"
            }
            color={"bg-silver"}
          />
        </div>
        <div className="col-12 mt-1 ">
          <ViewBox
            title={"Note "}
            paragraph={order?.note}
            color={"bg-silver"}
          />
        </div>
      </>
    );
  // const renderOrderEdit = () => (
  //   <div className="card">
  //     <div className="card-header bg-warning">Edit Order</div>
  //     <div className="card-body">
  //       <button className="btn btn-block" onClick={handleEdit}>
  //         <ViewBox
  //           title={`Edit Order`}
  //           paragraph={`Click to Edit`}
  //           icon={"fas fa-edit"}
  //           color={"bg-warning"}
  //         />
  //       </button>
  //     </div>
  //   </div>
  // );

  const renderOrderPay = () => (
    <div className="card">
      <div className="card-header bg-success">Update to Paid</div>
      <div className="card-body"></div>
    </div>
  );

  const renderInfo = () => (
    <>
      <div className="col-12 col-md-8">{renderCartInfo()}</div>
      <div className="col-12 col-md-4">{renderOrderInfo()}</div>
      {renderOrderProducts()}
      {renderUserInfo()}
    </>
  );

  // const renderOrderButton = () => (
  //   <div className="col-12 col-md-3">
  //     {order && !order.isPaid && renderOrderEdit()}
  //   </div>
  // );

  // const renderPayButton = () => (
  //   <div className="col-12 col-md-3">
  //     {order && !order.isPaid && renderOrderPay()}
  //   </div>
  // );

  return (
    <>
      {/* Content Header (Page header) */}
      <HeaderContent name={"Orders"} />
      <LoaderHandler loading={loadingUpdate} error={errorUpdate} />
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {renderModal()}
            <div className="col-12">
              <div className="card">
                <div className="card-header ">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                      <ButtonGoBack history={history} />
                      <h3 className="card-title ml-4">
                        <strong>View Order</strong>{" "}
                      </h3>
                    </div>

                    <button
                      className="btn  btn-secondary  border border-black
"
                      onClick={() => openModal(status)}
                    >
                      Update
                    </button>
                  </div>
                </div>
                {/* /.card-header */}
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <LoaderHandler
                      loading={loading}
                      error={error}
                      render={renderInfo}
                      loader={<BigSpin />}
                    />
                  </div>
                </div>
                {/* /.card-body */}
              </div>
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
          <div className="row d-flex justify-content-end">
            {/* <LoaderHandler
              loading={loading}
              error={error}
              render={renderOrderButton}
              loader={<BigSpin />}
            /> */}
            {/* <LoaderHandler
              loading={loading}
              error={error}
              render={renderPayButton}
              loader={<BigSpin />}
            /> */}
          </div>
        </div>
        {/* /.container-fluid */}
      </section>
    </>
  );
};

export default OrderViewScreen;
