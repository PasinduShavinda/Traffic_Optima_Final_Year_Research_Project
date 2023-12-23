import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AddOrganizations from "./addOrganization";
import AllOrganizations from "./AllOrganizations";


export default function Organization_Main() {
  const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{
      display: "flex",
      margin: "3rem",
      flexDirection: "column",
      width: window.innerWidth - 270,
  }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab value="one" label="Add Organisations" />
            <Tab value="two" label="Organization management"/>
           
          </Tabs>
        </Box>
      </div>
      {value === "one" && <AddOrganizations /> ||  value === "two" && <AllOrganizations/>}
    </div>
  );
}