import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, CssBaseline, Snackbar, Alert, Typography, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tab, Tabs } from '@mui/material';

const apiDomain = process.env.REACT_APP_API_DOMAIN;

const HomePage = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [instructions, setInstructions] = useState('');
  const [clients, setClients] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);

  useEffect(() => {
    const message = localStorage.getItem('signupSuccessMessage');
    if (message) {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
      localStorage.removeItem('signupSuccessMessage');
    }

    const fetchClientData = async () => {
      try {
        const response = await axios.get(`${apiDomain}/client/data/api/tableData?includeId=true`);
        setClients(response.data);
        setPendingItems(response.data);
      } catch (error) {
        console.error('Error fetching client data', error);
      }
    };
    fetchClientData();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSaveInstructions = async () => {
    try {
      await axios.post(`${apiDomain}/special-instructions`, { instructions });
      alert('Instructions saved');
    } catch (error) {
      console.error('Error saving instructions', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <Container component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="User Dashboard" />
          <Tab label="Special Instructions" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {tabIndex === 0 && (
            <Box>
              <Typography variant="h4">Pending Items</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pending Activity</TableCell>
                    <TableCell>No. of Clients</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item['Pending Activity']}</TableCell>
                      <TableCell>{item['No. of Clients']}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
          {tabIndex === 1 && (
            <Box>
              <Typography variant="h4">Special Instructions</Typography>
              <TextField
                label="Instructions"
                multiline
                rows={4}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                fullWidth
              />
              <Button variant="contained" color="primary" onClick={handleSaveInstructions} sx={{ mt: 2 }}>
                Save
              </Button>
            </Box>
          )}
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default HomePage;
