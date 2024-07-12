import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, Tab, Box, Typography, RadioGroup, FormControlLabel, Radio, Button, TextField, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';

const apiDomain = process.env.REACT_APP_API_DOMAIN;

const TrackerContainer = styled(Container)({
  padding: '40px',
  maxWidth: '800px',
  marginTop: '20px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
});

const StyledTabPanel = styled(Box)({
  padding: '20px',
  marginTop: '10px',
});

const CustomTextField = styled(TextField)({
  marginBottom: '10px',
  width: 'calc(100% - 100px)',
  marginRight: '10px',
});

const StyledButton = styled(Button)({
  backgroundColor: '#1976d2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
  margin: '10px 0',
  marginRight: '10px',
});

const StyledTableContainer = styled(TableContainer)({
  marginTop: '20px',
  maxHeight: '400px',
});

const StyledTableCell = styled(TableCell)({
  padding: '10px',
});

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f9f9f9',
  },
});

const CreateTracker = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTracker, setSelectedTracker] = useState('');
  const [headings, setHeadings] = useState([{ value: '' }]);
  const [existingHeadings, setExistingHeadings] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [trackerError, setTrackerError] = useState('');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleTrackerChange = (event) => {
    setSelectedTracker(event.target.value);
    setFetchError('');
    setTrackerError('');
  };

  const handleHeadingChange = (index, event) => {
    const newHeadings = [...headings];
    newHeadings[index].value = event.target.value;
    setHeadings(newHeadings);
  };

  const addHeadingField = () => {
    setHeadings([...headings, { value: '' }]);
  };

  const removeHeadingField = (index) => {
    const newHeadings = [...headings];
    newHeadings.splice(index, 1);
    setHeadings(newHeadings);
  };

  const handleAddHeadings = async () => {
    if (!selectedTracker) {
      setTrackerError('Please select a product to add headings.');
      return;
    }

    try {
      await axios.post(`${apiDomain}/api/trackerConfig`, {
        product: selectedTracker,
        headings: headings.map(h => h.value).filter(h => h.trim() !== ''),
      });
      setHeadings([{ value: '' }]);
      fetchHeadings();
    } catch (error) {
      console.error('Error adding headings:', error);
    }
  };

  const fetchHeadings = useCallback(async () => {
    if (selectedTracker) {
      try {
        const response = await axios.get(`${apiDomain}/api/trackerConfig/${selectedTracker}`);
        setExistingHeadings(response.data.headings);
      } catch (error) {
        console.error('Error fetching headings:', error);
        setFetchError('Failed to fetch headings. Please try again later.');
      }
    }
  }, [selectedTracker]);

  useEffect(() => {
    if (selectedTab === 1 && selectedTracker) {
      fetchHeadings();
    }
  }, [selectedTab, selectedTracker, fetchHeadings]);

  const handleUpdateHeading = async (index, newHeading) => {
    const updatedHeadings = [...existingHeadings];
    updatedHeadings[index] = newHeading;
    try {
      await axios.put(`${apiDomain}/api/trackerConfig/${selectedTracker}`, {
        headings: updatedHeadings,
      });
      setExistingHeadings(updatedHeadings);
    } catch (error) {
      console.error('Error updating heading:', error);
    }
  };

  const handleDeleteHeading = async (index) => {
    const updatedHeadings = [...existingHeadings];
    updatedHeadings.splice(index, 1);
    try {
      await axios.put(`${apiDomain}/api/trackerConfig/${selectedTracker}`, {
        headings: updatedHeadings,
      });
      setExistingHeadings(updatedHeadings);
    } catch (error) {
      console.error('Error deleting heading:', error);
    }
  };

  return (
    <TrackerContainer component={Paper}>
      <Typography variant="h4" component="h1" gutterBottom>
        Patching Products
      </Typography>
      <RadioGroup row aria-label="tracker" name="tracker" value={selectedTracker} onChange={handleTrackerChange}>
        <FormControlLabel value="scm" control={<Radio />} label="SCM" />
        <FormControlLabel value="tw" control={<Radio />} label="TW" />
        <FormControlLabel value="azure" control={<Radio />} label="Azure" />
        <FormControlLabel value="suncomm" control={<Radio />} label="Suncomm" />
        <FormControlLabel value="aus" control={<Radio />} label="Aus" />
        <FormControlLabel value="adhoc" control={<Radio />} label="Adhoc" />
        <FormControlLabel value="qts" control={<Radio />} label="QTS" />
      </RadioGroup>
      {trackerError && <Typography color="error">{trackerError}</Typography>}

      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="tracker tabs">
        <Tab label="Add Headings" />
        <Tab label="View/Edit Headings" />
      </Tabs>

      {selectedTab === 0 && (
        <StyledTabPanel>
          {headings.map((heading, index) => (
            <Box key={index} display="flex" alignItems="center">
              <CustomTextField
                label={`Heading ${index + 1}`}
                value={heading.value}
                onChange={(e) => handleHeadingChange(index, e)}
                error={!heading.value.trim()}
                helperText={!heading.value.trim() ? 'Enter heading name' : ''}
              />
              <Button onClick={() => removeHeadingField(index)}>Remove</Button>
            </Box>
          ))}
          <StyledButton onClick={addHeadingField}>Add Heading</StyledButton>
          <StyledButton onClick={handleAddHeadings}>Save Headings</StyledButton>
        </StyledTabPanel>
      )}

      {selectedTab === 1 && (
        <StyledTabPanel>
          {fetchError && <Typography color="error">{fetchError}</Typography>}
          <StyledTableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Heading</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {existingHeadings.map((heading, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>
                      <CustomTextField
                        value={heading}
                        onChange={(e) => handleUpdateHeading(index, e.target.value)}
                        fullWidth
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button onClick={() => handleDeleteHeading(index)}>Delete</Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </StyledTabPanel>
      )}
    </TrackerContainer>
  );
};

export default CreateTracker;
