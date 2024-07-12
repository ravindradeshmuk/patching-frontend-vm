import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListItemIcon,
} from "@mui/material";

import { styled, useTheme } from "@mui/system";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "16px",
  border: "1px solid black",
}));

const StyledTableHeadCell = styled(StyledTableCell)({
  fontWeight: "bold",
});

const EditableCell = ({ value, onChange, isStatusCell }) => {
  const [cellValue, setCellValue] = useState(value);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleStatusChange = (event) => {
    setCellValue(event.target.value);
    onChange(event.target.value);
    setMenuOpen(false);
  };

  const handleMenuOpen = (event) => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const statusOptions = ["Pending", "Incomplete", "Complete"];

  return (
    <StyledTableCell>
      {isStatusCell ? (
        <div style={{ position: "relative" }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={cellValue}
              onChange={handleStatusChange}
              label="Status"
              open={menuOpen}
              onOpen={handleMenuOpen}
              onClose={handleMenuClose}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  <ListItemIcon>
                    {/* Add your icons here */}
                    <span>Icon here</span>
                  </ListItemIcon>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : (
        cellValue // Display the cell value directly if not a status cell
      )}
    </StyledTableCell>
  );
};

const CustomTable = ({ data, onCellValueChange }) => {
  const theme = useTheme();

  return (
    <TableContainer
      component={Paper}
      style={{
        overflowX: "auto",
        overflowY: "auto",
        maxHeight: `calc(10vh - ${theme.spacing(10)}px)`,
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {data[0].map((column, index) => (
              <StyledTableHeadCell key={index}>{column}</StyledTableHeadCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(1).map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cellValue, cellIndex) => (
                <EditableCell
                  key={cellIndex}
                  value={cellValue}
                  onChange={(newValue) =>
                    onCellValueChange(rowIndex, cellIndex, newValue)
                  }
                  isStatusCell={data[0][cellIndex].toLowerCase() === "status"}
                />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const App = () => {
  const [data, setData] = useState([
    [
      "Data Center",
      "Live/Not Live",
      "Time Zone Group",
      "Site Name",
      "Code",
      "SQL Configuration",
      "Assigned Resource",
      "SCM App Group 1 START",
      "SCM App Group 2 - Complete",
      "SCM App Group 2 - Complete (Enter EST Time in 24h format)",
      "SUN Component App Group Complete",
      "Patch Reboots Complete (Enter EST Time in 24h format)",
      "Patch/Reboots Complete",
      "C:\\ drive cleanup (Cleanup on all servers including Gold Images)",
      "Citrix Infra Validation",
      "Monitoring ISS/E-Link Validation",
      "SCM App Validation",
      "DB Validation",
      "Monitoring Alerts Validation",
      "Maintenance Mode Disabled",
      "Azure VM State Check",
    ],
    [
      "Ates Live East Appalachian Regional Medical Center",
      "AR AC 3 Revikas",
      "Started Completed",
      "FAST ZONE, PATCHING WINDOW 2 AM to 4 AMET",
      "3:30",
      "Completed",
      "Completed",
      "Completed",
      "Complete",
      "Completed",
      "Completed",
      "Completed",
      "Completed",
      "Completed",
      "Completed",
      "Completed",
      "Completed",
      "Completed",
      "na",
      "Completed",
      "Completed",
    ],
  ]);

  const handleCellValueChange = (rowIndex, cellIndex, newValue) => {
    const newData = [...data];
    newData[rowIndex][cellIndex] = newValue;
    setData(newData);
  };

  return (
    <div className="App">
      <CustomTable data={data} onCellValueChange={handleCellValueChange} />
    </div>
  );
};

export default App;
