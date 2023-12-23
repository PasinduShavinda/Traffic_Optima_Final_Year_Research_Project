import React from 'react';
import '../CameraMonitoring/ASDstylesOutput.css'

const OutputVideoComponent = () => {

  return (
    <div>
      <div>
        <div>
          <img src="/video" alt="Output Video" style={{
            width: 500,
            height: 300,
          }} />
        </div>
      </div>
    </div>
  );
};

export default OutputVideoComponent;
