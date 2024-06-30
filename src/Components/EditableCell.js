import React, { useState } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const EditableCell = ({ value, cell, onCellValueChange }) => {
  const [cellValue, setCellValue] = useState(value);

  const handleStatusChange = (event) => {
    const newValue = event.target.value;
    setCellValue(newValue);
    onCellValueChange({ cell, value: newValue });
  };

  const statusOptions = ["Pending", "Incomplete", "Complete"];

  return (
    <div style={{ position: "relative" }}>
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select value={cellValue} onChange={handleStatusChange} label="Status">
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default EditableCell;
