import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import UsePermissionState from "../Common/usePermissionState";

export default function testSetting() {
  const [permissionState, setPermissionState] = UsePermissionState();

  const login = () => {
    const data = ["roles & permissions", "Traffic Violation Detection"];
    setPermissionState(data);
    console.log("permissionState: ", permissionState);
  };
  return (
    <div>
      <Button
        variant="contained"
        type="submit"
        style={{ width: "100%" }}
        onClick={login}
      >
        Submit
      </Button>
    </div>
  );
}
