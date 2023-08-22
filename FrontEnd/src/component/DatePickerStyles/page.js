"use client";
import moment from "moment/moment";
import { useEffect } from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerStyles = ({ placeholder, handleDate, dateFormat, selected, onChange, dateClass, disabled, showPreviousDates }) => {
  const [startDate, setStartDate] = useState();

  useEffect(() => {
    if (selected === "Invalid date") {
      setStartDate(null)
    } else if (selected) {
      const date = moment(moment(selected, 'DD-MM-YYYY')).format('MM-DD-YYYY')
      setStartDate(moment(date).toDate())
    }
  }, [selected])

  return (
    <>
      <div className="custom_datepicker_main">
        {
          dateFormat ?
            <DatePicker
              isClearable
              locale={'true'}
              className={`custom_datepicker ${dateClass}`}
              placeholderText='Filter by month'
              dateFormat={dateFormat}
              showMonthYearPicker
              selected={selected}
              onChange={onChange}
              star
            /> :
            <DatePicker
              isClearable
              className={`custom_datepicker ${dateClass}`}
              placeholderText={placeholder}
              selected={startDate}
              locale={'true'}
              dateFormat="dd-MM-yyyy"
              onChange={(date) => {
                setStartDate(date);
                handleDate(date);
              }}
              minDate={showPreviousDates ? new Date() : null}
              disabled={disabled}
            />
        }
      </div>
    </>
  );
};

export default DatePickerStyles;
