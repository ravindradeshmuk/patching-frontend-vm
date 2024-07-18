const fetchData = async () => {
    try {
      const response = await axios.get(`${apiDomain}/client/data/api/tableData?includeId=true`);
      if (response.status !== 200) throw new Error('Network response was not ok');
  
      const rawData = response.data;
      const transformedData = transformData(rawData);
  
      // Update the filter condition to get TW clients
      const twData = transformedData.filter(row =>
        row["selectedTracker"] === "tw" && row["Read Only"] === "No"
      );
  
      // ... rest of the code remains the same ...
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };