import React from "react";
import OurServices from "./OurServices";
import Plans from "./Plans";
import ImageSlider from "./ImageSlider";

export default function HomePage() {
  return (
    <div
      style={{
        margin: "1rem",
        maxHeight: "85vh",
        overflow: "auto",
      }}
    >
      <ImageSlider />
      <OurServices />
      <Plans />
    </div>
  );
}
