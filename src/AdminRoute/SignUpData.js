import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import moment from "moment-timezone";
const SignUpData = () => {
  const apiDomain = process.env.REACT_APP_API_DOMAIN;
  const apiPort = process.env.REACT_APP_API_PORT;
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${apiDomain}/user/api/users`,
        );
        setPendingUsers(
          response.data.filter((user) => user.status === "pending"),
        );
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const updateUserStatus = async (userId, newStatus) => {
    let approveTime = null;
    if (newStatus === "approved" || newStatus === "rejected") {
      approveTime = moment.tz("America/New_York").format("MM/DD/YYYY hh:mm");
      // const signupTime = moment().format('YYYY-MM-DD hh:mm');
    }
    try {
      const response = await axios.put(
        `${apiDomain}/user/api/users/${userId}`,
        { status: newStatus, approveTime },
      );
      const updatedUser = response.data.user;

      // Update pending users state
      setPendingUsers(
        pendingUsers.map((user) => {
          if (user._id === userId) {
            return {
              ...user,
              status: updatedUser.status,
              approveTime: updatedUser.approveTime,
            };
          }
          return user;
        }),
      );

      // Update all users state
      setAllUsers(
        allUsers.map((user) => {
          if (user._id === userId) {
            return {
              ...user,
              status: updatedUser.status,
              approveTime: updatedUser.approveTime,
            };
          }
          return user;
        }),
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleApprove = async (userId) => {
    updateUserStatus(userId, "approved");
  };

  const handleReject = async (userId) => {
    updateUserStatus(userId, "rejected");
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${apiDomain}/user/api/users/${userId}`);

      // Update pending users state
      setPendingUsers(pendingUsers.filter((user) => user._id !== userId));

      // Update all users state
      setAllUsers(allUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers =
    filter === "pending"
      ? pendingUsers
      : allUsers.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
        );

  return (
    <div style={{ marginTop: "50px", padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <RadioGroup
        row
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <FormControlLabel value="all" control={<Radio />} label="All Users" />
        <FormControlLabel
          value="pending"
          control={<Radio />}
          label="Pending Approval"
        />
      </RadioGroup>
      {filter === "all" && (
        <TextField
          label="Search"
          variant="outlined"
          style={{ marginTop: "10px", width: "50%" }}
          value={searchTerm}
          onChange={handleSearch}
        />
      )}
      <Table
        style={{
          borderCollapse: "collapse",
          border: "1px solid black",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px 20px 20px 20px ",
          width: "100%",
          marginTop: "20px",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell
              style={{
                border: "1px solid black",
                padding: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              S.r
            </TableCell>
            <TableCell
              style={{
                border: "1px solid black",
                padding: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              First Name
            </TableCell>
            <TableCell
              style={{
                border: "1px solid black",
                padding: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Last Name
            </TableCell>
            <TableCell
              style={{
                border: "1px solid black",
                padding: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Email
            </TableCell>
            <TableCell
              style={{
                border: "1px solid black",
                padding: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Status
            </TableCell>
            <TableCell
              style={{
                border: "1px solid black",
                padding: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              SignUp Time
            </TableCell>
            <TableCell
              style={{
                border: "1px solid black",
                padding: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Approve/Reject Time
            </TableCell>
            {filter === "pending" && (
              <TableCell
                style={{
                  border: "1px solid black",
                  padding: "10px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Actions
              </TableCell>
            )}
            {filter !== "pending" && (
              <TableCell
                style={{
                  border: "1px solid black",
                  padding: "10px",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "30%",
                }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user, index) => (
            <TableRow key={user._id}>
              <TableCell style={{ border: "1px solid black", padding: "10px" }}>
                {index + 1}
              </TableCell>
              <TableCell style={{ border: "1px solid black", padding: "10px" }}>
                {user.firstName}
              </TableCell>
              <TableCell style={{ border: "1px solid black", padding: "10px" }}>
                {user.lastName}
              </TableCell>
              <TableCell style={{ border: "1px solid black", padding: "10px" }}>
                {user.email}
              </TableCell>
              <TableCell style={{ border: "1px solid black", padding: "10px" }}>
                {user.status}
              </TableCell>
              <TableCell style={{ border: "1px solid black", padding: "10px" }}>
                {user.signupTime}
              </TableCell>
              <TableCell style={{ border: "1px solid black", padding: "10px" }}>
                {user.approveTime
                  ? new Date(user.approveTime).toLocaleString()
                  : "-"}
              </TableCell>
              {filter === "pending" && (
                <TableCell
                  style={{ border: "1px solid black", padding: "10px" }}
                >
                  <Button
                    onClick={() => handleApprove(user._id)}
                    variant="contained"
                    color="primary"
                    style={{ margin: "5px" }}
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(user._id)}
                    variant="contained"
                    color="secondary"
                    style={{ margin: "5px", backgroundColor: "#f56e7b" }}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleDelete(user._id)}
                    variant="contained"
                    color="secondary"
                    style={{ backgroundColor: "#f56e7b" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              )}
              {filter !== "pending" && (
                <TableCell
                  style={{ border: "1px solid black", padding: "10px" }}
                >
                  <Button
                    onClick={() => handleApprove(user._id)}
                    variant="contained"
                    color="primary"
                    style={{ margin: "5px" }}
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(user._id)}
                    variant="contained"
                    color="secondary"
                    style={{ margin: "5px", backgroundColor: "#f56e7b" }}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleDelete(user._id)}
                    variant="contained"
                    color="secondary"
                    style={{ backgroundColor: "#f56e7b" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SignUpData;
