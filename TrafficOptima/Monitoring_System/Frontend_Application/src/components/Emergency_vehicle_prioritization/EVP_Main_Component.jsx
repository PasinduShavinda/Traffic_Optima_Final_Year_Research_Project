import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import EVP_Output_Display_Component from "./EVP_Output_Display_Component";
import EVPLogs from "./EVPLogs";
import { getSettingByUserId } from "../../services/PermissionAndSettings/SettingService";
import swal from "sweetalert";
export default function EVPMainComponent() {
  const [value, setValue] = React.useState("one");
  const [logs, setLogs] = React.useState([]);
  const id = localStorage.getItem("userId");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const fetchSettingsById = () => {
      getSettingByUserId(id)
        .then(({ data }) => {
          console.log("fetching datasssss:", data);
          const response = data.settings_list;
          if (response.includes("EV Prioritization")) {
            fetchData();
          } else {
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
      const response = await fetch("/evp_logs");
      const jsonData = await response.json();
      console.log(jsonData[0]);
      setLogs(jsonData);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        margin: "1rem",
        flexDirection: "column",
        width: window.innerWidth - 130,
      }}
    >
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
            textColor="primary"
            indicatorColor="primary"
            aria-label="secondary tabs example"
          >
            <Tab value="one" label="Emergency Vehicle Prioritization" />
            <Tab value="two" label="System Logs" />
          </Tabs>
        </Box>
      </div>
      {(value === "one" && <EVP_Output_Display_Component />) ||
        (value === "two" && <EVPLogs logs={logs} />)}
    </div>
  );
}
