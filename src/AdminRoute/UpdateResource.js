import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

const UpdateResource = () => {
  const apiDomain = process.env.REACT_APP_API_DOMAIN;
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [selectedTracker, setSelectedTracker] = useState("all"); // State to track the selected radio button

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiDomain}/api/user/assignresource/data`,
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      const updatedResource = {
        "Assigned Resource": editData["Assigned Resource"],
        "Read Only": editData["Read Only"],
        "Canceled Client": editData["Canceled Client"],
      };

      if (!editData._id) {
        console.error("ID is undefined.");
        return;
      }

      await axios.patch(
        `${apiDomain}/client/data/updateAssignedResource/${editData._id}`,
        updatedResource,
      );

      const updatedData = data.map((item) => {
        if (item._id === editData._id) {
          return { ...item, ...updatedResource };
        }
        return item;
      });

      setData(updatedData);
      setOpen(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = async (id) => {
    setClientToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async (id) => {
    try {
      await axios.delete(`${apiDomain}/api/user/clients/${id}`);
      const updatedData = data.filter((item) => item._id !== id);
      setData(updatedData);
      setConfirmOpen(false); // Close the confirmation dialog after successful delete
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
  };

  const handleTrackerChange = (event) => {
    setSelectedTracker(event.target.value);
  };

  const filteredData =
    selectedTracker === "all"
      ? data
      : data.filter((item) => item.selectedTracker === selectedTracker);

  const sortedData = filteredData.sort((a, b) =>
    a["Site Name"].localeCompare(b["Site Name"]),
  );

  return (
    <>
      <TableContainer
        component={Paper}
        style={{
          marginTop: "150px",
          marginLeft: "20px",
          marginRight: "20px",
          width: "auto",
        }}
      >
        <FormControl
          component="fieldset"
          style={{ marginTop: "30px", marginLeft: "20px", width: "auto" }}
        >
          <h2 component="legend">Patching Products</h2>
          <RadioGroup
            row
            aria-label="tracker"
            name="tracker"
            value={selectedTracker}
            onChange={handleTrackerChange}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel value="scm" control={<Radio />} label="SCM" />
            <FormControlLabel value="tw" control={<Radio />} label="TW" />
            <FormControlLabel value="azure" control={<Radio />} label="Azure" />
            <FormControlLabel value="suncomm" control={<Radio />} label="Suncomm" />
            <FormControlLabel value="aus" control={<Radio />} label="Aus" />
            <FormControlLabel value="adhoc" control={<Radio />} label="Adhoc" />
            <FormControlLabel value="qts" control={<Radio />} label="QTS" />
          </RadioGroup>
        </FormControl>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#151744" }}>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "#fff" }}
              >
                Site Name
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "#fff" }}
              >
                Assigned Resource
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "#fff" }}
              >
                Read Only
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "#fff" }}
              >
                Canceled Client
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "#fff" }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row["Site Name"]}</TableCell>
                <TableCell>{row["Assigned Resource"]}</TableCell>
                <TableCell>{row["Read Only"]}</TableCell>
                <TableCell>{row["Canceled Client"]}</TableCell>
                <TableCell style={{ display: "flex", gap: "10px" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setOpen(true);
                      setEditData(row);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleDelete(row._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Resource</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Assigned Resource"
            type="text"
            fullWidth
            variant="standard"
            value={editData["Assigned Resource"] || ""}
            onChange={(e) =>
              setEditData({ ...editData, "Assigned Resource": e.target.value })
            }
          />
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel>Read Only</InputLabel>
            <Select
              autoFocus
              margin="dense"
              label="Read Only"
              fullWidth
              variant="standard"
              value={editData["Read Only"] || ""}
              onChange={(e) =>
                setEditData({ ...editData, "Read Only": e.target.value })
              }
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel>Canceled Client</InputLabel>
            <Select
              autoFocus
              margin="dense"
              label="Canceled Client"
              fullWidth
              variant="standard"
              value={editData["Canceled Client"] || ""}
              onChange={(e) =>
                setEditData({ ...editData, "Canceled Client": e.target.value })
              }
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this client?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            No
          </Button>
          <Button
            onClick={() => confirmDelete(clientToDelete)}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateResource;
