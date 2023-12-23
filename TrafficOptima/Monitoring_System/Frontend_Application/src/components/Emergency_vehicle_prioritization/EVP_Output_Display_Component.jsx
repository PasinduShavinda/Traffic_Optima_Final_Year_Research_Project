import React, { useEffect, useState } from "react";
import "./EVP_Controll_Component.css";
import police from "./Resources/police.png";
import nonev from "./Resources/nonev.png";
import ambulance from "./Resources/ambulance.png";
import firetruck from "./Resources/firetruck.png";
import siren from "./Resources/siren.jpg";
import sound from "./Resources/sound.jpg";
import { send_file_path } from "../../services/Emergency_vehicle_prioritization/EVP_Service";
import Cookies from "js-cookie";
import { Paper } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import colors from "../Common/colors";

export default function EVPOutputDisplayComponent() {
  const [outputs1, setOutputs1] = useState({
    lane1: {
      is_ev_detected: false,
      ev_type: "Non-EV",
      siren_light_on: false,
      siren_sound_on: false,
      time_detected: "",
    },
    lane2: {
      is_ev_detected: false,
      ev_type: "Non-EV",
      siren_light_on: false,
      siren_sound_on: false,
      time_detected: "",
    },
    lane3: {
      is_ev_detected: false,
      ev_type: "Non-EV",
      siren_light_on: false,
      siren_sound_on: false,
      time_detected: "",
    },
    lane4: {
      is_ev_detected: false,
      ev_type: "No-EV",
      siren_light_on: false,
      siren_sound_on: false,
      time_detected: "",
    },
  });
  const [outputs2, setOutputs2] = useState({});
  const [outputs3, setOutputs3] = useState({});
  const [outputs4, setOutputs4] = useState({});
  const [isVideo, setIsVideo] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchLane01Value = async () => {
      try {
        const response = await fetch("/emergency/evp_updates1", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: Cookies.get("token"),
          },
        });
        const data = await response.json();
        setOutputs1(data);
      } catch (error) {
        console.error("Error fetching Lane01Value value:", error);
      }
    };

    const fetchLane02Value = async () => {
      try {
        const response = await fetch("/emergency/evp_updates2", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: Cookies.get("token"),
          },
        });
        const data = await response.json();
        setOutputs2(data);
      } catch (error) {
        console.error("Error fetching Lane01Value value:", error);
      }
    };

    const fetchLane03Value = async () => {
      try {
        const response = await fetch("/emergency/evp_updates3", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: Cookies.get("token"),
          },
        });
        const data = await response.json();
        setOutputs3(data);
      } catch (error) {
        console.error("Error fetching Lane01Value value:", error);
      }
    };

    const fetchLane04Value = async () => {
      try {
        const response = await fetch("/emergency/evp_updates4", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: Cookies.get("token"),
          },
        });
        const data = await response.json();
        setOutputs4(data);
      } catch (error) {
        console.error("Error fetching Lane01Value value:", error);
      }
    };

    fetchLane01Value();
    fetchLane02Value();
    fetchLane03Value();
    fetchLane04Value();

    const intervalId1 = setInterval(fetchLane01Value, 1000);
    const intervalId2 = setInterval(fetchLane02Value, 1000);
    const intervalId3 = setInterval(fetchLane03Value, 1000);
    const intervalId4 = setInterval(fetchLane04Value, 1000);

    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
      clearInterval(intervalId3);
      clearInterval(intervalId4);
    };
  }, []);

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const file_path_handle = async () => {
    await send_file_path(selectedLocation)
      .then(() => {
        setIsVideo(true);
      })
      .catch((error) => console.log(error));
  };

  const output = (lane) => {
    console.log(isVideo);
    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
        }}
      >
        {lane.ev_type === "Ambulance" ? (
          <img src={ambulance} width={90} height={60} alt="ev" />
        ) : lane.ev_type === "Police-Vehicle" ? (
          <img src={police} width={60} height={60} alt="ev" />
        ) : lane.ev_type === "Fire-Truck" ? (
          <img src={firetruck} width={50} height={50} alt="ev" />
        ) : (
          <img src={nonev} width={60} height={60} alt="ev" />
        )}

        <div style={{ marginBottom: "1rem", display:"flex", alignItems:"center" }}>
          <img src={siren} width={60} height={60} alt="ev" style={{marginLeft:"-10px"}}/>
          <div className="form-check form-switch">
            <input
              className="form-check-input custom-switch"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckCheckedDisabled"
              checked={lane.siren_light_on}
              style={{
                borderColor: "lightblue",
                borderWidth: "2px",
                width: "3rem",
                height: "1.5rem",
              }}
            />
          </div>
        </div>
        {lane.siren_sound_on ? (
          <VolumeUpIcon sx={{ fontSize: "3rem", color: colors.primary }} />
        ) : (
          <VolumeOffIcon sx={{ fontSize: "3rem", color: colors.primary }} />
        )}
      </div>
    );
  };

  const renderImages = () => {
    const images = [];
    for (let i = 1; i < 5; i++) {
      images.push(
        <div
          style={{
            padding: "0rem",
            width: 460,
            height: 300,
            marginBottom: "2rem",
            marginRight: "10rem",
          }}
        >
          <div className="image-container" key={`lane${i}`}>
            <h3>Lane {i}</h3>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems:"center"
              }}
            >
              {isVideo ? (
                <div
                  style={{
                    minWidth: 450,
                    minHeight: 250,
                    backgroundColor: "black",
                    borderRadius: 10,
                    display: "flex",
                    marginRight: "1rem",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    style={{ alignSelf: "center" }}
                    src={`/video${i}`}
                    alt={`Output Video ${i}`}
                    width={430}
                    height={230}
                  />
                </div>
              ) : (
                <div
                  style={{
                    minWidth: 450,
                    minHeight: 250,
                    backgroundColor: "black",
                    borderRadius: 10,
                    display: "flex",
                    marginRight: "1rem",
                    color: "white",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  No Signal
                </div>
              )}

              <div className="out-puts">
                {i === 1
                  ? output(outputs1)
                  : i === 2
                  ? output(outputs2)
                  : i === 3
                  ? output(outputs3)
                  : output(outputs4)}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return images;
  };

  return (
    <>
      <div className="main_container" style={{ width: "100%" }}>
        <Paper
          elevation={10}
          className="selection_options"
          style={{
            marginLeft: "2rem",
            padding: "2rem",
            display: "flex",
            marginTop:"2rem"
          }}
        >
          <div style={{ flex: 1 }}>
            <div className="selection1" style={{marginBottom:"1rem"}} >
              <select
                className="form-select"
                aria-label="Default select example"
                value={selectedLocation}
                onChange={handleLocationChange}
              >
                <option selected>Select Intersection Location</option>
                <option value="Kollupitya">Kollupitya</option>
                <option value="Bambalapitiya">Bambalapitiya</option>
                <option value="Nugegoda">Nugegoda</option>
              </select>
            </div>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => file_path_handle()}
            >
              Start
            </button>
          </div>
          <div style={{ flex: 3.4 }}></div>
        </Paper>
        <Paper
          elevation={10}
          style={{
            display: "flex",
            padding: "1rem",
            marginLeft: "2rem",
            marginTop: "1rem",
            marginBottom: "1rem",
            justifyContent:"center"
          }}
        >
          <div className="image-grid" style={{ padding: "1rem" }}>
            {renderImages()}
          </div>
        </Paper>
      </div>
    </>
  );
}
