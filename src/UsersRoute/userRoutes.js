import React from "react";
import { Routes, Route } from "react-router-dom";
import { TimeProvider } from "../Components/TimeContext";
import Home from "../Components/Home";
// import EmailTemplate from "../Components/EmailTemplate";
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
import TwTracker from "../Components/TwTracker";
import AzureTracker from "../Components/AzureTracker";
import SuncommTracker from "../Components/SuncommTracker";
import AusTracker from "../Components/AusTracker";
import AdhocTracker from "../Components/AdhocTracker";
import QtsTracker from "../Components/QtsTracker";
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
            <Route path="/twtracker" element={<TwTracker />} />
            <Route path="/azuretracker" element={<AzureTracker />} />
            <Route path="/suncommtracker" element={<SuncommTracker />} />
            <Route path="/austracker" element={<AusTracker />} />
            <Route path="/adhoctracker" element={<AdhocTracker />} />
            <Route path="/Qtstracker" element={<QtsTracker />} />
            <Route path="/addemail" element={<AddEmail />} />
            <Route path="/data" element={<DataTable />} />
          </Routes>
        </TeamProvider>
      </TimeProvider>
    </AuthProvider>
  );
};

export default UserRoutes;
