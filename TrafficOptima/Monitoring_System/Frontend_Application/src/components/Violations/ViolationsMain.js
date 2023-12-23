import React, { useState } from "react";
import "./ViolationsMain.css";
import Form from "react-bootstrap/Form";
//import { loadViolationRecords } from "../../services/Violations/Violations";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import ViolationsReport from "./ViolationsReport";
import test from "./test.png";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Badge from "react-bootstrap/Badge";
import Cookies from "js-cookie";
import { getSettingByUserId } from "../../services/PermissionAndSettings/SettingService";
import Button from "@mui/material/Button";
import swal from "sweetalert";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Violations() {
  const [selectedLocation, setSelectedLocation] = useState("/helmet_detection");
  const [records, setRecords] = useState([]);
  const [value, setValue] = React.useState(0);
  const [location_list, setLocation_list] = React.useState("");
  const id = localStorage.getItem("userId");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchSettingsById = () => {
      getSettingByUserId(id)
        .then(({ data }) => {
          console.log("fetching datasssss:", data);
          const response = data.settings_list;
          if (response.includes("Violation Detection")) {
            fetchData();
          } else {
            // window.location = "/permission-settings";
            swal("Failed!", "Cannot Load ❗️❗️ ", "error");
            setTimeout(() => {
              window.location = "/permission-settings";
            }, 1500);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    fetchSettingsById();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/recorded-violations", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      const jsonData = await response.json();

      console.log(jsonData);
      setRecords(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
    // window.location.reload();
  };
  const lastViolationRecord =
    records.length > 0 ? records[records.length - 1] : null;

  const handleViolationChange = (event) => {
    setLocation_list(event.target.value);
  };
  const runViolations = () => {
    try {
      const response = fetch("/speed_detection", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
      const jsonData = response.json();

      console.log(jsonData);
      setRecords(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="main_body">
      <div className="violation_container">
        <div>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Main App" {...a11yProps(0)} />
                <Tab label="Report" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <div className="violation_row">
                <div style={{ width: "400px" }}>
                  {/* <Button variant="contained" onClick={runViolations}>
                    Contained
                  </Button> */}
                  {/* <label>Location:</label> */}
                  <InputLabel id="demo-simple-select-label">Camera</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedLocation}
                    label="Age"
                    onChange={handleLocationChange}
                    className="select_styling_violations"
                  >
                    <MenuItem value="/speed_detection">Camera - 01</MenuItem>
                    <MenuItem value="/helmet_detection">Camera - 02</MenuItem>
                    <MenuItem value="/wrong_side_detection">
                      Camera - 03
                    </MenuItem>
                  </Select>
                  <br />
                  <div>
                    <table width="100%">
                      {lastViolationRecord && (
                        <div className="violation_main_image">
                          <br />
                          <br />
                          {/* <img
                            src={require(`../../../../Server_Application/Flask_Server/Functions/Violation_Detection/SpeedRecord/exceeded/${lastViolationRecord.file_name}`)}
                            alt="#"
                            width={200}
                            height={200}
                          /> */}
                          <div>
                            <p>Vehicle ID: {lastViolationRecord.vehicle_id}</p>
                            <p>Speed (km/h): {lastViolationRecord.speed}</p>
                            <p>
                              Vehicle Status:{" "}
                              <Badge bg="danger">
                                {lastViolationRecord.status}
                              </Badge>
                            </p>
                          </div>
                        </div>
                      )}
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    width: "620px",
                    height: "400px",
                    backgroundColor: "black",
                  }}
                >
                  <div className="video-frame-styleing">
                    <img
                      src={`${selectedLocation}`}
                      alt="Output Video"
                      width={600}
                      height={400}
                    />
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <ViolationsReport />
            </CustomTabPanel>
          </Box>
        </div>
      </div>
    </div>
  );
}
// ${file_name}
// {records.map((item, index) => (
// <tr key={index}>
//   <td><img src={`../../../../Server_Application/Flask_Server/SpeedRecord/${item.file_name}`} alt="#"/></td>
//   <td>{item.vehicle_id}</td>
//   <td>{item.status}</td>
// </tr>
// ))}
