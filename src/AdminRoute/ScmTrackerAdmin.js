import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStyles from './TableStyles'; 
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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

  Dialog,
  DialogActions,
  Button
} from '@mui/material';
  const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    width: '100%',
    border: '1px solid #ddd',
    margin: "99px 0px 20px 0px "
  },
  headerCell: {
    backgroundColor: theme.palette.primary.main, // existing blue color
    color: theme.palette.common.white,
    fontWeight: 'bold',
    textAlign: 'center',
    border: '1px solid #ddd',
  },

  alphabetHeaderCell: {
    backgroundColor: '#E3F2FD',
    color: theme.palette.common.black,
    fontWeight: 'bold',
    textAlign: 'center',
    border: '1px solid black',
  },
  cell: {
    textAlign: 'center',
    border: '1px solid ',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: "3px",
    //maxWidth: 150, // You can adjust this width based on your needs
  },
  // Adding a style for the table container to enable horizontal scrolling
  tableContainer: {
    overflowX: 'auto',
  
  },
  dropdownCell: {
    width: 200, // Fixed width for the dropdown cell
    maxWidth: 200, // Prevents the cell from expanding
    overflow: 'hidden',
  },
  select: {
    width: '100%',
    backgroundColor: '#FFF',
    '& .MuiSelect-icon': {
      color: theme.palette.action.active,
    },
  },
  inputTime: {
    width: '100%',
  },
  specialRowLabel: {
    fontWeight: 'bold', // Make the text bold
    fontSize: '1.2rem', // Increase the font size; adjust as needed
    color: '#FFFFFF', // Example: setting text color to white
    textAlign: 'center',
    backgroundColor: '#393392', // Keeping the background color as previously defined
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1, // Initial sticky column
  },
  stickyColumnSecond: {
    position: 'sticky',
    left: '200px', // Adjust this based on the actual width of the first sticky column
    backgroundColor: theme.palette.background.paper,
    zIndex: 2, // Higher z-index for the second sticky column
  },
  timeInput: {
    width: '50%', // Adjusted width
    height: '40px', // Adjusted height
    padding: '5px 10px', // Inner padding for text
    margin: '5px 0', // Margin to separate from other elements
    fontSize: '1rem', // Larger font size for better readability
    borderColor: theme.palette.primary.light, // Border color from theme
    borderRadius: '4px',
    paddingLeft: '60px'
  },
  setTimeButton: {
    // width: '100%', // Button takes full column width
    height: '40px', // Adjusted height for easier clicking
    margin: '5px 0', // Margin to separate from other elements
    fontSize: '0.875rem', // Font size
    textTransform: 'none', // Prevent uppercase transformation
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch', // Align items to stretch to fill the container width
    gap: '10px',
    width: "300px",
    textAlign: 'center',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out buttons evenly
    gap: '10px', // Space between buttons if you want them side by side
  },
  // Adjust the button style if necessary
  button: {
    flex: 1,
    // Allows buttons to fill the space equally
    // Other button styles...
  },// Adding custom styles for specified columns
  buttonsave: {
    flex: 0.5,

    // Allows buttons to fill the space equally
    // Other button styles...
  }
}));

function ScmTrackerAdmin() {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);
  const [tableHeadings, setTableHeadings] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentEditing, setCurrentEditing] = useState({ rowIndex: null, columnName: '' });
  const [manualTime, setManualTime] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {


    const fetchData = async () => {
      try {
        // Using axios to fetch the data from your endpoint
        const response = await axios.get('http://localhost/3000/client/data/api/tableData?includeId=true');
        if (response.status !== 200) throw new Error('Network response was not ok');

        // Directly use the response data assuming it's structured as needed
        // const data = response.data;
        const rawData = response.data;
        // Assuming each item in your data array has a "Time Zone Group" property
        const readOnlyData = rawData.filter(row => row["Read Only"] === "Yes" && row["Read Only"] === "Yes");
        // const yesData = rawData.filter(row => row["Client Type"] === "Yes");
        const eastData = rawData.filter(row => row["Time Zone Group"] === "East" && row["Read Only"] === "No");
        const westData = rawData.filter(row => row["Time Zone Group"] === "West" && row["Read Only"] === "No");

        // Assuming your data structure includes the headings within each data item
        // If your API doesn't return headings separately, you might need to adjust this
        const headings = rawData.length > 0 ? Object.keys(rawData[0]).filter(key => key !== '_id' && key !== '__v' && key !== 'Read Only') : [];

        setTableHeadings(headings);
        setTableData([
          { specialRow: true, label: 'READ-ONLY CLIENTS, PATCHING WINDOW 11 PM to 1 AM ET', type: 'Read Only' },
          ...readOnlyData,
          { specialRow: true, label: 'EAST ZONE, PATCHING WINDOW 2 AM to 4 AM ET', type: 'east' },
          ...eastData,
          { specialRow: true, label: 'WEST ZONE, PATCHING WINDOW 4 AM to 6 AM ET', type: 'west' },
          ...westData,

        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    const socket = new WebSocket('ws://localhost:8080/');
    socket.onmessage = (event) => {
      const updatedData = JSON.parse(event.data);
      setTableData(prevData => {
        return prevData.map(row => row._id === updatedData._id ? updatedData : row);
      });
    };
    setWs(socket);

    return () => socket.close();
  }, []);
  const handleDropdownChange = async (event, rowIndex, columnName) => {
    const value = event.target.value;
    const newData = [...tableData];
    const rowId = newData[rowIndex]._id; // Capture the unique _id of the row to update
    newData[rowIndex][columnName] = value;
    setTableData(newData);

    try {
      const response = await fetch(`http://localhost/3000/client/data/updateClientData/${rowId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [columnName]: value, // Dynamically update the specific column
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle the response data here if needed
      const updatedData = await response.json();
      console.log('Data updated successfully:', updatedData);
      ws.send(JSON.stringify(updatedData));
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
        const response = await axios.patch(`http://localhost/3000/client/data/updateTime/${rowId}`, {
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
        const response = await axios.patch(`http://localhost/3000/client/data/updateTime/${rowId}`, {
          [columnName]: currentTime, // Dynamically sets the field to update
        });
        if (response.status === 200) {
          console.log('Time updated successfully:', response.data);
          ws.send(JSON.stringify(response.data));
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

  const dropdownOptions = [
    'Pending', 'Started', 'In Progress', 'Delayed',
    'Issue Detected', 'Completed', 'NA',
  ];

  const shouldRenderDropdown = (index) => {
    // Logic to determine if a dropdown should be rendered based on index
    return index >= 7 && index < 21; // Example condition
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
  const renderDropdownValue = (value) => {
    const style = {
      color: value === 'Completed' ? 'green' : value === 'Issue Detected' ? 'red' : 'default',
      minWidth: 120,
    };
    return <div style={style}>{value}</div>;
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
                  currentCounter = row["Time Zone Group"] === "East" ? eastCounter++ : westCounter++;
                }

                return (
                  <TableRow key={row._id}>
                    <TableCell className={classes.cell}>{currentCounter}</TableCell>
                    {tableHeadings.map((heading, columnIndex) => {
                      const isTimeInputColumn = heading === 'SCM App Group 2 - Complete (Enter EST Time in 24h format)' ||
                        heading === 'Patch Reboots Complete (Enter EST Time in 24h format)';
                      const isDropdown = shouldRenderDropdown(columnIndex);
                      // const isSiteNameColumn = heading === "Site Name";
                      const isSiteNameColumn = columnIndex === siteNameIndex || columnIndex === dataCenterIndex;
                      return (
                        <TableCell key={columnIndex} className={`${classes.cell} ${isSiteNameColumn ? classes.stickyColumn : ''}`}
                        >
                          {isTimeInputColumn ? (
                            // Use a Button or any clickable element to open the popup
                            <Button onClick={() => handleOpenPopup(rowIndex, heading)} className={classes.inputTime}>
                              {row[heading] ? row[heading] : 'Set Time'}  {/* Display the current value or prompt to set time */}
                            </Button>
                          ) : isDropdown ? (
                            <Select
                              value={row[heading] || 'Pending'}
                              onChange={(event) => handleDropdownChange(event, rowIndex, heading)} // Corrected parameters
                              className={classes.select}
                              IconComponent={KeyboardArrowDownIcon}
                              renderValue={(value) => renderDropdownValue(value)}
                            >
                              {dropdownOptions.map((option, optionIndex) => (
                                <MenuItem key={optionIndex} value={option} style={{
                                  color: option === 'Completed' ? 'green' : option === 'Issue Detected' ? 'red' : 'default',
                                }}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>


                          ) : (
                            row[heading]
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
          <input
            className={classes.timeInput}
            type="time"
            value={manualTime}
            onChange={(e) => setManualTime(e.target.value)}
            style={{ margin: '20px' }}
          />
          <Button onClick={() => handleSaveManualTime()} color="primary" className={classes.buttonsave}>
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
    </>
  );
}

export default ScmTrackerAdmin;

//