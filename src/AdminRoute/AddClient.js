import React, { useState } from "react";
import {
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles"; // Updated import

const useStyles = makeStyles((theme) => ({
  formContainer: {
    margin: "10px auto",
    padding: theme.spacing(2),
    boxShadow: "0px 0px 10px 2px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    borderRadius: 8,
    maxWidth: 'none',
  },
  textField: {
    marginBottom: theme.spacing(3),
    padding: '8px 16px',
  
  },
  errorText: {
    color: "red",
    marginBottom: theme.spacing(2),
  },
  radioGroup: {
    marginTop: theme.spacing(12),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

const AddClient = () => {
  const apiDomain = process.env.REACT_APP_API_DOMAIN;
  const apiPort = process.env.REACT_APP_API_PORT;
  const classes = useStyles();
  const [selectedPage, setSelectedPage] = useState("scm");
  const [formData, setFormData] = useState({
    "Canceled Client": "No",
    "Read Only": "No",
    "Data Center": "AZ",
    "Live-Not Live": "Y",
    "Time Zone Group": "W",
    "Site Name": "",
    "Code": "",
    "SQL Configuration": "AO-3",
    "Assigned Resource": "",
    "Citrix-Infra": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
    "SCM App Group 1 START": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
    "SCM App Group 2 - Complete": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
    "SCM App Group 2 - Complete (Enter EST Time in 24h format)": "",
    "SUN Component App Group Complete": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
    "Patch Reboots Complete (Enter EST Time in 24h format)": "",
    "Patch-Reboots Complete": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
    "C:drive cleanup (Cleanup on all servers including Gold Images)": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
    "Citrix Infra Validation": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
    "Azure VM State Check": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
    "Azure Gold Image Compliance Status": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
    "SCM App Validation": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
    "DB Validation": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
    "Monitoring ISS-E-Link Validation": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
    "Monitoring Alerts Validation": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
    "Maintenance Mode Disabled": {
      value: "Pending",
      updated: [{ name: "", timestamp: "" }],
    },
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (formData[name] && typeof formData[name] === "object") {
      setFormData({ ...formData, [name]: { ...formData[name], value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRadioChange = (e) => {
    setSelectedPage(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const numericFields = [
        "SCM App Group 2 - Complete (Enter EST Time in 24h format)",
        "Patch Reboots Complete (Enter EST Time in 24h format)",
      ];

      const validationErrors = numericFields
        .filter((field) => {
          const value = formData[field];
          return (
            typeof value === "string" && value.trim() !== "" && isNaN(value)
          );
        })
        .map((field) => `${field} must be a number if not empty.`);

      if (validationErrors.length > 0) {
        setError(validationErrors.join(" "));
        throw new Error(validationErrors.join(" "));
      }

      const isAnyFieldEmpty = Object.keys(formData).some((key) => {
        if (numericFields.includes(key)) return false;
        const value = formData[key];
        return typeof value === "string" && value.trim() === "";
      });

      if (isAnyFieldEmpty) {
        setError(
          "All fields are required except the two numeric fields which can be empty.",
        );
        throw new Error(
          "All fields are required except the two numeric fields which can be empty.",
        );
      }

      const postData = {
        selectedTracker: selectedPage,
        ...formData,
      };

      const response = await fetch(`${apiDomain}/api/user/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      setFormData({
        "Canceled Client": "No",
        "Read Only": "No",
        "Data Center": "AZ",
        "Live-Not Live": "Y",
        "Time Zone Group": "W",
        "Site Name": "",
        "Code": "",
        "SQL Configuration": "AO-3",
        "Assigned Resource": "",
        "Citrix-Infra": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
        "SCM App Group 1 START": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
        "SCM App Group 2 - Complete": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
        "SCM App Group 2 - Complete (Enter EST Time in 24h format)": "",
        "SUN Component App Group Complete": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
        "Patch Reboots Complete (Enter EST Time in 24h format)": "",
        "Patch-Reboots Complete": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
        "C:drive cleanup (Cleanup on all servers including Gold Images)": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
        "Citrix Infra Validation": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
        "Azure VM State Check": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
        "Azure Gold Image Compliance Status": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
        "SCM App Validation": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
        "DB Validation": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
        "Monitoring ISS-E-Link Validation": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
        "Monitoring Alerts Validation": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
        "Maintenance Mode Disabled": {
          value: "Pending",
          updated: [{ name: "", timestamp: "" }],
        },
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      <RadioGroup
        className={classes.radioGroup}
        value={selectedPage}
        onChange={handleRadioChange}
        row
      >
        <FormControlLabel value="scm" control={<Radio />} label="SCM" />
        <FormControlLabel value="tw" control={<Radio />} label="TW" />
        <FormControlLabel value="azure" control={<Radio />} label="Azure" />
        <FormControlLabel value="suncom" control={<Radio />} label="Suncom" />
        <FormControlLabel value="adhoc" control={<Radio />} label="Adhoc" />
        <FormControlLabel value="qts" control={<Radio />} label="QTS" />
      </RadioGroup>

      {selectedPage === "scm" && (
        <Grid container justifyContent="left" width="200%">
          <Grid item xs={12} md={8} lg={6}>
            <div className={classes.formContainer}>
              {error && <div className={classes.errorText}>{error}</div>}
              {Object.entries(formData).map(([label, value]) => (
                <Box mb={2} key={label} width="100%">
                 <TextField
                   className={classes.textField}
                   label={label}
                   value={typeof value === "object" ? value.value : value}
                   onChange={handleChange}
                   name={label}
                   fullWidth
                 />
               </Box>
              ))}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className={classes.submitButton}
                fullWidth
              >
                Save
              </Button>
            </div>
          </Grid>
        </Grid>
      )}

      {selectedPage === "tw" && <div>TW Page Content</div>}
      {selectedPage === "azure" && <div>Azure Page Content</div>}
      {selectedPage === "suncom" && <div>Suncom Page Content</div>}
      {selectedPage === "adhoc" && <div>Adhoc Page Content</div>}
      {selectedPage === "qts" && <div>QTS Page Content</div>}
    </div>
  );
};

export default AddClient;
