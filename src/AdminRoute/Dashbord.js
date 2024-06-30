import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import { Radio, RadioGroup, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, TextField, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { withStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InfoIcon from '@mui/icons-material/Info';


const StyledTableCell = withStyles((theme) => ({
  emailAdminColumn: {
    width: '30%',
  },
  head: {
    backgroundColor: "#151744",
    color: '#fff',
    border: '1px solid black',
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    border: '1px solid black',
    padding: '8px',
    textAlign: 'center',
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const styles = {
  tableContainer: {
    width: '100vw',
    boxSizing: 'border-box',
    padding: '30px',
    marginTop:"40px"
  },
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
};

const EmailStatusLabel = withStyles(() => ({
  root: {
    marginRight: '10px',
  },
}))(Button);

const Dashbord = () => {
  const apiDomain = process.env.REACT_APP_API_DOMAIN;
  const [selectedZone, setSelectedZone] = useState(localStorage.getItem('selectedZone') || 'east');
  const [selectedClients, setSelectedClients] = useState(() => {
    const saved = localStorage.getItem('selectedClients');
    return saved ? JSON.parse(saved) : [];
  });
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const apiDomain = process.env.REACT_APP_API_DOMAIN;
    const fetchClients = async () => {
      let finalData = [];
      try {
        const { data } = await axios.get(`${apiDomain}/client/data/api/tableData?includeId=true`);
        const liveClients = data.filter(client => client["Live/Not Live"] === "Live");
        const internalStakeholders = liveClients.filter(client => 
          client["Site Name"] === "Internal Stakeholders" && client["Time Zone Group"] === "Both"
        );
        const zoneFilteredClients = liveClients.filter(client =>
          (client["Time Zone Group"].toLowerCase() === selectedZone.toLowerCase() || client["Time Zone Group"] === "Both") &&
          client["Site Name"] !== "Internal Stakeholders"
        );
        const combinedClients = [...internalStakeholders, ...zoneFilteredClients];
        finalData = combinedClients.map(client => ({
          id: client._id,
          name: client["Site Name"],
          zone: client["Time Zone Group"].toLowerCase(),
          emailSent: 'NA',
          lastStatus: 'Pending',
          time: moment().tz('America/New_York').format('hh:mm A'),
        }));
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
      if (searchTerm) {
        const searchTerms = searchTerm.split(';').map(term => term.trim().toLowerCase());
        const filteredClients = finalData.filter(client =>
          searchTerms.some(term => client.name.toLowerCase().includes(term))
        );
        setClients(filteredClients);
      } else {
        setClients(finalData);
      }
    };
    fetchClients();
  }, [selectedZone, searchTerm]);

  const handleZoneChange = (event) => {
    setSelectedZone(event.target.value);
    localStorage.setItem('selectedZone', event.target.value);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedClients = clients.map(n => n.id);
      setSelectedClients(newSelectedClients);
    } else {
      setSelectedClients([]);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedClients.indexOf(id);
    let newSelected = [...selectedClients];
    if (selectedIndex === -1) {
      newSelected.push(id);
    } else {
      newSelected.splice(selectedIndex, 1);
    }
    setSelectedClients(newSelected);
    localStorage.setItem('selectedClients', JSON.stringify(newSelected));
  };

  const isSelected = (id) => selectedClients.includes(id);

  const getCurrentTime = () => {
    return moment().tz('America/New_York').format('hh:mm A');
  };

  const updateClientStatus = (id, action) => {
    const now = getCurrentTime();
    const updatedClients = clients.map(client => {
      if (client.id === id) {
        let updatedStatus = '';
        switch (action) {
          case 'send':
            updatedStatus = 'Sent';
            break;
          case 'discard':
            updatedStatus = 'Discarded';
            break;
          case 'reject':
            updatedStatus = 'Rejected';
            break;
          case 'fetch':
            updatedStatus = 'NA';
            break;
          default:
            return client;
        }
        return { ...client, emailSent: updatedStatus, time: now };
      } else {
        return client;
      }
    });
    setClients(updatedClients);
  };

  const getLabelColor = (emailSentStatus) => {
    switch (emailSentStatus) {
      case 'Sent':
        return 'primary';
      case 'Discarded':
        return 'secondary';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSendEmail = async (id) => {
    try {
      const response = await axios.post(`${apiDomain}/user/mail/send-email`, { itemId: id });
      updateClientStatus(id, 'send');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div component={Paper} style={styles.tableContainer}>
      <h1>SCM Patching Notification</h1>
      <RadioGroup row value={selectedZone} onChange={handleZoneChange}>
        <FormControlLabel value="east" control={<Radio />} label="East zone client" />
        <FormControlLabel value="west" control={<Radio />} label="West zone client" />
      </RadioGroup>
      <Box style={styles.flexContainer}>
        <TextField
          fullWidth
          label="Search Clients"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search multiple clients with semicolon (;) delimiter"
        />
        <Button color="primary" style={{ backgroundColor: '#151744', color: '#ffffff', margin:'10px' }}>
          Schedule
        </Button>
      </Box>
      <TableContainer component={Paper} style={{ width: '100%', padding: '16px 20px 20px 20px' }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedClients.length > 0 && selectedClients.length < clients.length}
                  checked={selectedClients.length === clients.length && clients.length !== 0}
                  onChange={handleSelectAllClick}
                />
              </StyledTableCell>
              <StyledTableCell><b>Client Name</b></StyledTableCell>
              <StyledTableCell><b>Time Stamp - ET</b></StyledTableCell>
              <StyledTableCell><b>Last Status</b></StyledTableCell>
              <StyledTableCell><b>Email Administration</b></StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => {
              const isItemSelected = isSelected(client.id);
              let emailAdminContent;
              switch (client.emailSent) {
                case 'NA':
                  emailAdminContent = (
                    <>
                      <EmailStatusLabel disabled color="default">The Email is Ready to be sent</EmailStatusLabel>
                      <Button variant="contained" color="primary" onClick={() => handleSendEmail(client.id)} style={{ marginRight: '10px', backgroundColor: '#151744', color: '#ffffff' }}>Send</Button>
                      <Button variant="contained" color="secondary" onClick={() => updateClientStatus(client.id, 'reject')} style={{ backgroundColor: '#f56e7b', color: '#ffffff' }}>Reject</Button>
                    </>
                  );
                  break;
                case 'Sent':
                  emailAdminContent = (
                    <>
                      <EmailStatusLabel disabled color={getLabelColor(client.emailSent)}>Sent Email Successfully</EmailStatusLabel>
                      <Button variant="contained" onClick={() => updateClientStatus(client.id, 'discard')}>Disregard</Button>
                    </>
                  );
                  break;
                case 'Discarded':
                  emailAdminContent = (
                    <>
                      <EmailStatusLabel disabled color={getLabelColor(client.emailSent)}>Disregard Email Sent</EmailStatusLabel>
                      <Button variant="contained" onClick={() => updateClientStatus(client.id, 'fetch')}>Fetch</Button>
                    </>
                  );
                  break;
                case 'Rejected':
                  emailAdminContent = (
                    <>
                      <EmailStatusLabel disabled color={getLabelColor(client.emailSent)}>Email Rejected</EmailStatusLabel>
                      <Button variant="contained" onClick={() => updateClientStatus(client.id, 'fetch')}>Fetch</Button>
                    </>
                  );
                  break;
                default:
                  emailAdminContent = null;
              }

              return (
                <StyledTableRow
                  key={client.id}
                  hover
                  onClick={(event) => handleClick(event, client.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  selected={isItemSelected}
                >
                  <StyledTableCell padding="checkbox">
                    <Checkbox checked={isItemSelected} />
                  </StyledTableCell>
                  <StyledTableCell>{client.name}</StyledTableCell>
                  <StyledTableCell>{client.time}</StyledTableCell>
                  <StyledTableCell>{client.lastStatus}</StyledTableCell>
                  <StyledTableCell>{emailAdminContent}</StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashbord;
