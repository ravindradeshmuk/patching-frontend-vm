import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  InputBase,
  styled,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const Root = styled("div")(({ theme }) => ({
  flexGrow: 1,
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  position: "fixed",
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#393392",
  color: "white",
  height: "70px",
  padding: "16px 20px 10px 0px",
}));

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  marginLeft: "12px",
  "&:hover": {
    color: "#f56e7b",
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const SectionDesktop = styled("div")(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const LogoutButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#f56e7b",
  borderRadius: "2px",
  padding: "6px 20px",
  "&:hover": {
    backgroundColor: "#ab4d56",
  },
}));

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <Root>
      <AppBarStyled>
        <Toolbar className="my-4 mx-20">
          <img
            src="/AWhite.png"
            alt="Altera Logo"
            style={{ marginRight: "10px", width: 120 }}
          />
          <Title variant="h6">
            Admin Dashboard
          </Title>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <div className="">
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" style={{ padding: 0 }}>
              <LanguageIcon />
            </IconButton>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
            <LogoutButton
              color="inherit"
              onClick={handleLogout}
            >
              <Typography variant="body1">Logout</Typography>
            </LogoutButton>
          </div>
        </Toolbar>
      </AppBarStyled>
    </Root>
  );
}
