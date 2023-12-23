import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Cookies from "js-cookie";

function ASDAnalytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/accident/getASDlogs', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Authorization': Cookies.get('token')
        },
      });
      const jsonData = await response.json();
      setData(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Process the fetched data to count the number of moderate and severe accidents by location
  const processData = () => {
    // Initialize counts and create a map to store counts by location
    const locationCounts = new Map();

    // Loop through the fetched data and count accidents by location and severity
    data.forEach((entry) => {
      const location = entry.Location;
      const severity = entry.Accident_Severity;

      // Initialize the count for the location if it doesn't exist
      if (!locationCounts.has(location)) {
        locationCounts.set(location, { moderate: 0, severe: 0 });
      }

      if (severity === 'moderate-accident') {
        locationCounts.get(location).moderate++;
      } else if (severity === 'severe-accident') {
        locationCounts.get(location).severe++;
      }
    });

    return locationCounts;
  };

  const chartData = {
    options: {
      chart: {
        id: 'accident-severity',
      },
      xaxis: {
        categories: Array.from(processData().keys()), // Use location names as categories
      },
    },
    series: [
      {
        name: 'Moderate Accidents',
        data: Array.from(processData().values()).map((counts) => counts.moderate),
      },
      {
        name: 'Severe Accidents',
        data: Array.from(processData().values()).map((counts) => counts.severe),
      },
    ],
  };

  return (
    <div style={{
      display: "flex",
      margin: "3rem",
      flexDirection: "column",
      width: window.innerWidth - 450,
      marginTop:'-10px'
    }}>
      <div>
        <br />
        <br />
        <Chart options={chartData.options} series={chartData.series} type="bar" width="800" />
      </div>
    </div>
  );
}

export default ASDAnalytics;
