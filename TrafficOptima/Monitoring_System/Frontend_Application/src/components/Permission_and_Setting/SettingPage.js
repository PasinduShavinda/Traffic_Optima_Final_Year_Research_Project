import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddNewUsers from "./Add_Users/AddNewUsers";
import EditUsersComponent from "./Edit_Users/EditUsersComponent";
import SettingComponent from "./Settings/SettingComponent";

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

export default function SettingPage() {
  const [value, setValue] = React.useState(2);
  const role = localStorage.getItem("role");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ margin: "40px", width: window.innerWidth - 200 }}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab
              label="Add Users"
              {...a11yProps(0)}
              disabled={role !== "org_admin"}
            />
            <Tab label="Edit Users" disabled={role !== "org_admin"} />
            <Tab label="App Settings" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <AddNewUsers />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <EditUsersComponent />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <SettingComponent />
        </CustomTabPanel>
      </Box>
    </div>
  );
}
