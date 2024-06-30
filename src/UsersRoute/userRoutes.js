import React from "react";
import { Routes, Route } from "react-router-dom";
import { TimeProvider } from "../Components/TimeContext";
import Home from "../Components/Home";
import EmailTemplate from "../Components/EmailTemplate";
import AddEmail from "../Components/AddEmail";
import Navbar from "../Components/Navbar";
import TableComponent from "../Components/TableComponent";
import LoginPage from "../Components/LoginPage";
// import SignupPage from '../Components/SignupPage';
import { TeamProvider } from "../Components/TeamProvider";
import SignUpPage from "../Components/SignUpPage";
import { AuthProvider } from "../Components/UserContext";
import PrivateRoute from "../Components/PrivateRoute";
import DataTable from "../Table";
const UserRoutes = () => {
  return (
    <AuthProvider>
      <TimeProvider>
        <TeamProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/scmtracker"
              element={
                <PrivateRoute>
                  <TableComponent />
                </PrivateRoute>
              }
            />
            <Route path="/emailtemplate" element={<EmailTemplate />} />
            <Route path="/addemail" element={<AddEmail />} />
            <Route path="/data" element={<DataTable />} />
          </Routes>
        </TeamProvider>
      </TimeProvider>
    </AuthProvider>
  );
};

export default UserRoutes;
