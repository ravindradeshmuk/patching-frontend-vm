// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { styled, ThemeProvider as SystemThemeProvider } from '@mui/system';
import { AuthContext } from "./Components/UserContext";

import Navbar from "./Components/Navbar"; // Ensure the correct path
import UserRoutes from "./UsersRoute/userRoutes";
import AdminDashboard from "./AdminRoute/AdminDashboard";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* User Dashboard Routes */}
          <Route path="/*" element={<UserRoutes />} />

          {/* Admin Dashboard Routes */}
          <Route path="/admindashboard/*" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
