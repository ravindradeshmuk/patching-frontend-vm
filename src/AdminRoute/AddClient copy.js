import React, { useState } from "react";
import { Typography, Grid, Box } from "@mui/material";
import { FormContainer, CustomTextField, ErrorText, CustomRadioGroup, CustomFormControlLabel, CustomRadio, SubmitButton } from './StyledComponents';

const AddClient = () => {
  const apiDomain = process.env.REACT_APP_API_DOMAIN;
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
      <CustomRadioGroup value={selectedPage} onChange={handleRadioChange} row>
        <CustomFormControlLabel value="scm" control={<CustomRadio />} label="SCM" />
        <CustomFormControlLabel value="tw" control={<CustomRadio />} label="TW" />
        <CustomFormControlLabel value="azure" control={<CustomRadio />} label="Azure" />
        <CustomFormControlLabel value="suncomm" control={<CustomRadio />} label="Suncomm" />
        <CustomFormControlLabel value="aus" control={<CustomRadio />} label="Aus" />
        <CustomFormControlLabel value="adhoc" control={<CustomRadio />} label="Adhoc" />
        <CustomFormControlLabel value="qts" control={<CustomRadio />} label="QTS" />
      </CustomRadioGroup>

      {selectedPage === "scm" && (
        <Grid container justifyContent="left" width="200%">
          <Grid item xs={12} md={8} lg={6}>
            <FormContainer>
              {error && <ErrorText>{error}</ErrorText>}
              {Object.entries(formData).map(([label, value]) => (
                <Box mb={2} key={label} width="100%">
                  <CustomTextField
                    label={label}
                    value={typeof value === "object" ? value.value : value}
                    onChange={handleChange}
                    name={label}
                    fullWidth
                  />
                </Box>
              ))}
              <SubmitButton
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
              >
                Save
              </SubmitButton>
            </FormContainer>
          </Grid>
        </Grid>
      )}

      {selectedPage === "tw" && <div>TW Page Content</div>}
      {selectedPage === "azure" && <div>Azure Page Content</div>}
      {selectedPage === "suncomm" && <div>Suncomm Page Content</div>}
      {selectedPage === "aus" && <div>Aus Page Content</div>}
      {selectedPage === "adhoc" && <div>Adhoc Page Content</div>}
      {selectedPage === "qts" && <div>QTS Page Content</div>}
    </div>
  );
};

export default AddClient;
