import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";

function UserLogin({ isOpen, onClose }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const apiDomain = process.env.REACT_APP_API_DOMAIN;
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${apiDomain}/user/login/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        },
      );
      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
        onClose();
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">User Login</DialogTitle>
      <form onSubmit={handleLogin}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            name="username"
            value={credentials.username}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Log In
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UserLogin;
