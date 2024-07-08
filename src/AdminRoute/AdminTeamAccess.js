import React, { useState, useEffect } from 'react';
import { fetchTrackerConfig, updateTeamAccess } from '../api'; // Define API calls
import { Box, TextField, Button, Typography } from '@mui/material';

const AdminTeamAccess = ({ product }) => {
  const [trackerConfig, setTrackerConfig] = useState(null);
  const [selectedHeading, setSelectedHeading] = useState('');
  const [teams, setTeams] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await fetchTrackerConfig(product);
      setTrackerConfig(config);
    };
    fetchConfig();
  }, [product]);

  const handleSave = async () => {
    await updateTeamAccess(product, selectedHeading, teams.split(','));
    const config = await fetchTrackerConfig(product);
    setTrackerConfig(config);
    setTeams(''); // Clear the teams input after saving
  };

  if (!trackerConfig) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h6">Assign Team Access for {product}</Typography>
      {trackerConfig.headings.map((heading) => (
        <Box key={heading} mb={2}>
          <TextField
            label={heading}
            value={selectedHeading === heading ? teams : ''}
            onClick={() => setSelectedHeading(heading)}
            onChange={(e) => setTeams(e.target.value)}
            placeholder="Enter teams separated by commas"
          />
          <Button onClick={handleSave}>Save</Button>
        </Box>
      ))}
    </Box>
  );
};

export default AdminTeamAccess;
