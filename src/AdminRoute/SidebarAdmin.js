import React from "react";
import {
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  CssBaseline,
  Container,
} from "@mui/material";
// import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UpdateIcon from "@mui/icons-material/Update";
// import GetAppIcon from '@mui/icons-material/GetApp';
import ContactsIcon from "@mui/icons-material/Contacts";
// import GroupIcon from '@mui/icons-material/Group';
// import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ViewListIcon from "@mui/icons-material/ViewList";
import { Link, useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: {
    minHeight: 64,
  },
  sidebar: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#151744",
    color: "white",
    padding: theme.spacing(2),
    justifyContent: "center",
    flexWrap: "wrap",
    // marginTop:'40px',
    //  margin:'20px'
  },
  sidebarItem: {
    color: "white",
    minWidth: "auto",
  },
  sidebarIcon: {
    color: "blue",
  },
  listItem: {
    width: "auto",
    textAlign: "center",
    margin: theme.spacing(1),
  },
  container: {
    // padding: theme.spacing(1),
    // marginTop: theme.spacing(8),
  },
}));

const SidebarAdmin = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  // const handleNavigation = (path) => {
  //   navigate(path);
  // };

  return (
    <>
      <CssBaseline />

      <Toolbar />
      <div className={classes.sidebar}>
        <List
          component="nav"
          aria-label="main mailbox folders"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <ListItem
            button
            component={Link}
            to="/admindashboard/dashbord"
            className={classes.listItem}
          >
            <ListItemIcon className={classes.sidebarItem}>
              <DashboardIcon className={classes.sidebarIcon} />
            </ListItemIcon>
            <ListItemText style={{ color: "red" }} primary="Dashboard" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/admindashboard/scmAdmin"
            className={classes.listItem}
          >
            <ListItemIcon className={classes.sidebarItem}>
              <DashboardIcon className={classes.sidebarIcon} />
            </ListItemIcon>
            <ListItemText primary="SCM Track" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/admindashboard/updateheading"
            className={classes.listItem}
          >
            <ListItemIcon className={classes.sidebarItem}>
              <UpdateIcon className={classes.sidebarIcon} />
            </ListItemIcon>
            <ListItemText primary="Add " />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/admindashboard/addclient"
            className={classes.listItem}
          >
            <ListItemIcon className={classes.sidebarItem}>
              <AccountCircleIcon className={classes.sidebarIcon} />
            </ListItemIcon>
            <ListItemText primary="Add Client" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/admindashboard/template"
            className={classes.listItem}
          >
            <ListItemIcon className={classes.sidebarItem}>
              <ViewListIcon className={classes.sidebarIcon} />
            </ListItemIcon>
            <ListItemText primary="Template" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/admindashboard/updateresource"
            className={classes.listItem}
          >
            <ListItemIcon className={classes.sidebarItem}>
              <UpdateIcon className={classes.sidebarIcon} />
            </ListItemIcon>
            <ListItemText primary="Update Resource" />
          </ListItem>
          {/* <ListItem button component={Link} to="/admindashboard/update-template" className={classes.listItem}>
            <ListItemIcon className={classes.sidebarItem}><GetAppIcon className={classes.sidebarIcon} /></ListItemIcon>
            <ListItemText primary="Get Template" />
          </ListItem> */}
          <ListItem
            button
            component={Link}
            to="/admindashboard/sign-up-data"
            className={classes.listItem}
          >
            <ListItemIcon className={classes.sidebarItem}>
              <ContactsIcon className={classes.sidebarIcon} />
            </ListItemIcon>
            <ListItemText primary="User Data" />
          </ListItem>
          {/* <ListItem button component={Link} to="/admindashboard/all-user" className={classes.listItem}>
            <ListItemIcon className={classes.sidebarItem}><GroupIcon className={classes.sidebarIcon} /></ListItemIcon>
            <ListItemText primary="All User" />
          </ListItem> */}
          {/* <ListItem button component={Link} to="/admindashboard/pending-user" className={classes.listItem}>
            <ListItemIcon className={classes.sidebarItem}><PendingActionsIcon className={classes.sidebarIcon} /></ListItemIcon>
            <ListItemText primary="Pending User" />
          </ListItem> */}
        </List>
      </div>
      <Container className={classes.container}>
        {/* Add your page content here */}
      </Container>
    </>
  );
};

export default SidebarAdmin;
