import React, { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import CardContent from "@mui/material/CardContent";
import "../SettingStyling.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import {
  addNewSettings,
  getSettingByUserId,
} from "../../../services/PermissionAndSettings/SettingService";
import swal from "sweetalert";

import { getUserById } from "../../../services/PermissionAndSettings/PermissionService";

export default function SettingComponent() {
  const [checkedItems, setCheckedItems] = useState(["EV Prioritization"]);
  const [checkedSettingsItems, setCheckedSettingsItems] = useState([
    "EV Prioritization",
  ]);
  const id = localStorage.getItem("userId");

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCheckedSettingsItems([...checkedSettingsItems, value]);
    } else {
      setCheckedSettingsItems(
        checkedSettingsItems.filter((item) => item !== value)
      );
    }
  };

  useEffect(() => {
    const fetchDataById = () => {
      getUserById(id)
        .then(({ data }) => {
          console.log("fetching data:", data);
          if (Array.isArray(data.permissions)) {
            setCheckedItems(data.permissions);
          } else if (data.permissions) {
            setCheckedItems([data.permissions]);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    fetchDataById();
    fetchSettingsById();
  }, []);
  const fetchSettingsById = () => {
    getSettingByUserId(id)
      .then(({ data }) => {
        console.log("fetching datasssss:", data);
        if (Array.isArray(data.settings_list)) {
          setCheckedSettingsItems(data.settings_list);
        } else if (data.settings_list) {
          setCheckedSettingsItems([data.settings_list]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(checkedItems);
    const data = {
      organization_id: localStorage.getItem("organization_id"),
      settings_list: checkedSettingsItems,
      user_id: localStorage.getItem("userId"),
    };
    addNewSettings(data)
      .then(({ data }) => {
        console.log("fetching data:", data);
        // localStorage.setItem("permissions", checkedSettingsItems);
        swal("Successful!", "Successfully Updated ✅ ", "success");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  return (
    <div>
      <div style={{ padding: "20px" }}>
        <div>
          <h3>Settings:</h3>
        </div>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormControl component="fieldset">
              <FormGroup aria-label="position" column>
                <FormControlLabel
                  value="Violation Detection"
                  control={
                    <Checkbox
                      checked={checkedSettingsItems.includes(
                        "Violation Detection"
                      )}
                      onChange={handleCheckboxChange}
                      // disabled={!checkedItems.includes("Violation Detection")}
                    />
                  }
                  label="Violation Detection"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="EV Prioritization"
                  control={
                    <Checkbox
                      checked={checkedSettingsItems.includes(
                        "EV Prioritization"
                      )}
                      onChange={handleCheckboxChange}
                      disabled={!checkedItems.includes("EV Prioritization")}
                    />
                  }
                  label="EV Prioritization"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="Accident Detection"
                  control={
                    <Checkbox
                      checked={checkedSettingsItems.includes(
                        "Accident Detection"
                      )}
                      onChange={handleCheckboxChange}
                      disabled={!checkedItems.includes("Accident Detection")}
                    />
                  }
                  label="Accident Detection"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="Traffic Optimization"
                  control={
                    <Checkbox
                      checked={checkedSettingsItems.includes(
                        "Traffic Optimization"
                      )}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Traffic Optimization"
                  labelPlacement="end"
                />
              </FormGroup>
              <Button
                variant="contained"
                type="submit"
                style={{ width: "100%", marginTop: "20px" }}
              >
                Run
              </Button>
            </FormControl>
          </form>
        </CardContent>
      </div>
    </div>
  );
}
