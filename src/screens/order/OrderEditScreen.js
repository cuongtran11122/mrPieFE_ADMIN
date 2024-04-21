import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";

/* Form components */
import Textarea from "../../components/form/Textarea";
import Checkbox from "../../components/form/Checkbox";

/* Order Components */
import ProductsTable from "../../components/order/ProductsTable";
import OrderInfo from "../../components/order/OrderInfo";
import Select from "../../components/Select";
import OrderCart from "../../components/order/OrderCart";
import LoaderHandler from "../../components/loader/LoaderHandler";

/* Constants */
import {
    ORDER_DETAILS_RESET,
    ORDER_UPDATE_RESET,
} from "../../constants/orderConstants";

/* Actions */
import { listOrderDetails, updateOrder } from "../../actions/orderActions";
// import { listClients } from "../../actions/clientActions";
// import { listTables } from "../../actions/tableActions";

const OrderEditScreen = ({ history, match }) => {
    const orderId = parseInt(match.params.id);

    // const [table, setTable] = useState(null);
    const [total, setTotal] = useState(0);
    const [currentTotalPrices,setCurrentTotalPrices] = useState(0);
    // const [client, setClient] = useState(null);
    // const [delivery, setDelivery] = useState(false);
    // const [note, setNote] = useState("");
    const [productsInOrder, setProductsInOrder] = useState([]);
    const [productOrders,setProductOrders] = useState([]);
    const [productsAlreadyOrdered, setProductsAlreadyOrdered] = useState([]);
    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    //order details state
    const orderDetails = useSelector((state) => state.orderDetails);
    const { loading, error, order } = orderDetails;

    // const clientList = useSelector((state) => state.clientList);
    // const { clients } = clientList;

    // const tableList = useSelector((state) => state.tableList);
    // const { tables } = tableList;

    //order edit state
    const orderUpdate = useSelector((state) => state.orderUpdate);
    const {
        loading: loadingUpdate,
        success: successUpdate,
        errorUpdate,
    } = orderUpdate;


    const currentTotalPrice = () => {
        if (order && order.orderItems && order.orderItems.length > 0) {
          const total = order.orderItems.reduce((acc, item) => {
            return acc + (item.attribute.product_price * item.quantity);
          }, 0);
          
          console.log(total)
          setCurrentTotalPrices(total)
          
        } else {
          setCurrentTotalPrices(0) // Set to 0 if no order items
        }
      };

      const getOrderProducts = (orderItems) => {
        if (orderItems && orderItems.length > 0) {
          const productData = orderItems.map((orderItem) => ({
            productId: orderItem.product_id, // Assuming product_id exists
            quantity: orderItem.quantity,
          }));
          setProductOrders(productData);
        } else {
          setProductOrders([]); // Set to empty array if no order items
        }
      };

      const updateProductQuantity = (productOrders, products) => {
        // Create deep copies of productOrders and products arrays
        const updatedProductOrders = JSON.parse(JSON.stringify(productOrders));
        const updatedProducts = JSON.parse(JSON.stringify(products));
    
        // Iterate over each product order
        updatedProductOrders.forEach(order => {
            // Find the product in updatedProducts with matching productId
            const productToUpdate = updatedProducts.find(product => product.id === order.productId);
    
            // If the product is found, update its quantity
            if (productToUpdate) {
                productToUpdate.quantity += order.quantity;
            }
        });
    
        // Return the updated products array
        return updatedProducts;
    };

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: ORDER_UPDATE_RESET });
            dispatch({ type: ORDER_DETAILS_RESET });
            // if (delivery) {
            //     history.push("/delivery");
            // } else {
            //     history.push("/active");
            // }
            setProductsInOrder([])
        }
    }, [successUpdate]);

    useEffect(() => {
        //load order
        if (order) {
            if (!order.id || order.id !== orderId) {
                dispatch(listOrderDetails(orderId));
            } else {
                //set states
                // setTable(order.table ? order.table.id : null);
                // setClient(order.client ? order.client.id : null);
                // setNote(order.note ? order.note : note);
                // setDelivery(order.delivery ? order.delivery : delivery);
                currentTotalPrice()
                getOrderProducts(order.orderItems)
                
                // if (order) {
                //     /* Format products */
                //     const products = order.orderItems.map((product) => {
                        
                //         return {
                //             ...product,
                //             productID : product.product_id,
                //             quantity: product.quantity,
                //         };
                //     });
                //     console.log(products)
                //     // /* Set products state */
                //     // setProductsInOrder(products);
                //     // setProductsAlreadyOrdered(products);
                // }
            }
        }
    }, [dispatch, history, order, orderId]);

    
    const handleSubmit = (e) => {
        e.preventDefault();
        let errorsCheck = {};
    
        if (productsInOrder.length < 1) {
            errorsCheck.products = "Cart cannot be empty";
        }
    
        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
            const updatedProduct =  updateProductQuantity(productOrders,productsInOrder)
            console.log(updatedProduct)
            
            const updatedOrderItems = updatedProduct.map(product => ({
                productId: product.id,
                quantity: product.quantity
            }));
    
            // Prepare the order object
            const order = {
                id: orderId,
                total_amount: parseInt(currentTotalPrices) + parseInt(total),
                updatedProductOrders: updatedOrderItems // Use updatedProductOrders instead of products
            };
            console.log(order)
            // Dispatch the updateOrder action
            dispatch(updateOrder(order));
        }
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     let errorsCheck = {};

    //     // if (!table && !delivery) {
    //     //     errorsCheck.table = "Table is required";
    //     // }
    //     // if (!client) {
    //     //     errorsCheck.client = "Client is required";
    //     // }

    //     if (productsInOrder.length < 1) {
    //         errorsCheck.products = "Cart cannot by empty";
    //     }

    //     if (Object.keys(errorsCheck).length > 0) {
    //         setErrors(errorsCheck);
    //     } else {
    //         setErrors({});
    //     }

    //     if (Object.keys(errorsCheck).length === 0) {
    //         const updatedProduct =  updateProductQuantity(productOrders,productsInOrder)
            
 
    //         console.log(updatedProduct)
    //         const order = {
    //             id: orderId,
    //             total_amount: parseInt(currentTotalPrices) + parseInt(total),
    //             // tableId: !delivery ? table : null,
    //             // clientId: client,
    //             products: productsInOrder,
    //             // delivery: delivery,
    //             // note: note,
    //         };
    //         console.log(order)
            
            

    //         dispatch(updateOrder(order));
    //     }
    // };

    // const filterFreeTables = () => {
    //     const mappedTables = tables.filter((tableItem) => {
    //         /* return if table is not occupied OR if the same from order */
    //         return tableItem.occupied === false || tableItem.id === table;
    //     });
    //     return mappedTables;
    // };

    const renderProductsTable = () => (
        <ProductsTable
            productsInOrder={productsInOrder}
            productsAlreadyOrdered={productsAlreadyOrdered}
            setProductsInOrder={setProductsInOrder}
            order={order}
            
        />
    );

    const renderCart = () => (
        <>
            {errors.products && (
                <Message message={errors.products} color={"warning"} />
            )}
            <OrderInfo
                total={total}
                setTotal={setTotal}
                productsInOrder={productsInOrder}
            />
            <OrderCart
                productsInOrder={productsInOrder}
                setProductsInOrder={setProductsInOrder}
            />
        </>
    );

    // const searchTables = (e) => {
    //     dispatch(listTables(e.target.value));
    // };

    // const renderTablesSelect = () => (
    //     <>
    //         <Select
    //             data={table}
    //             setData={setTable}
    //             items={filterFreeTables(tables)}
    //             disabled={delivery}
    //             search={searchTables}
    //         />
    //         {errors.table && (
    //             <Message message={errors.table} color={"warning"} />
    //         )}
    //     </>
    // );

    // const searchClients = (e) => {
    //     dispatch(listClients(e.target.value));
    // };

    // const renderClientsSelect = () => (
    //     <>
    //         <Select
    //             data={client}
    //             setData={setClient}
    //             items={clients}
    //             search={searchClients}
    //         />
    //         {errors.client && (
    //             <Message message={errors.client} color={"warning"} />
    //         )}
    //     </>
    // );

    // const renderDeliveryCheckbox = () => (
    //     <Checkbox name={"delivery"} data={delivery} setData={setDelivery} />
    // );

    // const renderNoteTextarea = () => (
    //     <Textarea
    //         title={"Note (optional)"}
    //         rows={3}
    //         data={note}
    //         setData={setNote}
    //     />
    // );

    const renderSubmitButton = () => (
        <button
            onClick={handleSubmit}
            className="btn btn-success btn-lg float-right "
        >
            Submit
        </button>
    );

    return (
        <>
            {/* Content Header (Page header) */}
            <HeaderContent name={"Orders"} />

            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <ButtonGoBack history={history} />
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Create Order  </h3>
                                    <Loader variable={loadingUpdate} />
                                    <Message
                                        message={errorUpdate}
                                        color={"danger"}
                                    />
                                    <Loader variable={loading} />
                                    <Message message={error} color={"danger"} />
                                </div>
                                {/* /.card-header */}
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12 col-lg-6">
                                            {renderProductsTable()}
                                        </div>
                                        <div className="col-12 col-lg-6">
                                            {renderCart()}
                                            
                                            {/* <div className="mt-4">
                                                {renderDeliveryCheckbox()}
                                            </div> */}
                                            {/* {renderNoteTextarea()} */}
                                        </div>
                                    </div>
                                    {renderSubmitButton()}
                                </div>
                                {/* /.card-body */}
                            </div>
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

export default OrderEditScreen;
