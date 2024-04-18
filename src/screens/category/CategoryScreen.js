import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import ModalButton from "../../components/ModalButton";
import Modal from "react-modal";
import Input from "../../components/form/Input";
import DataTableLoader from "../../components/loader/DataTableLoader";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";

import Checkbox from "../../components/form/Checkbox";
/* Actions */
import { createCategory, listCategories } from "../../actions/categoryActions";

/* Styles */
import { modalStyles } from "../../utils/styles";

const CategoryScreen = ({ history, match }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [name, setName] = useState("");
    const [name_en, setNameEn] = useState("");
    const [status, setStatus] = useState(false);
    const [errors, setErrors] = useState({});
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);

    const dispatch = useDispatch();

    const categoryList = useSelector((state) => state.categoryList);
    const { loading, error, categories, page, pages } = categoryList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const categoryCreate = useSelector((state) => state.categoryCreate);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = categoryCreate;

    useEffect(() => {
        dispatch(listCategories(keyword, pageNumber));

        if (createSuccess) {
            setName("");
            setModalIsOpen(false);
        }
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Name is required";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
             
            const category = {
                name: name,
                name_en,
                status: status ? 1 : 0
            };
            //console.log(category);return false;

            dispatch(createCategory(category));
        }
    };

    const renderModalCreateCategory = () => (
        <>
            <ModalButton
                modal={modalIsOpen}
                setModal={setModalIsOpen}
                classes={"custom_create_btn"}
            />
            <Modal
                style={modalStyles}
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
            >
                <h2>Create Form</h2>
                <LoaderHandler loading={createLoading} error={createError} />
                <form onSubmit={handleSubmit}>
                    <Input
                        name={"name"}
                        type={"text"}
                        data={name}
                        setData={setName}
                        errors={errors}
                    />
                    <Input
                        name={"name English"}
                        type={"text"}
                        data={name_en}
                        setData={setNameEn}
                        errors={errors}
                    />
                    <Checkbox name={"available"} data={status} setData={setStatus} />
                    <hr />
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>

                    <ModalButton
                        modal={modalIsOpen}
                        setModal={setModalIsOpen}
                        classes={"btn-danger float-right"}
                    />
                </form>
            </Modal>
        </>
    );

    const renderTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr className="bg-success">
                    {/* <th>ID</th> */}
                    <th className="border-right border-bottom-0 border-left-0 border-top-0 ">Name</th>
                    <th className="border-right border-bottom-0 border-left-0 border-top-0 ">Status</th>
                    <th className="d-none d-sm-table-cell border-right border-bottom-0 border-left-0 border-top-0">Created At</th>
                    <th className="border-right border-bottom-0 border-left-0 border-top-0 "></th>
                </tr>
            </thead>
            <tbody>
                {categories.map((category) => (
                    <tr className="border-right border border-light" key={category.id}>
                        {/* <td>{category.id}</td> */}
                        <td className="py-4 border-right border border-light">{category.name}</td>
                        <td className="py-4 border-right border border-light"> 
                            {/* <div class="radio-box">
                                <label class="switch">
                                <input type="checkbox" />
                                <span class="slider round"></span>
                                </label>
                            </div>
                            <Checkbox
                                name={"Status"}
                                data={isOpen}
                                setData={setIsOpen}
                            /> */}

                            {category.status == 1 ? (
                                <h4 className="text-success">
                                    <i className="fas fa-check"></i>
                                </h4>
                            ) : (
                                <h4 className="text-danger">
                                    <i className="far fa-times-circle"></i>
                                </h4>
                            )}
                            
                        </td>
                        <td className="d-none d-sm-table-cell py-4 border-right border border-light">
                            {category.createdAt.slice(0, 10)}
                        </td>
                        <td className=" border-right border border-light">
                            <Link
                                to={`/category/${category.id}/edit`}
                                className="custom_edit_btn"
                            >
                                Edit
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <>
            <HeaderContent name={"Categories"} />

            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateCategory()}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Categories</h3>
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
                                        loader={<DataTableLoader />}
                                        render={renderTable}
                                    />
                                </div>
                                {/* /.card-body */}
                            </div>

                            <Pagination
                                page={page}
                                pages={pages}
                                setPage={setPageNumber}
                            />
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

export default CategoryScreen;
