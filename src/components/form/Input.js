import React from "react";
import { capitalize } from "../../utils/functions";

const Input = ({ name, type, data, setData, errors, classes = "" }) => {
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

            {errors[name] && (
                <label className="text-danger">{errors[name]} </label>
            )}
        </div>
    );
};

export default Input;
