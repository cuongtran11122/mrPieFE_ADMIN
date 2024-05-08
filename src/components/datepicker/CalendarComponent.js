import React, { useState } from "react";

import { DateRangePicker } from 'rsuite';
import { compareAsc, format } from "date-fns";
import 'rsuite/dist/rsuite-rtl.css'; // Import for right-to-left layout
import './calendar.css'; // Import for custom calendar styles

const CalendarComponent = () => {
  const [dateRange, setDateRange] = useState([]); // State for start and end dates

  // Handle date range selection and validation
  const handleChange = (range) => {
    // Check if both start and end dates are cleared by the user
    if (!range || range.length === 0) {
      setDateRange([]); // Set state to empty array when selection is cleared
      return; // Prevent further processing if selection is cleared
    }

    // Validate date order: start date should be before end date
    
    setDateRange(range);
  };

  const [startDate, endDate] = dateRange; // Destructure dates for readability

  return (
    <div className="dates">
      {startDate && endDate && ( // Display only if both dates are selected
        <p>
          Selected Date Range: {format(startDate, "yyyy-MM-dd")} - {format(endDate, "yyyy-MM-dd")}
        </p>
      )}
      <DateRangePicker

        value={dateRange} // Pass the complete date range state
        onChange={handleChange}
      />
    </div>
  );
};

export default CalendarComponent;

