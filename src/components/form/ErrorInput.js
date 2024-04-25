import React from "react";
import { capitalize } from "../../utils/functions";

const ErrorInput = ({ name, type, data, setData, errors, nameError, classes = "" }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{capitalize(name)}</label>
            <input
                type={type}
                min={0}
                className={`form-control ${classes}`}
                id={name}
                aria-describedby={name}
                value={data===null ? '' : data}
                onChange={(e) => setData(e.target.value)}
            />

            {errors[nameError] && (
                <label className="text-danger">{errors[nameError]} </label>
            )}
        </div>
    );
};

export default ErrorInput;
