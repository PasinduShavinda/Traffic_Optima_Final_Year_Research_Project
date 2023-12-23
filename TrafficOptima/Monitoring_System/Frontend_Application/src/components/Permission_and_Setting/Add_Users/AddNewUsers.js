import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import { useEffect } from "react";
import { useState } from "react";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import "../SettingStyling.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { addNewUsers } from "../../../services/PermissionAndSettings/PermissionService";
import swal from "sweetalert";
const ariaLabel = { "aria-label": "description" };

export default function AddNewUsers() {
  const [formData, setFormData] = useState({
    serialNumber: "",
    email: "",
    password: "",
    newPassword: "",
  });
  const [personName, setPersonName] = React.useState([]);

  const [errors, setErrors] = useState({});
  const [checkedItems, setCheckedItems] = useState([]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCheckedItems([...checkedItems, value]);
    } else {
      setCheckedItems(checkedItems.filter((item) => item !== value));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serialNumber) {
      newErrors.serialNumber = "Serial number is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const additionalItems = ["Permission and Settings"];
    if (validateForm()) {
      const data = {
        organization_id: localStorage.getItem("organization_id"),
        employee_no: formData.serialNumber,
        email: formData.email,
        password: null,
        permissions: checkedItems.concat(additionalItems),
        organization_name: localStorage.getItem("organization_name"),
      };
      const result = addNewUsers(data)
        .then((response) => {
          console.log(response.data);
          formData.serialNumber = "";
          formData.email = "";
          swal("Successful!", "Successfully Created User ✅ ", "success");
          setCheckedItems([]);
        })
        .catch((error) => {
          console.log(error);
          swal("Failed!", "Failed to create user ❗️❗️ ", "error");
        });
      console.log("Form submitted:", data);
    } else {
      console.log("Form has errors. Please correct them.");
    }
    console.log(checkedItems);
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  return (
    <div style={{ margin: "20px" }}>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 4, md: 4 }}
        style={{ marginLeft: "10px" }}
      >
        <Grid item xs={6}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Employee No:</label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, serialNumber: e.target.value })
                  }
                />
                {errors.serialNumber && (
                  <span className="errorSetting">{errors.serialNumber}</span>
                )}
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <span className="errorSetting">{errors.email}</span>
                )}
              </div>
              {/* <button type="submit">Submit</button> */}
              <div style={{ float: "right", marginTop: "20px" }}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ width: "100%" }}
                >
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Grid>
        <Grid item xs={6} style={{ marginTop: "40px" }}>
          <label style={{ marginRight: "50px" }}>Permission:</label>
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
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
}
