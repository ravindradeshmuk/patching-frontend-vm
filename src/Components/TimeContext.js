// TimeContext.js
import React, { createContext, useState, useEffect } from "react";
import moment from "moment-timezone";

// Create a context
const TimeContext = createContext();

// Create a provider component
export const TimeProvider = ({ children }) => {
  const [currentEstDateTime, setCurrentEstDateTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const nowInEst = moment.tz("America/New_York").format("HH:mm");
      setCurrentEstDateTime(nowInEst);
    };

    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <TimeContext.Provider value={currentEstDateTime}>
      {children}
    </TimeContext.Provider>
  );
};

export default TimeContext;
