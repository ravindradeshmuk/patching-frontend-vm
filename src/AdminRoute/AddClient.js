import React, { useState, useEffect } from "react";
import { TextField, RadioGroup, FormControlLabel, Radio, Button, Typography, Grid, Box } from "@mui/material";
import { styled } from "@mui/system";

export const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: '800px',
  marginTop: '20px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
}));

export const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2),
}));

export const CustomRadioGroup = styled(RadioGroup)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: '2px',
}));

export const CustomRadioGroup1 = styled(RadioGroup)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: '130px',
}));

export const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

export const CustomRadio = styled(Radio)(({ theme }) => ({}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));


const AddClient = () => {
  const apiDomain = process.env.REACT_APP_API_DOMAIN;
  const [selectedPage, setSelectedPage] = useState("scm");
  const [headings, setHeadings] = useState([]);
  const [formData, setFormData] = useState({});
  const [dataTypes, setDataTypes] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const apiDomain = process.env.REACT_APP_API_DOMAIN;
        const response = await fetch(`${apiDomain}/api/trackerConfig/${selectedPage}`);
        const data = await response.json();
        setHeadings(data.headings);
        const initialDataTypes = {};
        data.headings.forEach((heading) => {
          initialDataTypes[heading] = 'string';
        });
        setDataTypes(initialDataTypes);
      } catch (error) {
        console.error("Error fetching headings:", error);
        setHeadings([]);
        setError("Failed to load headings");
      }
    };

    fetchHeadings();
  }, [selectedPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (dataTypes[name] === 'object') {
      setFormData({ ...formData, [name]: { value, updated: [{ name: '', timestamp: '' }] } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRadioChange = (heading, value) => {
    setDataTypes({ ...dataTypes, [heading]: value });
    if (value === 'object') {
      setFormData({ ...formData, [heading]: { value: 'Pending', updated: [{ name: '', timestamp: '' }] } });
    } else {
      setFormData({ ...formData, [heading]: '' });
    }
  };

  const handleSubmit = async () => {
    try {
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

      setFormData({});
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      <CustomRadioGroup1 value={selectedPage} onChange={(e) => setSelectedPage(e.target.value)} row>
        <CustomFormControlLabel value="scm" control={<CustomRadio />} label="SCM" />
        <CustomFormControlLabel value="tw" control={<CustomRadio />} label="TW" />
        <CustomFormControlLabel value="azure" control={<CustomRadio />} label="Azure" />
        <CustomFormControlLabel value="suncomm" control={<CustomRadio />} label="Suncomm" />
        <CustomFormControlLabel value="aus" control={<CustomRadio />} label="Aus" />
        <CustomFormControlLabel value="adhoc" control={<CustomRadio />} label="Adhoc" />
        <CustomFormControlLabel value="qts" control={<CustomRadio />} label="QTS" />
      </CustomRadioGroup1>

      {selectedPage === "scm" && (
        <Grid container justifyContent="left">
          <Grid item xs={12} md={8} lg={6}>
            <FormContainer>
              {error && <ErrorText>{error}</ErrorText>}
              {headings.map((heading) => (
                <Box mb={2} key={heading} width="100%">
                  <Typography>{heading}</Typography>
                  <CustomRadioGroup
                    row
                    value={dataTypes[heading]}
                    onChange={(e) => handleRadioChange(heading, e.target.value)}
                  >
                    <CustomFormControlLabel value="string" control={<CustomRadio />} label="String" />
                    <CustomFormControlLabel value="object" control={<CustomRadio />} label="Object" />
                  </CustomRadioGroup>
                  <CustomTextField
                    label={heading}
                    value={formData[heading] ? (dataTypes[heading] === 'object' ? formData[heading].value : formData[heading]) : ""}
                    onChange={handleChange}
                    name={heading}
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
