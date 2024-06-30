import React, { useState } from "react";
import { TextField, Button, makeStyles } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    marginTop: 40,
    padding: theme.spacing(2), // Add padding
    boxShadow: "0px 0px 10px 2px rgba(0,0,0,0.1)", // Add shadow
    backgroundColor: "#fff", // Add background color
    borderRadius: 8, // Add border radius for rounded corners
  },
  textField: {
    marginBottom: theme.spacing(2),
    minWidth: 200, // Set minimum width
  },
  errorText: {
    color: "red",
    marginBottom: theme.spacing(2), // Add margin to separate error messages
  },
}));

const AddClient = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    "Data Center": "",
    "Live/Not Live": "",
    "Time Zone Group": "",
    "Site Name": "",
    Code: "",
    "SQL Configuration": "",
    "Assigned Resource": "",
    "SCM App Group 1 START": "",
    "SCM App Group 2 - Complete": "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isAnyFieldEmpty = Object.values(formData).some(
        (value) => value.trim() === "",
      );
      if (isAnyFieldEmpty) {
        setError("All fields are required");
        throw new Error("All fields are required");
      }

      // Construct data to be sent to the server
      const postData = Object.entries(formData).reduce(
        (acc, [label, value]) => {
          acc[label] = value;
          return acc;
        },
        {},
      );

      const response = await fetch(
        `${apiDomain}/api/user/clients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData), // Send postData instead of formData
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      setFormData({
        "Data Center": "",
        "Live/Not Live": "",
        "Time Zone Group": "",
        "Site Name": "",
        Code: "",
        "SQL Configuration": "",
        "Assigned Resource": "",
        "SCM App Group 1 START": "",
        "SCM App Group 2 - Complete": "",
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className={classes.formContainer}>
      {error && <div className={classes.errorText}>{error}</div>}
      {Object.entries(formData).map(([label, value]) => (
        <TextField
          key={label}
          className={classes.textField}
          label={label}
          value={value}
          onChange={handleChange}
          name={label}
          fullWidth
        />
      ))}
      {/* <TextField
        className={classes.textField}
        label="Live/Not Live"
        name="liveOrNotLive"
        value={formData.liveOrNotLive}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        className={classes.textField}
        label="Time Zone Group"
        name="timeZoneGroup"
        value={formData.timeZoneGroup}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        className={classes.textField}
        label="Site Name"
        name="siteName"
        value={formData.siteName}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        className={classes.textField}
        label="Code"
        name="code"
        value={formData.code}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        className={classes.textField}
        label="SQL Configuration"
        name="sqlConfiguration"
        value={formData.sqlConfiguration}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        className={classes.textField}
        label="Assigned Resource"
        name="assignedResource"
        value={formData.assignedResource}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        className={classes.textField}
        label="SCM App Group 1 START"
        name="scmAppGroup1Start"
        value={formData.scmAppGroup1Start}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        className={classes.textField}
        label="SCM App Group 2 - Complete"
        name="scmAppGroup2Complete"
        value={formData.scmAppGroup2Complete}
        onChange={handleChange}
        fullWidth
      /> */}

      {/* Add similar TextField components for other fields */}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
};

export default AddClient;
