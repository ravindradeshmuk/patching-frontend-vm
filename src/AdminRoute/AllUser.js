import React, { useState } from "react";
import axios from "axios";
import { Button, Container } from "@mui/material";

const AllUser = () => {
  const [estTime, setEstTime] = useState(new Date());

  const saveEstTime = async () => {
    try {
      // Replace with actual API endpoint
      // await axios.post(`${apiDomain}:${apiPort}/user/api/save-est-time`, { estTime });
      console.log("EST time saved successfully");
    } catch (error) {
      console.error("Error saving EST time:", error);
    }
  };

  return (
    <Container sx={{ marginTop: "60px" }}>
      <Button variant="contained" color="primary" onClick={saveEstTime}>
        Save EST Time
      </Button>
    </Container>
  );
};

export default AllUser;
