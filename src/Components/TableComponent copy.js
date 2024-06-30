import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InfoIcon from '@mui/icons-material/Info';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TableContainer,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
  } from '@mui/material';
  import {makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    width: '100%',
    border: '1px solid #ddd',
    margin: "50px 0px 20px 0px ",
  },
  headerCell: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    textAlign: 'center',
    border: '1px solid #ddd',
    maxWidth: 100,
    padding: '2px 2px',
  },
  alphabetHeaderCell: {
    backgroundColor: '#E3F2FD',
    color: theme.palette.common.black,
    fontWeight: 'bold',
    textAlign: 'center',
    border: '1px solid black',
    padding: '2px 2px',
  },
  cell: {
    textAlign: 'center',
    border: '1px solid ',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '2px 2px',
    maxWidth: 400,
  },
  tableContainer: {
    overflowX: 'auto',
  },
  dropdownCell: {
    width: 100,
    maxWidth: 100,
    overflow: 'hidden',
    padding: '2px 2px',
  },
  select: {
    height: '30px', // Set a specific height if needed
    lineHeight: '200px', // Adjust line-height to match the height
    padding: 0, // Remove padding
    margin: 0, // Remove margin
    flexGrow: 1, // Allow select to take up remaining space
    //marginRight: theme.spacing(0.2),
    width: '50%',
    backgroundColor: '#FFF',
    '& .MuiSelect-icon': {
      color: theme.palette.action.active,
    },
  },
  inputTime: {
    width: '100%',
  },
  specialRowLabel: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: '#FFFFFF',
    backgroundColor: '#393392',
    right: "100px",
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
    
  },
  stickyColumnSecond: {
    position: 'sticky',
    left: '200px',
    backgroundColor: theme.palette.background.paper,
    zIndex: 2,
  },
  timeInput: {
    width: '23%',
    height: '20px',
    padding: '2px 2px',
    margin: '2px 0',
    fontSize: '2rem',
    borderColor: theme.palette.primary.light,
    borderRadius: '2px',
    paddingLeft: '100px',
  },
  setTimeButton: {
    height: '40px',
    margin: '5px 0',
    fontSize: '0.875rem',
    textTransform: 'none',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '10px',
    width: "300px",
    textAlign: 'center',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '10px',
  },
  button: {
    flex: 1,
  },
  buttonsave: {
    display: 'flex',
  },
  infoButton: {
    padding: 0, // Remove padding
    margin: 0, // Remove margin
    minWidth: 'auto', // Ensure no minimum width is set
    
  },
  dropdownContainer: {
    height: '10px', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Ensures proper spacing between elements
    padding: '0px', // Adjust as needed to reduce overall padding
    width: '100%',
  },
  dialogContent: {
    overflow: 'auto',
    
  },
  stickyHeader: {
    position: "sticky",
    top: 5,
    background: "white",
    zIndex: 1,
    fontWeight: 'bold',
  },
  tableCell: {
    whiteSpace: "nowrap",
    padding: '4px 8px',
  },
}));

function TableComponent() {
  const apiDomain = process.env.REACT_APP_API_DOMAIN;
  const apiPort = process.env.REACT_APP_API_PORT;
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [tableData, setTableData] = useState([]);
  const [tableHeadings, setTableHeadings] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentEditing, setCurrentEditing] = useState({ rowIndex: null, columnName: '' });
  const [manualTime, setManualTime] = useState('');
  const [previousData, setPreviousData] = useState([]);
  const [loginBy, setLoginBy] = useState('current_user');
  const [changeHistory, setChangeHistory] = useState([]);
  const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);

  const currentTime = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const transformData = (data) => {
    return data.map(item => {
      const newItem = { ...item };
      for (const key in newItem) {
        if (newItem[key] && typeof newItem[key] === 'object' && 'value' in newItem[key]) {
          newItem[key] = newItem[key].value;
        } else if (newItem[key] && typeof newItem[key] === 'object') {
          newItem[key] = JSON.stringify(newItem[key].value);
        }
      }
      return newItem;
    });
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiDomain}/client/data/api/tableData?includeId=true`);
      if (response.status !== 200) throw new Error('Network response was not ok');

      const rawData = response.data;
      const transformedData = transformData(rawData);

      const readOnlyData = transformedData.filter(row =>
        row["Read Only"] === "Yes" && row["selectedTracker"] === "scm"
      );

      const eastData = transformedData.filter(row =>
        row["Time Zone Group"] === "E" &&
        row["Read Only"] === "No" &&
        row["selectedTracker"] === "scm"
      );

      const westData = transformedData.filter(row =>
        row["Time Zone Group"] === "W" &&
        row["Read Only"] === "No" &&
        row["selectedTracker"] === "scm"
      );

      const headings = transformedData.length > 0 ? Object.keys(transformedData[0]).filter(key => key !== '_id' && key !== '__v' && key !== 'Read Only' && key !== 'selectedTracker' && key !== 'Canceled Client') : [];

      setTableHeadings(headings);
      setTableData([
        { specialRow: true, label: 'READ-ONLY CLIENTS, PATCHING WINDOW 11 PM to 1 AM ET', type: 'Read Only' },
        ...readOnlyData,
        { specialRow: true, label: 'EAST ZONE, PATCHING WINDOW 2 AM to 4 AM ET', type: 'east' },
        ...eastData,
        { specialRow: true, label: 'WEST ZONE, PATCHING WINDOW 4 AM to 6 AM ET', type: 'west' },
        ...westData,
      ]);
      setPreviousData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const apiDomain = process.env.REACT_APP_API_DOMAIN;
    const fetchLoginNames = async () => {
      try {
        const response = await axios.get(`${apiDomain}/client/data/names`);

        const { firstName, lastName } = response.data;
        setLoginBy(`${firstName} ${lastName}`);

        console.log(firstName, lastName);
      } catch (error) {
        console.error('Error fetching login names:', error);
      }
    };
    fetchLoginNames();
  }, []);
  // Frontend code
 
  const handleDropdownChange = async (event, rowIndex, columnName) => {
    const value = event.target.value;
    const newData = [...tableData];
    const rowId = newData[rowIndex]._id;
    const clientName = newData[rowIndex]["Site Name"];
    const nestedObject = newData[rowIndex][columnName];
    // const loginBy = 'your_login_name'; // Replace with the actual login name
  
    // Update the local state
    if (Array.isArray(nestedObject)) {
      const obj = nestedObject.find((obj) => obj.value === 'pending');
      if (obj) {
        obj.value = value;
      } else {
        nestedObject.push({
          value: value,
          updated: [{
            name: clientName,
            timestamp:currentTime,
            loginBy: loginBy,
            newValue: value
          }]
        });
      }
    } else if (typeof nestedObject === 'object' && nestedObject !== null) {
      nestedObject.value = value;
      nestedObject.updated = [{
        name: clientName,
        timestamp:currentTime,
        loginBy: loginBy,
        newValue: value
      }];
    } else {
      newData[rowIndex][columnName] = value;
    }
  
    setTableData(newData);
  
    try {
      const payload = {
        clientName,
        columnName,
        currentTime,
        newValue: value,
        loginBy,
      };
  
      const response = await axios.patch(
        `${apiDomain}/client/data/updateClientData/${rowId}`,
        payload
      );
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log('Data updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  const handleOpenPopup = (rowIndex, columnName) => {
    setCurrentEditing({ rowIndex, columnName });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  const handleSaveManualTime = async () => {
    if (!manualTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      alert("Please enter a valid time in HH:MM format.");
      return;
    }

    const { rowIndex, columnName } = currentEditing;
    if (rowIndex != null && columnName) {
      // Update the local state
      const newData = [...tableData];
      const rowId = newData[rowIndex]._id;
      newData[rowIndex][columnName] = manualTime;
      setTableData(newData);

      // Reset the manual time input for the next use
      setManualTime('');

      try {
        // Update the database
        const response = await axios.patch(`${apiDomain}/client/data/updateTime/${rowId}`, {
          [columnName]: manualTime, // Dynamically sets the field to update
        });
        if (response.status === 200) {
          console.log('Time updated successfully:', response.data);
        } else {
          throw new Error(`Failed to update time. Status code: ${response.status}`);
        }
      } catch (error) {
        console.error('Error updating time:', error);
      }
      handleClosePopup();
    }
  };

  const handleSaveTime = async () => {
    const currentTime = new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour12: false,
      hour: '2-digit',  // 2-digit hour
      minute: '2-digit' // 2-digit minute
    });
    const { rowIndex, columnName } = currentEditing;
    if (rowIndex != null && columnName) {
      const newData = [...tableData];
      const rowId = newData[rowIndex]._id;
      newData[rowIndex][columnName] = currentTime;
      setTableData(newData);
      try {
        const response = await axios.patch(`${apiDomain}/client/data/updateTime/${rowId}`, {
          [columnName]: currentTime, // Dynamically sets the field to update
        });
        if (response.status === 200) {
          console.log('Time updated successfully:', response.data);
        
        } else {
          throw new Error(`Failed to update time. Status code: ${response.status}`);
        }
      } catch (error) {
        console.error('Error updating time:', error);
      }
      handleClosePopup();
    }
  };

  // const handleTimeChange = (event, rowIndex, columnName) => {
  //   const newData = [...tableData];
  //   newData[rowIndex][columnName] = event.target.value;
  //   setTableData(newData);
  // };
  const handleOpenHistoryPopup = async (rowId, columnName) => {
    try {
      const response = await axios.get(`${apiDomain}/client/data/client/tableData/${rowId}/${columnName}`);
      if (response.status !== 200) throw new Error('Failed to fetch change history');
      setChangeHistory(response.data);
      setIsHistoryPopupOpen(true);
    } catch (error) {
      console.error('Error fetching change history:', error);
    }
  };
  
  const handleCloseHistoryPopup = () => {
    setIsHistoryPopupOpen(false);
    setChangeHistory([]);
  };

  // Sample data
  // Sample data

  const dropdownOptions = [
   'Pending', 'Started', 'In Progress', 'Delayed',
    'Issue Detected', 'Completed', 'NA','Canceled'
  ];
  const complianceOptions = [
    'Pending', 'Compliant', 'Non Compliant', 'NA'
  ];

  const shouldRenderDropdown = (index) => {
    // Logic to determine if a dropdown should be rendered based on index
    return index >= 7 && index < 23; // Example condition
  };

  //const alphabetHeaders = Array.from({ length: tableHeadings.length }, (_, i) => String.fromCharCode(65 + i));

  // Function to dynamically apply header cell style based on column name
  const getHeaderCellStyle = (heading) => {
    switch (heading) {
      case 'Monitoring Alerts Validation':
      case 'Monitoring ISS/E-Link Validation':
      case 'Maintenance Mode Disabled':
        return { backgroundColor: '#F56E7B', color: '#000000', fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: "1px" };
      case 'DB Validation':
        return { backgroundColor: '#707CF1', color: '#000000', fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: "1px" }; // Check this color, seems like a typo
      case 'SCM App Validation':
        return { backgroundColor: '#00BBBA', color: '#000000', fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: "1px" };
      default:
        return { backgroundColor: '#151744', color: 'white', fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: "1px" }; // Default style for other headers
    }
  };
  const renderDropdownValue = (valueObj) => {
    const value = valueObj.value || valueObj;
    const style = {
      color: value === 'Completed' ? 'green' : value === 'Issue Detected' ? 'red' : 'default',
      minWidth: 10,
    };
    return <div style={style}>{value}</div>;
  };
  
 
  const renderCellValue = (value) => {
    if (value && typeof value === 'object') {
      if ('value' in value) {
        return value.value; // Render the 'value' property if it exists
      } else {
        // Render a stringified version of the object for debugging purposes
        return JSON.stringify(value);
      }
    }
    return value; // If it's a primitive value, render it directly
  };
  
  const handleManualTimeChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and a single colon
    if (/^[0-9]{0,2}:[0-9]{0,2}$/.test(value) || /^[0-9]{0,2}$/.test(value) || /^[0-9]{0,2}:[0-9]{0,2}$/.test(value + ':')) {
      setManualTime(value);
    }
  };

  const handleManualTimeBlur = () => {
    let [hours, minutes] = manualTime.split(':');
    hours = hours || '00';
    minutes = minutes || '00';

    if (hours.length === 1) hours = '0' + hours;
    if (minutes.length === 1) minutes = '0' + minutes;

    const formattedTime = `${hours}:${minutes}`;
    setManualTime(formattedTime);
  };
  
  const siteNameIndex = tableHeadings.findIndex(heading => heading === "Site Name");
  const dataCenterIndex = tableHeadings.findIndex(heading => heading === "Data Center");
  let eastCounter = 1;
  let westCounter = 1;
  let readOnlyCounter = 1;
  return (
    <>
      <TableContainer component={Paper} style={{ marginTop:'40px'}}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead >
            <TableRow >
              <TableCell style={getHeaderCellStyle()}>#</TableCell>
              {tableHeadings.map((heading, index) => (

                <TableCell

                  key={index}
                  style={getHeaderCellStyle(heading)}
                  className={`${index === siteNameIndex || index === dataCenterIndex ? classes.stickyColumn : ""}`}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => {
              if (row.specialRow) {
                if (row.type === 'east') eastCounter = 1;
                else if (row.type === 'west') westCounter = 1;
                else if (row.type === 'Read Only') readOnlyCounter = 1;
                return (
                  <TableRow key={`special-${row.type}-${rowIndex}`} className={classes.specialRow}>
                    <TableCell colSpan={tableHeadings.length + 1} className={classes.specialRowLabel} style={{ backgroundColor: '#0076a2', padding: "0", color: "#ffffff" }}>
                      {row.label}
                    </TableCell>
                  </TableRow>
                );

              } else {
                // Increment counters based on region
                const isReadOnlyRow = row["Read Only"] === "Yes";
                let currentCounter;
                if (isReadOnlyRow) {
                  currentCounter = readOnlyCounter;
                  readOnlyCounter++;
                } else {
                  currentCounter = row["Time Zone Group"] === "E" ? eastCounter++ : westCounter++;
                }

                return (
                  <TableRow key={row._id}>
                    <TableCell className={classes.cell}>{currentCounter}</TableCell>
                    {tableHeadings.map((heading, columnIndex) => {
                      const isTimeInputColumn = heading === 'SCM App Group 2 - Complete (Enter EST Time in 24h format)' ||
                        heading === 'Patch Reboots Complete (Enter EST Time in 24h format)';
                      const isDropdown = shouldRenderDropdown(columnIndex);
                      // const isSiteNameColumn = heading === "Site Name";
                      const isComplianceDropdown = heading === 'Azure Gold Image Compliance Status';
           
                      const isSiteNameColumn = columnIndex === siteNameIndex || columnIndex === dataCenterIndex;
                      return (
                        <TableCell key={columnIndex} className={`${classes.cell} ${isSiteNameColumn ? classes.stickyColumn : ''}`}
                        >
                          {isTimeInputColumn ? (
                            // Use a Button or any clickable element to open the popup
                            <Button onClick={() => handleOpenPopup(rowIndex, heading)} className={classes.inputTime}>
                              {row[heading] ? row[heading] : 'Set Time'}  {/* Display the current value or prompt to set time */}
                            </Button>
                          ) : isDropdown || isComplianceDropdown ?  (
                            <Box className={classes.dropdownContainer}>
                            <Select
                              value={row[heading] || 'Pending'}
                              onChange={(event) => handleDropdownChange(event, rowIndex, heading)} // Corrected parameters
                              className={classes.select}
                              IconComponent={KeyboardArrowDownIcon}
                              renderValue={(value) => renderDropdownValue(value,row[heading], rowIndex, heading)}
                            >
                              {(isComplianceDropdown ? complianceOptions : dropdownOptions).map((option, optionIndex) => (
                                <MenuItem key={optionIndex} value={option} style={{
                                  color: option === 'Completed' ? 'green' : option === 'Issue Detected' ? 'red' : 'default',
                                }}>
                                  {option}
                                </MenuItem>
                                
                                
                              ))}
                             
                          </Select>
                          <IconButton
                              className={classes.infoButton}
                              onClick={() => handleOpenHistoryPopup(row._id,heading)}
                            >
                               <InfoIcon />
                            </IconButton>
                             
                          </Box>

                          ) : (
                            renderCellValue(row[heading])
                            
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={isPopupOpen} onClose={handleClosePopup}>
        <DialogActions className={classes.inputContainer}>
     <TextField
            className={classes.timeInput}
            type="text"
            value={manualTime}
            onChange={handleManualTimeChange}
            onBlur={handleManualTimeBlur}
            placeholder="HH:MM"
            InputLabelProps={{
              shrink: true,
            }}
            style={{ margin: '20px' }}
          />
          <Button onClick={handleSaveManualTime} color="primary" className={classes.buttonsave}>
            Save
          </Button>
           <Button onClick={handleSaveTime} color="primary" className={classes.button}>
            Set Current Time EST
          </Button>
          <Button onClick={handleClosePopup} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isHistoryPopupOpen} onClose={handleCloseHistoryPopup}>
  <DialogTitle>Change History</DialogTitle>
  <DialogContent className={classes.dialogContent}>
      {changeHistory.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.stickyHeader}>Date/Time</TableCell>
              <TableCell className={classes.stickyHeader}>Status</TableCell>
              <TableCell className={classes.stickyHeader}>Changed By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {changeHistory.map((change, index) => (
              <TableRow key={index}>
                <TableCell className={classes.tableCell}>{(change.timestamp)}</TableCell>
                <TableCell className={classes.tableCell}>{change.newValue}</TableCell>
                <TableCell className={classes.tableCell}>{change.loginBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No changes found.</p>
      )}
    </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseHistoryPopup} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>
    </>
  );
}

export default TableComponent;

// TableComponent;
