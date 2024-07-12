// UserProfile.js
import React, { useContext } from "react";
import { Typography, Box } from "@mui/material";
import { AuthContext } from "../Components/UserContext"; // Ensure the correct path

const UserProfile = () => {
  const { firstName } = useContext(AuthContext);

  return (
    <Box display="flex" alignItems="center" sx={{ marginRight: 2 }}>
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
    </Box>
  );
};

export default UserProfile;
