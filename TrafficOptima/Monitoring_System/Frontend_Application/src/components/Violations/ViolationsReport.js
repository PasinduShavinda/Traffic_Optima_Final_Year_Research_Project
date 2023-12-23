import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import Badge from "react-bootstrap/Badge";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function ViolationsReport() {
  const [selectedLocation, setSelectedLocation] = useState("default_l");
  const [records, setRecords] = useState([]);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/recorded-violations");
      const jsonData = await response.json();

      console.log(jsonData);
      setRecords(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add generated date and time
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    doc.setFontSize(12);
    doc.text(
      `Detected Violation Report - Generated on: ${formattedDate}`,
      10,
      10
    );

    // Generate the table content
    const tableData = records.map((entry, index) => [
      entry.vehicle_id,
      entry.speed,
      entry.status,
      entry.file_name,
    ]);

    doc.autoTable({
      head: [["Vehicle Id", "Speed", "Status", "File Name"]],
      body: tableData,
    });

    doc.save("Violation Report.pdf"); // Save the PDF with a filename
  };

  return (
    <div>
      <div>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={generatePDF}
        >
          Download
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Image</TableCell>
              <TableCell align="right">Vehicle Id</TableCell>
              <TableCell align="right">Speed (km/h)</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="right">
                  {/* <img
                    src={require(`../../../../Server_Application/Flask_Server/Functions/Violation_Detection/SpeedRecord/exceeded/${row.file_name}`)}
                    alt="lllk"
                    width={100}
                    height={100}
                  /> */}
                </TableCell>
                <TableCell align="right">{row.vehicle_id}</TableCell>
                <TableCell align="right">{row.speed}</TableCell>
                <TableCell align="right">
                  <Badge bg="danger">{row.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
