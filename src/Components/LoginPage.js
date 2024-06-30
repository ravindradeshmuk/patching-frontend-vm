import React, { useState, useContext } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Components/UserContext";

const apiDomain = process.env.REACT_APP_API_DOMAIN;
const apiPort = process.env.REACT_APP_API_PORT;
const LoginPage = () => {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [loginDialogOpen, setLoginDialogOpen] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success', 'error'
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginFormChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post(
        `${apiDomain}/user/api/login`,
        loginFormData,
      );
      const { token, firstName, role } = response.data;
      login(token, firstName);

      setSnackbarMessage("Login successful");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setLoginDialogOpen(false);
      // Redirect to the intended page or default to home
      const from = location.state?.from?.pathname || "/home";
      navigate(from, { replace: true });
      // Redirect based on role
      if (role === "admin") {
        navigate("/admindashboard/dashbord");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setSnackbarMessage("Login failed, please try again");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleLoginDialogToggle = () => {
    setLoginDialogOpen(!loginDialogOpen);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Dialog open={loginDialogOpen} onClose={handleLoginDialogToggle}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent sx={{ minWidth: "400px" }}>
          <TextField
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            name="email"
            value={loginFormData.email}
            onChange={handleLoginFormChange}
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            name="password"
            value={loginFormData.password}
            onChange={handleLoginFormChange}
            sx={{ marginBottom: "16px" }}
          />
        </DialogContent>
        <DialogActions>
          <Link to="/home">
            <Button onClick={handleLoginDialogToggle} sx={{ color: "#000000" }}>
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleLoginSubmit}
            sx={{
              color: "#fff",
              backgroundColor: "#393392",
              "&:hover": { backgroundColor: "#2c2c7e" },
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
