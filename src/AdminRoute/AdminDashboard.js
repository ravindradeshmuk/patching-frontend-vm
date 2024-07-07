import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
// For MUI v5
import { styled } from '@mui/system';
import { withStyles } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, Checkbox, TextField, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InfoIcon from '@mui/icons-material/Info';
 import AdminHeader from './AdminHeader';
// import SidebarAdmin from './SidebarAdmin';
import UpdateHeading from './UpdateHeading';
import AddClient from './AddClient';
import CreateTracker from './CreateTracker';
import UpdateResource from './UpdateResource';
import EmailTemplate from './EmailTemplate';
import UpdateTemplate from './UpdateTemplate';
import SignUpData from './SignUpData';
import AllUser from './AllUser';
import PendingUser from './PendingUser';
import Dashbord from './Dashbord';
// import ScmTrackerAdmin from './ScmTrackerAdmin';
import TableComponent from '../Components/TableComponent';
import ClientData from './ClientData';


const useStyles = styled((theme) => ({
  content: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center', // Center content horizontally
    alignItems: 'center', // Center content vertically
    padding: theme.spacing(3),
    // marginLeft: '250px', // Space for Sidebar
  },
  toolbar: theme.mixins.toolbar,
}));

export default function AdminDashboard() {

  const classes = useStyles();
  const location = useLocation();

  // You can add additional logic here if needed for specific admin routes
  const isAdminRoute = location.pathname && location.pathname.startsWith('/admin');

  return (
    <div>
      <AdminHeader/>
      {/* {isAdminRoute && <SidebarAdmin />} */}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Routes>
          {/* Define your admin routes here */}
          <Route path="updateheading" element={<UpdateHeading />} exact />
          <Route path="addclient" element={<AddClient />} exact />
          <Route path="createtracker" element={<CreateTracker />} exact />
          <Route path="updateresource" element={<UpdateResource/>} exact />
          <Route path="template" element={<EmailTemplate/>} exact />
          <Route path="update-template" element={<UpdateTemplate/>} exact />
          <Route path="sign-up-data" element={<SignUpData/>} exact />
          <Route path="all-user" element={<AllUser/>} exact />
          <Route path="pending-user" element={<PendingUser/>} exact />
          <Route path="dashbord" element={<Dashbord/>} exact />
          <Route path="tablecomponent" element={<TableComponent/>} exact />
          {/* <Route path="clientdata" element={<ClientData/>} exact /> */}
          {/* Add more routes as needed */}
        </Routes>
      </main>
    </div>
  );
}
