import React from "react";

const Pagination = ({ pages, page, setPage }) => {
    let startPage = 1;
    let endPage = Math.min(pages, 5); // Hiển thị tối đa 5 phân trang

    if (page > 3) {
        startPage = page - 2;
        endPage = Math.min(page + 2, pages);
    }

    if (endPage - startPage < 4 && pages > 5) {
        startPage = endPage - 4;
    }

    const handlePageClick = (pageNumber) => {
        setPage(pageNumber);
    };

    return (
        pages > 1 && (
            <nav>
                <ul className="pagination">
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={() => handlePageClick(page - 1)}
                            disabled={page < 2}
                        >
                            Previous
                        </button>
                    </li>
                    {startPage > 1 && (
                        <li className="page-item">
                            <button
                                className={`page-link `}
                                onClick={() => handlePageClick(startPage - 1)}
                            >
                                ...
                            </button>
                        </li>
                    )}
                    {[...Array(endPage - startPage + 1).keys()].map((index) => (
                        <li
                            key={`page${startPage + index}`}
                            className={`page-item ${
                                startPage + index === page ? "active" : ""
                            }`}
                        >
                            <button
                                className={`page-link `}
                                onClick={() => handlePageClick(startPage + index)}
                            >
                                {startPage + index}
                            </button>
                        </li>
                    ))}
                    {endPage < pages && (
                        <li className="page-item">
                            <button
                                className={`page-link `}
                                onClick={() => handlePageClick(endPage + 1)}
                            >
                                ...
                            </button>
                        </li>
                    )}
                    <li className="page-item">
                        <button
                            className="page-link"
                            onClick={() => handlePageClick(page + 1)}
                            disabled={page >= pages}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        )
    );
};

export default Pagination;
