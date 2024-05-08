import React from "react";
import { capitalize } from "../../utils/functions";

const CustomCheckBox= ({  data, setData }) => {
    return (
        <div className="form-group clearfix">
            <div className="icheck-primary d-inline ">
                <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue
                    checked={data}
                    onChange={(e) => setData(e.target.checked)}
                />
            </div>
        </div>
    );
};

export default CustomCheckBox;
