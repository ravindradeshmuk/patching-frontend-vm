import React, { createContext, useState, useContext } from "react";

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [teamData, setTeamData] = useState(null);

  const setTeam = (team) => {
    setTeamData(team);
  };

  return (
    <TeamContext.Provider value={{ teamData, setTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => useContext(TeamContext);
