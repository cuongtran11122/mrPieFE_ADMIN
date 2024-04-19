import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";

/* Actions */
import { listOrders } from "../../actions/orderActions";

const OrderScreen = ({ history }) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState("");

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders, page, pages } = orderList;

    useEffect(() => {
        if (!userInfo) {
            history.push("/login");
        }
        
        dispatch(listOrders({ keyword, pageNumber, delivery: false }));
        console.log(orders)
    }, [dispatch, history, userInfo, pageNumber, keyword]);

    const renderCreateButton = () => (
        <Link to="/order/create">
            <button className="btn btn-success btn-lg">
                <i className="fas fa-edit" /> New Order
            </button>
        </Link>
    );

    const renderTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr className="bg-success">
                    <th className="border-right border-bottom-0 border-left-0 border-top-0 ">Customer name</th>
                    <th className="border-right border-bottom-0 border-left-0 border-top-0 ">Phone</th>
                    <th className="d-none d-sm-table-cell border-right border-bottom-0 border-left-0 border-top-0">Total mount</th>
                    <th className="border-right border-bottom-0 border-left-0 border-top-0 ">Status</th>
                    <th className="border-right border-bottom-0 border-left-0 border-top-0 ">Total</th>
                    <th className="border-right border-bottom-0 border-left-0 border-top-0 ">Created date</th>
                    <th className="border-right border-bottom-0 border-left-0 border-top-0 "></th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td className="py-4 border-right border border-light">{order.user ? order.user.name : ''}</td>
                        <td className="py-4 border-right border border-light">{order.user ? order.user.phone : ''}</td>
                        
                        <td className="py-4 border-right border border-light">
                            {order.total_amount}
                        </td>
                        <td className="py-4 border-right border border-light">
                            {order.status}
                            {/* {order.isPaid ? (
                                <h4 className="text-success">
                                    <i className="fas fa-check"></i>
                                </h4>
                            ) : (
                                <h4 className="text-danger">
                                    <i className="far fa-times-circle"></i>
                                </h4>
                            )} */}
                        </td>
                        <td className="d-none d-sm-table-cell h4 py-4 border-right border border-light">
                            <span className={"badge bg-success"}>
                                ${order.total_amount}
                            </span>
                        </td>
                        <td className="py-4 border-right border border-light">{order.createdAt.slice(0, 10)}</td>
                        <td className=" border-right border border-light">
                            <Link
                                to={`/order/${order.id}/view`}
                                className="custom_submit_btn"
                            >
                                View
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
                    <div className="row">
                        <div className="col-12">
                            {/* {renderCreateButton()} */}
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
