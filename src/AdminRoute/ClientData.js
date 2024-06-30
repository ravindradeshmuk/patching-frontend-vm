import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const desiredOrder = [
  "selectedTracker",
  "canceled client",
  "Read Only",
  "Data Center",
  "Live-Not Live",
  "Time Zone Group",
  "Site Name",
  "Code",
  "SQL Configuration",
  "Assigned Resource",
  "Citrix-Infra",
  "SCM App Group 1 START",
  "SCM App Group 2 - Complete",
  "SCM App Group 2 - Complete (Enter EST Time in 24h format)",
  "SUN Component App Group Complete",
  "Patch Reboots Complete (Enter EST Time in 24h format)",
  "Patch-Reboots Complete",
  "C:drive cleanup (Cleanup on all servers including Gold Images)",
  "Citrix Infra Validation",
  "SCM App Validation",
  "DB Validation",
  "Monitoring ISS-E-Link Validation",
  "Monitoring Alerts Validation",
  "Maintenance Mode Disabled",
  "Azure VM State Check",
  "Azure Gold Image Compliance Status",
];

const ClientData = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const apiDomain = process.env.REACT_APP_API_DOMAIN;
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formValues, setFormValues] = useState({ key: "", value: "" });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/client/data/api/tableData?includeId=true`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredData = filter
    ? data.filter((item) => item.selectedTracker === filter)
    : data;

  const getCellValue = (item, key) => {
    const value = item[key];
    if (typeof value === "object" && value !== null) {
      return value.value || "";
    }
    return value;
  };

  const handleUpdateClick = (item, key) => {
    setSelectedItem(item);
    setFormValues({ key, value: getCellValue(item, key) });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setFormValues({ key: "", value: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const { key, value } = formValues;
      await axios.put(
        `${apiDomain}/client/data/api/update/${selectedItem._id}`,
        { key, value }
      );
      fetchData(); // Refresh the data
      handleClose();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleCancel = (id) => {
    // Implement cancel logic here
    console.log("Cancel operation for item with id:", id);
  };

  return (
    <Box sx={{ padding: isMobile ? "10px" : "30px" }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Client Data
      </Typography>
      <Box mb={4}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Filter</FormLabel>
          <RadioGroup row value={filter} onChange={handleFilterChange}>
            <FormControlLabel value="" control={<Radio />} label="All" />
            {["scm", "tw", "azure", "suncom", "adhoc", "qts"].map((type) => (
              <FormControlLabel
                key={type}
                value={type}
                control={<Radio />}
                label={type}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Serial Number</TableCell>
              {desiredOrder.map((key) => (
                <TableCell key={key} sx={{ fontWeight: "bold" }}>
                  {key}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>{index + 1}</TableCell>
                {desiredOrder.map((key) => (
                  <TableCell key={key} align="center">
                    {getCellValue(item, key)}
                  </TableCell>
                ))}
                <TableCell sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateClick(item)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleCancel(item._id)}
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Value</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To update the value, please enter the new value here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="value"
            label="New Value"
            type="text"
            fullWidth
            value={formValues.value}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientData;
