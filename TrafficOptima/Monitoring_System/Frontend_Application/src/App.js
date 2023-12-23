import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";
import Violations from "./components/Violations/ViolationsMain";
import EVPMainComponent from "./components/Emergency_vehicle_prioritization/EVP_Main_Component";
import TrafficLightSystem from "./components/Traffic_Light_System/TrafficMoniteringSysyem";
import ASDMainComponent from "./components/Accident_Severity_Detection/MainComponent/ASDMainComponent";
import HomePage from "./components/HomeComponets/HomePage";
import MiniDrawer from "./components/HomeComponets/Drawer";
import FirstHeader from "./components/Common/Header";
import Siginin from "./components/UserManagement/Signin/Signin";
import Login from "./components/UserManagement/Login/Login";
import Organization_Main from "./components/Organization_Management/Organization_Main";
import EditOrganization from "./components/Organization_Management/EditOrganization";
import UserProfile from "./components/UserManagement/UserProfile";
import PlansPricing from "./components/Plans&Pricing/PlansPricing";
import PGMain from "./components/Plans&Pricing/PaymentGateway/PGMain";
import SettingPage from "./components/Permission_and_Setting/SettingPage";
import { getUserById } from "./services/PermissionAndSettings/PermissionService";
class App extends Component {
  state = {
    authenticated: localStorage.getItem("user"),
    permissions: localStorage.getItem("permissions"),
  };
  componentDidMount() {
    getUserById(localStorage.getItem("userId"))
      .then(({ data }) => {
        console.log("fetching data:", data);
        if (Array.isArray(data.permissions)) {
          this.setState({ permissions: data.permissions });
        } else if (data.permissions) {
          this.setState({ permissions: data.permissions });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  render() {
    const { authenticated, permissions } = this.state;
    return (
      <div>
        {!authenticated ? (
          <div>
            <FirstHeader />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Siginin" element={<Siginin />} />
              <Route path="/Login" element={<Login />} />
            </Routes>
          </div>
        ) : (
          <div>
            <MiniDrawer currentUser={this.state.currentUser}>
              <div style={{ marginTop: "4rem" }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/violations"
                    element={
                      permissions.includes("Violation Detection") ? (
                        <Violations />
                      ) : (
                        <PlansPricing />
                      )
                    }
                  />
                  <Route
                    path="/evp/home"
                    element={
                      permissions.includes("EV Prioritization") ? (
                        <EVPMainComponent />
                      ) : (
                        <PlansPricing />
                      )
                    }
                  />
                  <Route
                    path="/Traffic_Light_System"
                    element={<TrafficLightSystem />}
                  />
                  <Route
                    path="/asd-main"
                    element={
                      permissions.includes("Accident Detection") ? (
                        <ASDMainComponent />
                      ) : (
                        <PlansPricing />
                      )
                    }
                  />
                  <Route
                    path="/Organization_Main"
                    element={<Organization_Main />}
                  />
                  <Route
                    path="/editOrganizations/:id"
                    element={<EditOrganization />}
                  />
                  <Route path="/userprofile" element={<UserProfile />} />
                  <Route path="/plans-pricing" element={<PlansPricing />} />
                  <Route path="/payment-card" element={<PGMain />} />
                  <Route
                    path="/permission-settings"
                    element={<SettingPage />}
                  />
                </Routes>
              </div>
            </MiniDrawer>
          </div>
        )}

        {/* <AppFooter/> */}
      </div>
    );
  }
}

export default App;
