import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

/* components */
import LoaderHandler from "../loader/LoaderHandler";
import Pagination from "../Pagination";
import Search from "../Search";
import { BigSpin } from "../loader/SvgLoaders";

/* actions */
import { listProducts } from "../../actions/productActions";

const ProductsTable = ({
    productsInOrder,
    setProductsInOrder,
    productsAlreadyOrdered,
    order

}) => {
    //add product to order
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(0);
    const [products, setProducts] = useState([]);
    

    const addProduct = (e, product,productStock) => {
        e.preventDefault();
        console.log("Hello")
        console.log(product)
        //product object
        const productIn = {
            id: product.product_id,
            name: product.product.name,
            price: product.attribute.product_price,
            stock: productStock,
            quantity: 1,
        };
        //if is already in order
        if (!inOrder(productIn, productsInOrder)) {
            setProductsInOrder([...productsInOrder, productIn]);
        } else {
            alert("Product already in order");
        }
    };

    //product list state
    const productList = useSelector((state) => state.productList);
    const {
        loading: loadingProductList,
        error: errorProductList,
        products: productsFromState,
        page,
        pages,
    } = productList;

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber));
    }, [keyword, pageNumber]);

    useEffect(() => {
        if (productsFromState) {
            setProducts(mapProducts(productsFromState));
        }
    }, [productsFromState]);

    //check if product is already in order
    const inOrder = (obj, list) => {

        for (let index = 0; index < list.length; index++) {
            if (obj.product_id === list[index].id) {
                return list[index];
            }
        }
        return false;
    };

    //refresh products table
    const refreshProducts = (e) => {
        e.preventDefault();
        dispatch(listProducts(keyword, pageNumber));
    };

    //check stock to show
    const showStock = (product) => {
        console.log("Heloosssss")
        console.log(productsInOrder)
        let productInOrder=false;
        if(product.product.id === product.product_id) {
            productInOrder=true;
        }
        
        if (productInOrder) return product.product.quantity -product.quantity ;
        return product.product.quantity;
    };

    const mapProducts = (productsToMap) => {
        if (!productsAlreadyOrdered) return productsToMap;

        const mappedProducts = productsToMap.map((item) => {
            productsAlreadyOrdered.map((item2) => {
                if (item.id === item2.id) {
                    item.stock = item.stock + item2.quantity;
                }
            });
            return item;
        });
        return mappedProducts;
    };

    const renderRefreshButton = () => (
        <button className="btn btn-info float-right" onClick={refreshProducts}>
            <i className="fas fa-sync-alt"></i>
        </button>
    );

    const renderProducts = () => (
        <table id="productsTable" className="table table-bordered table-hover ">
            <thead
                style={{
                    color: "#fff",
                }}
                className="bg-info"
            >
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {order &&
          order.orderItems &&
          order.orderItems.length > 0 &&
          order.orderItems.map((product) => {
            let productStock =0;
            let productInOrder = false;
            if(product.product.id === product.product_id) {
                productInOrder=true;
            }
            
            if (productInOrder){
                productStock =  product.product.quantity -product.quantity ;
            }
            else{
                productStock =  product.product.quantity
            }

            return (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.product.name}</td>
                
                <td className=" h4">
                  <span className="badge bg-info">
                    ${product.attribute.product_price}
                  </span>
                </td>
                <td>{showStock(product)}</td>
                {inOrder(product, productsInOrder) ? (
                            <td className="text-center">
                                <button disabled className="btn btn-primary">
                                    In Order
                                </button>
                            </td>
                        ) : productStock > 0 ? (
                            <td className="text-center">
                                <button
                                    className="btn btn-success"
                                    onClick={(e) => addProduct(e, product,productStock)}
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </td>
                        ) : (
                            <td className="text-center">
                                <button disabled className="btn btn-danger">
                                    Out of Stock
                                </button>
                            </td>
                        )}
              </tr>
            );
          })}



                {/* {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{showStock(product)}</td>
                        {inOrder(product, productsInOrder) ? (
                            <td className="text-center">
                                <button disabled className="btn btn-primary">
                                    In Order
                                </button>
                            </td>
                        ) : product.stock > 0 ? (
                            <td className="text-center">
                                <button
                                    className="btn btn-success"
                                    onClick={(e) => addProduct(e, product)}
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </td>
                        ) : (
                            <td className="text-center">
                                <button disabled className="btn btn-danger">
                                    Out of Stock
                                </button>
                            </td>
                        )}
                    </tr>
                ))} */}
            </tbody>
        </table>
    );

    return (
        <>
            {renderRefreshButton()}
            <Search
                keyword={keyword}
                setKeyword={setKeyword}
                setPage={setPageNumber}
            />
            <LoaderHandler
                loading={loadingProductList}
                error={errorProductList}
                render={renderProducts}
                loader={<BigSpin />}
            />

            <Pagination pages={pages} page={page} setPage={setPageNumber} />
        </>
    );
};

export default ProductsTable;
