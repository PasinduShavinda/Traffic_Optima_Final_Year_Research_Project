import React, { useState, useEffect } from 'react';
import '../../components/Accident_Severity_Detection/ASDstylesLogs.css';

function ASDLatestLog() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/accident/getASDlogs');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Get the last logged record
  const lastLoggedRecord = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="au_container">
      <h1 className="au_heading">Latest Accident Detection Log</h1>
      <table className="au_table-container">
        <thead>
          <tr>
            <th className="au_table-header">Date & Time</th>
            <th className="au_table-header">Location</th>
            <th className="au_table-header">Accident Severity</th>
          </tr>
        </thead>
        <tbody>
          {lastLoggedRecord && (
            <tr>
              <td className="au_table-cell">{lastLoggedRecord.Date_Time}</td>
              <td className="au_table-cell">{lastLoggedRecord.Location}</td>
              <td className="au_table-cell">{lastLoggedRecord.Accident_Severity}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ASDLatestLog;
