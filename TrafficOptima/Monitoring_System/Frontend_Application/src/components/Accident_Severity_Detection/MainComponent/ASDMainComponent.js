import React, { useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ASDCamMonitoring from "../CameraMonitoring/ASDCamMonitoring";
import ASDEmgServContactMain from "../EmgServiceContact/ASDEmgServContactMain";
import ASDLogs from "../AccidentLogs/ASDLogs";
import ASDAnalytics from "../AccidentAnalytics/ASDAnalytics";
import { getSettingByUserId } from "../../../services/PermissionAndSettings/SettingService";
import swal from "sweetalert";

export default function ASDMainComponent() {
  const [value, setValue] = React.useState("one");
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
          if (response.includes("Accident Detection")) {
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <br></br>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label="secondary tabs example"
          >
            <Tab value="one" label="Accident Severity Detection" />
            <Tab value="two" label="Accident Logs" />
            <Tab value="three" label="Accident Analytics" />
            <Tab value="four" label="Emergency Services" />
          </Tabs>
        </Box>
      </div>
      {(value === "one" && <ASDCamMonitoring />) ||
        (value === "two" && <ASDLogs />) ||
        (value === "three" && <ASDAnalytics />) ||
        (value === "four" && <ASDEmgServContactMain />)}
    </div>
  );
}
