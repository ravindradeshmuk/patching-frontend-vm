import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InfoIcon from '@mui/icons-material/Info';
import {
  StyledTable,
  StyledTableContainer,
  StyledTableCell,
  StyledTableRow,
  StyledButton,
  StyledDialog,
  StyledTextField,
  StyledSelect,
  StyledIconButton,
} from './StyledComponents';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TableCell from '@mui/material/TableCell'


function AzureTracker() {
  const apiDomain = process.env.REACT_APP_API_DOMAIN;
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
      const response = await axios.get(`${apiDomain}/tw/client/api/azureclient?includeId=true`);
      if (response.status !== 200) throw new Error('Network response was not ok');
  
      const rawData = response.data;
      const transformedData = transformData(rawData);
  
      const readOnlyData = transformedData.filter(row =>
        row["selectedTracker"] === "azure"
      );
  
      const headings = transformedData.length > 0 
        ? Object.keys(transformedData[0]).filter(key => 
            key !== '_id' && key !== '__v' && key !== 'Read Only' && key !== 'selectedTracker' && key !== 'Canceled Client'
          ) 
        : [];
  
      setTableHeadings(headings);
      setTableData([
        { specialRow: true, label: 'PATCHING WINDOW 11 PM to 1 AM ET', type: 'Read Only' },
        ...readOnlyData,
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
            timestamp: currentTime,
            loginBy: loginBy,
            newValue: value
          }]
        });
      }
    } else if (typeof nestedObject === 'object' && nestedObject !== null) {
      nestedObject.value = value;
      nestedObject.updated = [{
        name: clientName,
        timestamp: currentTime,
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
    setManualTime('');
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
  
  const dropdownOptions = [
    'Pending', 'Started', 'In Progress', 'Delayed',
    'Issue Detected', 'Completed', 'NA', 'Canceled'
  ];
  
  const complianceOptions = [
    'Pending', 'Compliant', 'Non Compliant', 'NA'
  ];
  
  const shouldRenderDropdown = (index) => {
    // Logic to determine if a dropdown should be rendered based on index
    return index >= 7 && index < 28; // Example condition
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
      <StyledTableContainer component={Paper}>
      <h1>Azure Tracker-:</h1>
        <StyledTable aria-label="customized table">
          <TableHead>
            <TableRow>
            <TableCell style={getHeaderCellStyle()}>#</TableCell>

              {tableHeadings.map((heading, index) => (
                <StyledTableCell
                  key={index}
                  style={getHeaderCellStyle(heading)}
                  className={index === siteNameIndex || index === dataCenterIndex ? 'stickyColumn' : ''}
                >
                  {heading}
                </StyledTableCell>
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
                  <StyledTableRow key={`special-${row.type}-${rowIndex}`} className="specialRow">
                    <StyledTableCell colSpan={tableHeadings.length + 1} className="specialRowLabel">
                      {row.label}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              } else {
                const isReadOnlyRow = row["Read Only"] === "Yes";
                let currentCounter;
                if (isReadOnlyRow) {
                  currentCounter = readOnlyCounter++;
                } else {
                  currentCounter = row["Time Zone Group"] === "E" ? eastCounter++ : westCounter++;
                }
                const isCanceledClient = row["Canceled Client"] === "Yes";

                return (
                  <StyledTableRow key={row._id} className={isCanceledClient ? 'canceledRow' : ''}>
                    <StyledTableCell>{currentCounter}</StyledTableCell>
                    {tableHeadings.map((heading, columnIndex) => {
                      const isTimeInputColumn = heading === 'SCM App Group 2 - Complete (Enter EST Time in 24h format)' ||
                        heading === 'Patch Reboots Complete (Enter EST Time in 24h format)';
                      const isDropdown = shouldRenderDropdown(columnIndex);
                      const isComplianceDropdown = heading === 'Azure Gold Image Compliance Status';
                      const isSiteNameColumn = columnIndex === siteNameIndex || columnIndex === dataCenterIndex;
                      const fieldClassName = isCanceledClient ? 'disabledSelect' : '';

                      return (
                        <StyledTableCell key={columnIndex} className={isSiteNameColumn ? 'stickyColumn' : ''}>
                          {isTimeInputColumn ? (
                            <StyledButton onClick={() => handleOpenPopup(rowIndex, heading)} className={`inputTime ${fieldClassName}`} disabled={isCanceledClient}>
                              {row[heading] ? row[heading] : 'Set Time'}
                            </StyledButton>
                          ) : isDropdown || isComplianceDropdown ? (
                            <Box className="dropdownContainer">
                              <StyledSelect
                                value={row[heading] || 'Pending'}
                                onChange={(event) => handleDropdownChange(event, rowIndex, heading)}
                                className={`select ${fieldClassName}`}
                                IconComponent={KeyboardArrowDownIcon}
                                renderValue={(value) => renderDropdownValue(value)}
                              >
                                {(isComplianceDropdown ? complianceOptions : dropdownOptions).map((option, optionIndex) => (
                                  <MenuItem key={optionIndex} value={option} style={{
                                    color: option === 'Completed' ? 'green' : option === 'Issue Detected' ? 'red' : 'default',
                                  }}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </StyledSelect>
                              <StyledIconButton
                                className={`infoButton ${fieldClassName}`}
                                onClick={() => handleOpenHistoryPopup(row._id, heading)}
                                disabled={isCanceledClient}
                              >
                                <InfoIcon />
                              </StyledIconButton>
                            </Box>
                          ) : (
                            renderCellValue(row[heading])
                          )}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              }
            })}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      <StyledDialog open={isPopupOpen} onClose={handleClosePopup}>
        <DialogActions className="inputContainer">
          <StyledTextField
            className="timeInput"
            type="text"
            value={manualTime}
            onChange={handleManualTimeChange}
            onBlur={handleManualTimeBlur}
            placeholder="HH:MM"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <StyledButton onClick={handleSaveManualTime} color="primary" className="buttonsave">
            Save
          </StyledButton>
          <StyledButton onClick={handleSaveTime} color="primary" className="button">
            Set Current Time EST
          </StyledButton>
          <StyledButton onClick={handleClosePopup} color="secondary">
            Cancel
          </StyledButton>
        </DialogActions>
      </StyledDialog>
      <StyledDialog open={isHistoryPopupOpen} onClose={handleCloseHistoryPopup}>
        <DialogTitle>Change History</DialogTitle>
        <DialogContent className="dialogContent">
          {changeHistory.length > 0 ? (
            <StyledTable>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date/Time</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Changed By</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {changeHistory.map((change, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{change.dateTime}</StyledTableCell>
                    <StyledTableCell>{change.status}</StyledTableCell>
                    <StyledTableCell>{change.changedBy}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </StyledTable>
          ) : (
            <div>No change history available.</div>
          )}
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={handleCloseHistoryPopup} color="primary">
            Close
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </>
  );
}

export default AzureTracker;