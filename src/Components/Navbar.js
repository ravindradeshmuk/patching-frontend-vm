import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import moment from "moment-timezone";
import { AuthContext } from "../Components/UserContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentEstDateTime, setCurrentEstDateTime] = useState("");
  const { isLoggedIn, firstName, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSCMTrackerClick = () => {
    if (isLoggedIn) {
      navigate("/scmtracker");
    } else {
      navigate("/login");
    }
  };

  const pages = ["Home", "SCM Tracker"];

  const drawer = (
    <div>
      <List>
        {pages.map((text) => (
          <ListItem
            button
            component={text === "SCM Tracker" ? "div" : Link}
            to={
              text === "SCM Tracker"
                ? undefined
                : `/${text.replace(/\s+/g, "").toLowerCase()}`
            }
            key={text}
            onClick={
              text === "SCM Tracker"
                ? handleSCMTrackerClick
                : handleDrawerToggle
            }
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <AppBar position="fixed" style={{ backgroundColor: "#393392" }}>
        <Toolbar>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxHeight: "98px",
              padding: "16px 20px 10px 0px",
            }}
          >
            <img
              src="/AWhite.png"
              alt="Altera Logo"
              style={{ marginRight: "10px", width: 120 }}
            />
            <div>
              <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{ textAlign: "center", color: "white" }}
              >
                Hosting Patching Portal
              </Typography>
              <Typography
                sx={{ textAlign: "center", fontSize: "11px", color: "white" }}
              >
                Date and Time (EST): {currentEstDateTime}
              </Typography>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "flex-end",
              gap: "5px",
            }}
          >
            {pages.map((text) => (
              <Button
                key={text}
                color="inherit"
                component={text === "SCM Tracker" ? "div" : Link}
                to={
                  text === "SCM Tracker"
                    ? undefined
                    : `/${text.replace(/\s+/g, "").toLowerCase()}`
                }
                onClick={
                  text === "SCM Tracker" ? handleSCMTrackerClick : undefined
                }
                sx={{
                  color: "#fff",
                  "&.active": {
                    color: "#fff", // Ensure active link is white
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                {text}
              </Button>
            ))}
            {isLoggedIn ? (
              <>
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: "20px",
                    backgroundColor: "#ab4d56",
                    padding: "4px",
                    width: "8rem",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  {firstName}
                </Typography>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ color: "#fff" }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#fff",
                      borderColor: "#fff",
                      margin: "0 7px 0 3px",
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
                <Link to="/login">
                  <Button sx={{ color: "#fff", backgroundColor: "#f56e7b" }}>
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            bgcolor: "#2F2257",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Toolbar /> {/* This is used to provide spacing for the fixed AppBar */}
    </div>
  );
};

export default Navbar;
