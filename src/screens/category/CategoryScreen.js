import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import Input from "../../components/form/Input";
import DataTableLoader from "../../components/loader/DataTableLoader";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";

import Checkbox from "../../components/form/Checkbox";
/* Actions */
import {
  createCategory,
  listCategories,
  deleteCategory,
} from "../../actions/categoryActions";

import "../../style/button.css";

const CategoryScreen = ({ history, match }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [name_en, setNameEn] = useState("");
  const [status, setStatus] = useState(false);
  const [errors, setErrors] = useState({});
  const [keyword, setKeyword] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const [categoryID, setCategoryID] = useState(null);

  const dispatch = useDispatch();
  const [rerender, setRerender] = useState(false);
  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories, page, pages } = categoryList;

  const userLogin = useSelector((state) => state.userLogin);
  const { adminInfo } = userLogin;

  const categoryCreate = useSelector((state) => state.categoryCreate);
  const {
    loading: createLoading,
    success: createSuccess,
    error: createError,
  } = categoryCreate;

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    refershForm();
  };
  useEffect(() => {
    dispatch(listCategories(keyword, pageNumber));

    if (createSuccess) {
      setName("");
      setNameEn("");
      setModalIsOpen(false);
    }
  }, [
    dispatch,
    history,
    adminInfo,
    pageNumber,
    keyword,
    createSuccess,
    rerender,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let errorsCheck = {};

    if (!name || name.length > 32) {
      errorsCheck.name = "Name is required and should be less than 32 characters";
    }

    if (!name_en || name_en.length > 32) {
      errorsCheck.name_en = "English name is required and should be less than 32 characters";
    }
    setErrors(errorsCheck);
    setTimeout(() => {
      setErrors({});
    }, 2000); 
  
    if (Object.keys(errorsCheck).length > 0) {
      setErrors(errorsCheck);
    } else {
      setErrors({});
    }
  
    if (Object.keys(errorsCheck).length === 0) {
      const category = {
        name: name,
        name_en: name_en,
        status: status ? 1 : 0,
      };
  
      dispatch(createCategory(category));
      refershForm();
    }
  };

  const deleteRow = (id) => {
    dispatch(deleteCategory(id));
    setRerender(!rerender);
  };

  const refershForm = () => {
    setName("");
    setNameEn("");
    setStatus(false);
  };

  // const renderModalCreateCategory = () => (
  //   <>
  //     <ModalButton
  //       modal={modalIsOpen}
  //       setModal={setModalIsOpen}
  //       classes={"custom_create_btn"}
  //     />
  //     <Modal
  //       style={modalStyles}
  //       isOpen={modalIsOpen}
  //       onRequestClose={() => setModalIsOpen(false)}
  //     >
  //       <h2>Create Form</h2>
  //       <LoaderHandler loading={createLoading} error={createError} />
  //       <form onSubmit={handleSubmit}>
  //         <Input
  //           name={"name"}
  //           type={"text"}
  //           data={name}
  //           setData={setName}
  //           errors={errors}
  //         />
  //         <Input
  //           name={"name English"}
  //           type={"text"}
  //           data={name_en}
  //           setData={setNameEn}
  //           errors={errors}
  //         />
  //         <Checkbox name={"available"} data={status} setData={setStatus} />
  //         <hr />
  //         <button type="submit" className="btn btn-primary">
  //           Submit
  //         </button>

  //         <ModalButton
  //           modal={modalIsOpen}
  //           setModal={setModalIsOpen}
  //           classes={"btn-danger float-right"}
  //         />
  //       </form>
  //     </Modal>
  //   </>
  // );

  const renderModalCreateCategory = () => (
    <>
      {/* <ModalButton
        modal={modalIsOpen}
        setModal={setModalIsOpen}
        classes={"btn-success btn-md mb-2 fw-bolder"}
      /> */}

      {/* This is modal */}
      {modalIsOpen && (
        <div id="modal" className="registration-form">
          {/* <img src="../../../public/plugins/close.png" className="w-25 h-25"/> */}

          <form style={{ position: "relative" }} onSubmit={handleSubmit}>
            <img
              onClick={closeModal}
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
              alt="User profile picture"
            />
            <span>
              <h1 className="text-center mb-4">Creat Category</h1>
            </span>
            {loading && <Loader variable={loading} />}
            {createError && <Message message={createError} color={"danger"} />}
            <div className="form-group">
              {/* <input
              type="text"
              
              class="form-control item"
              id="username"
              placeholder="Username"
            /> */}
              <Input
                name={"name"}
                type={"text"}
                label={"Category name"}
                data={name}
                setData={setName}
                errors={errors}
              />
            </div>
            <div className="form-group">
              <Input
                name={"name_en"}
                type={"text"}
                label={"English category name"}
                data={name_en}
                setData={setNameEn}
                errors={errors}
              />
            </div>
            {/* <div className="form-group">
              <Checkbox name={"available"} data={status} setData={setStatus} />
            </div> */}

            <hr />

            <div className="form-group">
              <button
                type="submit"
                className="btn  btn-secondary  border border-black"
                style={{ width: "100%" }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );

  const renderConfirmModal = (categoryID) => (
    <div id="myModal" className="modal fade">
      <div className="modal-dialog modal-confirm">
        <div className="modal-content">
          <div className="modal-header flex-column">
            <div className="icon-box">
              <i className="material-icons">&#xE5CD;</i>
            </div>
            <h4 className="modal-title w-100">Are you sure?</h4>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p>
              Do you really want to delete these records? This process cannot be
              undone.
            </p>
          </div>
          <div className="modal-footer justify-content-center">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-dismiss="modal"
              onClick={(e) => {

                deleteRow(categoryID);
                setCategoryID(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTable = () => (
    <table className="table table-hover text-nowrap">
      <thead>
        <tr className="header_table">
          {/* <th>ID</th> */}
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Name
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Name English
          </th>
          {/* <th className="border-right border-bottom-0 border-left-0 border-top-0 ">
            Status
          </th> */}
          <th className="d-none d-sm-table-cell border-right border-bottom-0 border-left-0 border-top-0">
            Created At
          </th>
          <th className="border-right border-bottom-0 border-left-0 border-top-0 "></th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr className="border-right border border-light" key={category.id}>
            {/* <td>{category.id}</td> */}
            <td className="py-4 border-right border border-light">
              {category.name}
            </td>
            <td className="py-4 border-right border border-light">
              {category.name_en}
            </td>
            {/* <td className="py-4 border-right border border-light"> */}
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

            {/* {category.status == 1 ? (
                <h4 className="text-success">
                  <i className="fas fa-check"></i>
                </h4>
              ) : (
                <h4 className="text-danger">
                  <i className="far fa-times-circle"></i>
                </h4>
              )} */}
            {/* </td> */}
            <td className="d-none d-sm-table-cell py-4 border-right border border-light">
              {category.createdAt.slice(0, 10)}
            </td>
            <td className="py-4  border-right border border-light d-flex justify-content-center align items-center">
              <Link to={`/category/${category.id}/edit`}>
                <button
                  type="button"
                  className="btn  btn-light text-sm border border-black mr-4"
                >
                  Edit
                </button>
              </Link>

              <button
                type="button"
                className=" btn  btn-light text-sm border border-black mr-4"
                href="#myModal"
                data-toggle="modal"
                onClick={(e) => {

                  setCategoryID(category.id);
                }}
              >
                Delete
              </button>
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
          {renderConfirmModal(categoryID)}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title align-middle ">
                    <strong>Categories</strong>
                  </h3>
                  <div className="d-flex justify-content-end">
                    <div className="card-tools">
                      <Search
                        placeholder={"Search by name..."}
                        keyword={keyword}
                        setKeyword={setKeyword}
                        setPage={setPageNumber}
                      />
                    </div>
                    <button
                      id="createBtn"
                      className="btn  btn-secondary  border border-black ml-2"
                      onClick={openModal}
                    >
                      Create
                    </button>
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

              <Pagination page={page} pages={pages} setPage={setPageNumber} />
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
