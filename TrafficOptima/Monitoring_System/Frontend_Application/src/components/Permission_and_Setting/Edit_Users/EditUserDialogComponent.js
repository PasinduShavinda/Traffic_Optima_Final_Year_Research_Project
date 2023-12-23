import React, { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import CardContent from "@mui/material/CardContent";
import "../SettingStyling.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import { updatePermission } from "../../../services/PermissionAndSettings/PermissionService";

export default function EditUserDialogComponent(props) {
  const [checkedItems, setCheckedItems] = useState(["EV Prioritization"]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCheckedItems([...checkedItems, value]);
    } else {
      setCheckedItems(checkedItems.filter((item) => item !== value));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(checkedItems);
    const data = {
      permissions: checkedItems,
    };
    updatePermission(props.objectId, data)
      .then(({ data }) => {
        console.log("fetching data:", data);
        localStorage.setItem("permissions", checkedItems);
        props.handleClose();
        window.location.reload(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    const fetchData = () => {
      if (Array.isArray(props.permission)) {
        setCheckedItems(props.permission);
      } else if (props.permission) {
        setCheckedItems([props.permission]);
      }
    };

    fetchData();
  }, [props.permission]);
  return (
    <div style={{ padding: "20px" }}>
      <div>
        <h3>Update User Permisions</h3>
      </div>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset">
            <FormGroup aria-label="position" column>
              <FormControlLabel
                value="Violation Detection"
                control={
                  <Checkbox
                    checked={checkedItems.includes("Violation Detection")}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Violation Detection"
                labelPlacement="end"
              />
              <FormControlLabel
                value="EV Prioritization"
                control={
                  <Checkbox
                    checked={checkedItems.includes("EV Prioritization")}
                    onChange={handleCheckboxChange}
                  />
                }
                label="EV Prioritization"
                labelPlacement="end"
              />
              <FormControlLabel
                value="Accident Detection"
                control={
                  <Checkbox
                    checked={checkedItems.includes("Accident Detection")}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Accident Detection"
                labelPlacement="end"
              />
              {/* <FormControlLabel
                value="Traffic Optimization"
                control={
                  <Checkbox
                    checked={checkedItems.includes("Traffic Optimization")}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Traffic Optimization"
                labelPlacement="end"
              /> */}
            </FormGroup>
            <Button
              variant="contained"
              type="submit"
              style={{ width: "100%", marginTop: "20px" }}
            >
              Apply
            </Button>
          </FormControl>
        </form>
      </CardContent>
    </div>
  );
}
