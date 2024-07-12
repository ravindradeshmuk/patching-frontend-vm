import { useState, useEffect } from "react";
import moment from "moment-timezone";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  TrackChanges as TrackChangesIcon,
  AddCircle as AddCircleIcon,
  Description as DescriptionIcon,
  Update as UpdateIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { styled } from '@mui/system';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  background: "linear-gradient(to right, #6a11cb, #2575fc)",
  color: "white",
}));

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#393392",
});

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  marginLeft: "12px",
  "&:hover": {
    color: "#f56e7b",
  },
}));

const NavLink = styled(Link)(({ theme }) => ({
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
}));

const IconButtonRow = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const StyledIconButton = styled(IconButton)({
  color: "white",
  marginRight: "8px",
});

const MenuRow = styled(Box)({
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
});

const MenuIcon = styled('span')({
  color: "#00bbba",
  marginRight: "8px",
});

const Logo = styled('img')({
  marginRight: "10px",
  width: 120,
});

const LogoutButton = styled(Button)({
  backgroundColor: "#f56e7b",
  borderRadius: "2px",
  padding: "6px 20px",
  "&:hover": {
    backgroundColor: "#ab4d56",
  },
});

const Navbar = () => {
  const [currentEstDateTime, setCurrentEstDateTime] = useState("");
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
    <Root>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <Logo src="/AWhite.png" alt="Altera Logo" />
          <Title variant="h6">Admin Dashboard</Title>
          <IconButtonRow>
            <Typography sx={{ textAlign: "center", fontSize: "11px" }}>
              Date and Time (EST): {currentEstDateTime}
            </Typography>
            <StyledIconButton>
              <NotificationsIcon />
            </StyledIconButton>
            <StyledIconButton>
              <LanguageIcon />
            </StyledIconButton>
            <LogoutButton onClick={handleLogout}>
              <Typography variant="body1">Logout</Typography>
            </LogoutButton>
          </IconButtonRow>
        </StyledToolbar>
        <MenuRow>
          <NavLink
            to="/admindashboard/dashbord"
            className={location.pathname === "/admindashboard/dashbord" ? "active" : ""}
          >
            <DashboardIcon className={MenuIcon} />
            Dashboard
          </NavLink>
          <NavLink
            to="/admindashboard/tablecomponent"
            className={location.pathname === "/admindashboard/tablecomponent" ? "active" : ""}
          >
            <TrackChangesIcon className={MenuIcon} />
            SCM Tracker
          </NavLink>
          <NavLink
            to="/admindashboard/updateheading"
            className={location.pathname === "/admindashboard/updateheading" ? "active" : ""}
          >
            <AddCircleIcon className={MenuIcon} />
            Add Status
          </NavLink>
          <NavLink
            to="/admindashboard/addclient"
            className={location.pathname === "/admindashboard/template" ? "active" : ""}
          >
            <DescriptionIcon className={MenuIcon} />
            Add Client
          </NavLink>
          <NavLink
            to="/admindashboard/createtracker"
            className={location.pathname === "/admindashboard/createtracker" ? "active" : ""}
          >
            <DescriptionIcon className={MenuIcon} />
            Create Tracker
          </NavLink>
          <NavLink
            to="/admindashboard/teamaccess"
            className={location.pathname === "/admindashboard/teamaccess" ? "active" : ""}
          >
            <DescriptionIcon className={MenuIcon} />
            Team Access
          </NavLink>
          <NavLink
            to="/admindashboard/template"
            className={location.pathname === "/admindashboard/template" ? "active" : ""}
          >
            <DescriptionIcon className={MenuIcon} />
            Template
          </NavLink>
          <NavLink
            to="/admindashboard/updateresource"
            className={location.pathname === "/admindashboard/updateresource" ? "active" : ""}
          >
            <UpdateIcon className={MenuIcon} />
            Update Resource
          </NavLink>
          <NavLink
            to="/admindashboard/sign-up-data"
            className={location.pathname === "/admindashboard/sign-up-data" ? "active" : ""}
          >
            <PeopleIcon className={MenuIcon} />
            User Data
          </NavLink>
          <NavLink
            to="/admindashboard/clientdata"
            className={location.pathname === "/admindashboard/clientdata" ? "active" : ""}
          >
            <PeopleIcon className={MenuIcon} />
            Reports
          </NavLink>
        </MenuRow>
      </StyledAppBar>
    </Root>
  );
};

export default Navbar;
