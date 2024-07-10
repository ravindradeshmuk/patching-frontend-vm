import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Select, MenuItem, Button, RadioGroup, FormControlLabel, Radio, FormControl, InputLabel, OutlinedInput, Chip,
} from '@mui/material';

const apiDomain = process.env.REACT_APP_API_DOMAIN;

const AdminTeamAccess = () => {
  const [products] = useState(['scm', 'tw', 'azure', 'suncomm', 'aus', 'adhoc', 'qts']);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [trackerConfig, setTrackerConfig] = useState(null);
  const [headingAccess, setHeadingAccess] = useState({});
  const [selectedHeading, setSelectedHeading] = useState('');
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsResponse = await axios.get(`${apiDomain}/api/teams`);
      setTeams(teamsResponse.data);
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      if (selectedProduct) {
        try {
          const trackerConfigResponse = await axios.get(`${apiDomain}/api/trackerConfig/${selectedProduct}`);
          setTrackerConfig(trackerConfigResponse.data);
        } catch (error) {
          console.error('Error fetching tracker config:', error);
        }

        try {
          const headingAccessResponse = await axios.get(`${apiDomain}/api/headingAccess/${selectedProduct}`);
          const accessData = headingAccessResponse.data.reduce((acc, item) => {
            acc[item.heading] = item.teamWriteAccess;
            return acc;
          }, {});
          setHeadingAccess(accessData);
        } catch (error) {
          console.error('Error fetching heading access:', error);
        }
      }
    };
    fetchConfig();
  }, [selectedProduct]);

  const handleSave = async () => {
    await axios.post(`${apiDomain}/api/headingAccess`, {
      product: selectedProduct,
      heading: selectedHeading,
      teamWriteAccess: selectedTeams,
    });

    const headingAccessResponse = await axios.get(`${apiDomain}/api/headingAccess/${selectedProduct}`);
    const accessData = headingAccessResponse.data.reduce((acc, item) => {
      acc[item.heading] = item.teamWriteAccess;
      return acc;
    }, {});
    setHeadingAccess(accessData);
    setSelectedTeams([]); // Clear the selected teams after saving
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Team Access
      </Typography>
      <FormControl component="fieldset">
        <Typography variant="h6" gutterBottom>
          Select Product
        </Typography>
        <RadioGroup
          row
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          {products.map((product) => (
            <FormControlLabel
              key={product}
              value={product}
              control={<Radio />}
              label={product}
            />
          ))}
        </RadioGroup>
      </FormControl>
      {trackerConfig && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Assign Team Access for {selectedProduct}
          </Typography>
          {trackerConfig.headings.map((heading) => (
            <Box key={heading} mb={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                {heading}
              </Typography>
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel id={`select-label-${heading}`}>Teams with Write Access</InputLabel>
                <Select
                  labelId={`select-label-${heading}`}
                  multiple
                  value={headingAccess[heading] || []}
                  onChange={(e) => {
                    setSelectedHeading(heading);
                    setSelectedTeams(e.target.value);
                  }}
                  input={<OutlinedInput id={`select-multiple-${heading}`} label="Teams with Write Access" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {teams.map((team) => (
                    <MenuItem key={team} value={team}>
                      {team}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ ml: 2 }}
              >
                Save
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AdminTeamAccess;
