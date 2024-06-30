import { useState, useEffect } from "react";
import moment from "moment-timezone";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import UpdateIcon from "@mui/icons-material/Update";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";
import { makeStyles } from "@mui/styles"; // Updated import
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  } from '@mui/material';

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
  root: {
    flexGrow: 1,
    background: "linear-gradient(to right, #6a11cb, #2575fc)",
    color: "white",
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontWeight: "bold",
    fontSize: "20px",
    marginRight: "20px",
  },
  navLink: {
    marginRight: "16px",
    display: "flex",
    alignItems: "center",
    color: "white",
    textDecoration: "none",
    cursor: "pointer",
    margin: "3px",
    "&:hover": {
      backgroundColor: "#ddd",
      color: "black",
      borderRadius: "3px",
    },
    "&.active": {
      color: "#f56e7b",
    },
  },
  search: {
    marginLeft: "auto",
    marginRight: "16px",
    backgroundColor: "white",
    borderRadius: "4px",
    "& .MuiInputBase-input": {
      padding: "6px",
      paddingLeft: "12px",
    },
  },
  iconButtonRow: {
    display: "flex",
    alignItems: "center",
  },
  iconButton: {
    color: "white",
    marginRight: "8px",
  },
  menuRow: {
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
  },
  menuIcon: {
    color: "#00bbba",
    marginRight: "8px",
  },
  title: {
    flexGrow: 1,
    marginLeft: "12px",
    "&:hover": {
      color: "#f56e7b",
    },
  },
  logoutButton: {
    backgroundColor: "#f56e7b",
    borderRadius: "2px",
    padding: "6px 20px",
    "&:hover": {
      backgroundColor: "#ab4d56",
    },
  },
}));

const Navbar = () => {
  const [currentEstDateTime, setCurrentEstDateTime] = useState("");
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/home");
  };

  useEffect(() => {
    const tick = () => {
      const nowInEst = moment
        .tz("America/New_York")
        .format("MM/DD/YYYY hh:mm:ss A");
      setCurrentEstDateTime(nowInEst);
    };
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" style={{ backgroundColor: "#393392" }}>
        <Toolbar className={classes.toolbar}>
          <img
            src="/AWhite.png"
            alt="Altera Logo"
            style={{ marginRight: "10px", width: 120 }}
          />
          <Typography variant="h6" className={classes.title}>
            Admin Dashboard
          </Typography>
          <Box className={classes.iconButtonRow}>
            <Typography sx={{ textAlign: "center", fontSize: "11px" }}>
              Date and Time (EST): {currentEstDateTime}
            </Typography>
            <IconButton className={classes.iconButton}>
              <NotificationsIcon />
            </IconButton>
            <IconButton className={classes.iconButton}>
              <LanguageIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleLogout}
              className={classes.logoutButton}
            >
              <Typography variant="body1">Logout</Typography>
            </IconButton>
          </Box>
        </Toolbar>
        <Box className={classes.menuRow}>
          <Link
            to="/admindashboard/dashbord"
            className={`${classes.navLink} ${location.pathname === "/admindashboard/dashbord" ? "active" : ""}`}
          >
            <DashboardIcon className={classes.menuIcon} />
            Dashboard
          </Link>
          <Link
            to="/admindashboard/tablecomponent"
            className={`${classes.navLink} ${location.pathname === "/admindashboard/tablecomponent" ? "active" : ""}`}
          >
            <TrackChangesIcon className={classes.menuIcon} />
            SCM Tracker
          </Link>
          <Link
            to="/admindashboard/updateheading"
            className={`${classes.navLink} ${location.pathname === "/admindashboard/updateheading" ? "active" : ""}`}
          >
            <AddCircleIcon className={classes.menuIcon} />
            Add Status
          </Link>

          <Link
            to="/admindashboard/addclient"
            className={`${classes.navLink} ${location.pathname === "/admindashboard/template" ? "active" : ""}`}
          >
            <DescriptionIcon className={classes.menuIcon} />
            Add Client
          </Link>

          <Link
            to="/admindashboard/template"
            className={`${classes.navLink} ${location.pathname === "/admindashboard/template" ? "active" : ""}`}
          >
            <DescriptionIcon className={classes.menuIcon} />
            Template
          </Link>
          <Link
            to="/admindashboard/updateresource"
            className={`${classes.navLink} ${location.pathname === "/admindashboard/updateresource" ? "active" : ""}`}
          >
            <UpdateIcon className={classes.menuIcon} />
            Update Resource
          </Link>
          <Link
            to="/admindashboard/sign-up-data"
            className={`${classes.navLink} ${location.pathname === "/admindashboard/sign-up-data" ? "active" : ""}`}
          >
            <PeopleIcon className={classes.menuIcon} />
            User Data
          </Link>
          <Link
            to="/admindashboard/clientdata"
            className={`${classes.navLink} ${location.pathname === "/admindashboard/clientdata" ? "active" : ""}`}
          >
            <PeopleIcon className={classes.menuIcon} />
            Reports
          </Link>
        </Box>
      </AppBar>
    </div>
  );
};

export default Navbar;
