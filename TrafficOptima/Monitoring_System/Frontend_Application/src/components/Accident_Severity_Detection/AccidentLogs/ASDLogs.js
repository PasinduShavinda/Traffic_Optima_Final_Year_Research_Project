import React, { useState, useEffect } from 'react';
import '../AccidentLogs/ASDstylesLogs.css'
import 'font-awesome/css/font-awesome.min.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Cookies from "js-cookie";

function ASDLogs() {

  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('Date_Time'); // Default sorting by Date_Time
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/accident/getASDlogs', {
        method: 'GET', headers: {
          Accept: 'application/json',
          'Authorization': Cookies.get('token')
        },
      });
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const sortedData = data.sort((a, b) => {
    const aValue = new Date(a.Date_Time);
    const bValue = new Date(b.Date_Time);

    if (aValue < bValue) return sortOrder === 'asc' ? 1 : -1;
    if (aValue > bValue) return sortOrder === 'asc' ? -1 : 1;
    return 0;
  });

  // Filter the data based on the search query
  const filteredData = sortedData.filter((entry) =>
    entry.Location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.Date_Time.toLowerCase().includes(searchQuery.toLowerCase()) || // Add other fields here
    entry.Accident_Severity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Function to render sorting icons
  const renderSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? <i className="fa fa-sort-up"></i> : <i className="fa fa-sort-down"></i>;
    }
    return <i className="fa fa-sort"></i>;
  };

  // Function to generate the PDF

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add generated date and time
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    doc.setFontSize(12);
    doc.text(`Accident Detection Logs - Generated on: ${formattedDate}`, 10, 10);

    // Generate the table content
    const tableData = filteredData.map((entry, index) => [
      entry.Date_Time,
      entry.Location,
      entry.Accident_Severity,
    ]);

    doc.autoTable({
      head: [['Date & Time', 'Location', 'Accident Severity']],
      body: tableData,
    });

    doc.save('accident_logs.pdf'); // Save the PDF with a filename
  };

  return (
    <div style={{
      display: "flex",
      margin: "3rem",
      flexDirection: "column",
      width: window.innerWidth - 350,
    }}>
      <div className="aus_container">
        <button className='pdfbtns' onClick={generatePDF}>
          <i className="fa fa-download"></i>
        </button>
        <input
          className='aus_schbr'
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{width:'200px', marginLeft:'497px'}}
        />
        <table className="aus_table-container">
          <thead>
            <tr>
              <th className="aus_table-header" onClick={() => handleSort('Date_Time')}>
                Date & Time {renderSortIcon('Date_Time')}
              </th>
              <th className="aus_table-header" onClick={() => handleSort('Location')}>
                Location {renderSortIcon('Location')}
              </th>
              <th className="aus_table-header" onClick={() => handleSort('Accident_Severity')}>
                Accident Severity {renderSortIcon('Accident_Severity')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'aus_table-row-even' : ''}
              >
                <td className="aus_table-cell">{entry.Date_Time}</td>
                <td className="aus_table-cell">{entry.Location}</td>
                <td className="aus_table-cell">{entry.Accident_Severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ASDLogs;