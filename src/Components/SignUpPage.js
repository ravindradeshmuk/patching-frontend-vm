import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment-timezone";

const SignUpPage = () => {
  const apiDomain = process.env.REACT_APP_API_DOMAIN;
  const [signupFormData, setSignupFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    team: "",
    role: "user",
    signupTime: "",
    timezone: "",
    approveTime: "pending",
    status: "pending",
  });
  const [signupDialogOpen, setSignupDialogOpen] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    const signupTime = moment().tz("America/New_York").format("YYYY-MM-DD HH:mm");
    const timezone = "America/New_York";
    setSignupFormData((prevState) => ({
      ...prevState,
      signupTime,
      timezone,
    }));
  }, []);

  const handleSignupFormChange = (e) => {
    const { name, value } = e.target;
    setSignupFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!signupFormData.email.endsWith("@alterahealth.com")) {
        setSnackbarMessage(
          'Please use an email address with the domain "@alterahealth.com"',
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const response = await axios.post(
        `${apiDomain}/user/api/signup`,
        signupFormData,
      );
      console.log("Signup response:", response.data);

      setSignupFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        team: "",
        role: "user",
        signupTime: "",
        timezone: "",
        approveTime: "pending",
        status: "pending",
      });

      // Set snackbar message and store it in localStorage
      const successMessage =
        "Registration successful. Please wait for the admin to approve your account.";
      setSnackbarMessage(successMessage);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      localStorage.setItem("signupSuccessMessage", successMessage);

      // Navigate to /home after a short delay
      setTimeout(() => {
        navigate("/home");
      }, 500); // Short delay to ensure state updates
    } catch (error) {
      console.error("Error signing up:", error);
      setSnackbarMessage("Error signing up, please try again");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSignupDialogToggle = () => {
    setSignupDialogOpen(!signupDialogOpen);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={signupDialogOpen} onClose={handleSignupDialogToggle}>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent sx={{ minWidth: "400px" }}>
          <TextField
            margin="dense"
            id="firstName"
            label="First Name"
            type="text"
            fullWidth
            name="firstName"
            value={signupFormData.firstName}
            onChange={handleSignupFormChange}
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            margin="dense"
            id="lastName"
            label="Last Name"
            type="text"
            fullWidth
            name="lastName"
            value={signupFormData.lastName}
            onChange={handleSignupFormChange}
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            name="email"
            value={signupFormData.email}
            onChange={handleSignupFormChange}
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            margin="dense"
            id="password"
            label="Password Min 8 character"
            type="password"
            fullWidth
            name="password"
            value={signupFormData.password}
            onChange={handleSignupFormChange}
            sx={{ marginBottom: "16px" }}
          />
          <FormControl fullWidth sx={{ marginBottom: "16px" }}>
            <InputLabel id="team-select-label">Team</InputLabel>
            <Select
              labelId="team-select-label"
              id="team"
              name="team"
              value={signupFormData.team}
              onChange={handleSignupFormChange}
              label="Select Team"
            >
              <MenuItem value="">
                <em>Select Team</em>
              </MenuItem>
              <MenuItem value="Altera DB Team">Altera DB Team</MenuItem>
              <MenuItem value="Altera Monitoring Team">Altera Monitoring Team</MenuItem>
              <MenuItem value="Altera Patching Team">Altera Patching Team</MenuItem>
              <MenuItem value="Suncomm Team">Suncomm Team</MenuItem>
              <MenuItem value="Sunrise App Team">Sunrise App Team</MenuItem>
              <MenuItem value="Opal Team">Opal Team</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Link to="/home">
            <Button
              onClick={handleSignupDialogToggle}
              sx={{ color: "#000000" }}
            >
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSignupSubmit}
            sx={{
              color: "#fff",
              backgroundColor: "#393392",
              "&:hover": { backgroundColor: "#2c2c7e" },
            }}
          >
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SignUpPage;
