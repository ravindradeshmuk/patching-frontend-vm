import React, { useState, useEffect } from "react";
import { Typography, Grid, Box } from "@mui/material";
import { FormContainer, CustomTextField, ErrorText, CustomRadioGroup, CustomFormControlLabel, CustomRadio, SubmitButton } from './StyledComponents';

const AddClient = () => {
  const apiDomain = process.env.REACT_APP_API_DOMAIN;
  const [selectedPage, setSelectedPage] = useState("scm");
  const [headings, setHeadings] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  

  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await fetch(`${apiDomain}/api/trackerConfig/${selectedPage}`);
        const data = await response.json();
        setHeadings(data.headings);

        const initialFormData = {};
        data.headings.forEach((heading) => {
          if ([
            "Canceled Client",
            "Read Only",
            "Data Center",
            "Live-Not Live",
            "Time Zone Group",
            "Site Name",
            "Code",
            "SQL Configuration",
            "Assigned Resource",
          ].includes(heading) || heading.includes("(Enter EST Time in 24h format)")) {
            initialFormData[heading] = "";
          } else {
            initialFormData[heading] = { value: "Pending", updated: [{ name: "", timestamp: "" }] };
          }
        });
        setFormData(initialFormData);
      } catch (error) {
        console.error("Error fetching headings:", error);
      }
    };

    fetchHeadings();
  }, [selectedPage, apiDomain]);

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
      const numericFields = headings.filter(heading => heading.includes("(Enter EST Time in 24h format)"));

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
          "All fields are required except the numeric fields which can be empty.",
        );
        throw new Error(
          "All fields are required except the numeric fields which can be empty.",
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
      // Clear form data after successful save
      const initialFormData = {};
      headings.forEach((heading) => {
        if ([
          "Canceled Client",
          "Read Only",
          "Data Center",
          "Live-Not Live",
          "Time Zone Group",
          "Site Name",
          "Code",
          "SQL Configuration",
          "Assigned Resource",
        ].includes(heading) || heading.includes("(Enter EST Time in 24h format)")) {
          initialFormData[heading] = "";
        } else {
          initialFormData[heading] = { value: "Pending", updated: [{ name: "", timestamp: "" }] };
        }
      });
      setFormData({});
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

      {headings.length > 0 && (
        <Grid container justifyContent="left" width="200%">
          <Grid item xs={12} md={8} lg={6}>
            <FormContainer>
              {error && <ErrorText>{error}</ErrorText>}
              {headings.map((label) => (
                <Box mb={2} key={label} width="100%">
                  <CustomTextField
                    label={label}
                    value={typeof formData[label] === "object" ? formData[label].value : formData[label]}
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
    </div>
  );
};

export default AddClient;
