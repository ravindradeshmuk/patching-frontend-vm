import React, { useEffect, useState } from "react";
import axios from "axios";

const DataTable = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/client/data/api/tableData")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching the data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <table border="1">
      <thead>
        <tr>
          {Object.keys(data).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {Object.values(data).map((value, index) => (
            <td key={index}>{value}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default DataTable;
