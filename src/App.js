// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';


import UserRoutes from "./UsersRoute/userRoutes";
import AdminDashboard from "./AdminRoute/AdminDashboard";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Replace with your primary color
    },
    // Add other palette configurations as needed
  },
  // Add other theme configurations like typography, spacing, etc.
});

// import io from 'socket.io-client';
// const socket = io('http://localhost:3000');
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
