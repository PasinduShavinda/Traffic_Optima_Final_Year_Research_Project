// usePermissionState.js
import { useState } from "react";

const usePermissionState = () => {
  const [permissionState, setPermissionState] = useState(null);

  const setPermissionStateValue = (value) => {
    setPermissionState(value);
  };

  return [permissionState, setPermissionStateValue];
};

export default usePermissionState;
