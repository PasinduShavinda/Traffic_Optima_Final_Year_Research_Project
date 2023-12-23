import React, { useState ,useEffect } from 'react';
import axios from 'axios';
import Chart from "react-apexcharts";
import './TrafficLightSystem.css';
import Cookies from 'js-cookie';
import red from "./images/red.png"
import green from "./images/green.png"
function TrafficLightSystem() {
  const [selectedFiles, setSelectedFiles] = useState(Array(4).fill(null));
  const [uploadStatus, setUploadStatus] = useState('');
  const [lane01Value, setLane01Value] = useState(null);
  const [lane02Value, setLane02Value] = useState(null);
  const [lane03Value, setLane03Value] = useState(null);
  const [lane04Value, setLane04Value] = useState(null);
  const [lane01Bus, setLane01Bus] = useState(null);
  const [lane02Bus, setLane02Bus] = useState(null);
  const [lane03Bus, setLane03Bus] = useState(null);
  const [lane04Bus, setLane04Bus] = useState(null);
  const [buf1, setBuf1] = useState([]);
  const [buf2, setBuf2] = useState([]);
  const [buf3, setBuf3] = useState([]);
  const [buf4, setBuf4] = useState([]);
  const [lane1Color, setLane1Color] = useState(null);
const [lane2Color, setLane2Color] = useState(null);
const [lane3Color, setLane3Color] = useState(null);
const [lane4Color, setLane4Color] = useState(null);
  const handleFileUpload = (index, event) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles[index] = event.target.files[0];
    setSelectedFiles(newSelectedFiles);
  };

  const uploadVideos = async () => {
    const filledFileSlots = selectedFiles.filter((file) => file !== null);

    if (filledFileSlots.length !== 4) {
      setUploadStatus('Please select exactly four video files to upload.');
      return;
    }

    const formData = new FormData();
    filledFileSlots.forEach((file, index) => {
      formData.append('files', file, `file${index + 1}.mp4`);
    });

    try {
      const response = await axios.post('/traffic/api/upload_videos', formData, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token'),
      },
      });
      setUploadStatus(response.data.message);
    } catch (error) {
      console.error('Error uploading videos:', error);
    }
  };





    useEffect(() => {
        const fetchLane01Value = async () => {
            try {
                const response = await fetch('/traffic/get_numerical_value',{
                  method: "GET",
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('token'),
                },
                }); 
                const data = await response.json();
                setLane01Value(data.lane1);
                setLane02Value(data.lane2);
                setLane03Value(data.lane3);
                setLane04Value(data.lane4);
                setBuf1(data.buf1)
                setBuf2(data.buf2)
                setBuf3(data.buf3)
                setBuf4(data.buf4)
                setLane01Bus(data.lane1_bus)
                setLane02Bus(data.lane2_bus)
                setLane03Bus(data.lane3_bus)
                setLane04Bus(data.lane4_bus)
            } catch (error) {
                console.error('Error fetching Lane01Value value:', error);
            }
        };

        // Fetch the initial value
        fetchLane01Value();

        // Set up an interval to fetch the value periodically (e.g., every 1 seconds)
        const intervalId = setInterval(fetchLane01Value, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);
   
    useEffect(() => {
      const fetchTrafficAlgorithmData = async () => {
        try {
          const response = await fetch('/traffic/trafficAlgorithem', {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': Cookies.get('token'),
          },
          });
    
          const data = await response.json();
    
          console.log('Traffic Algorithm Data:', data);
    
          setLane1Color(data.up);
          setLane2Color(data.down);
          setLane3Color(data.left);
          setLane4Color(data.right);
        } catch (error) {
          console.error('Error fetching traffic algorithm data:', error);
        }
      };
    
      fetchTrafficAlgorithmData();
    
      const intervalId = setInterval(fetchTrafficAlgorithmData, 5000);
    
      return () => clearInterval(intervalId);
    }, []);

  

    const [chartData, setChartData] = useState({
      options: {
        chart: {
          id: "basic-bar",
        },
        stroke: {
          width: [2, 2, 2, 2], // Width of lines for each series
          curve: "smooth", // Use 'smooth' to make lines smoother
        },
        xaxis: {
          labels: {
            show: false, // Set to false to hide x-axis labels
          },
        },
      },
      series: [
        {
          name: "Lane-1",
          data: buf1,
        },
        {
          name: "Lane-2",
          data: buf2,
        },
        {
          name: "Lane-3",
          data: buf3,
        },
        {
          name: "Lane-4",
          data: buf4,
        },
      ],
    });
   

    useEffect(() => {
      // This effect will run whenever buf1, buf2, buf3, or buf4 changes
      // and will update the chartData state accordingly
      setChartData((prevChartData) => ({
        ...prevChartData,
        series: [
          {
            ...prevChartData.series[0],
            data: buf1,
          },
          {
            ...prevChartData.series[1],
            data: buf2,
          },
          {
            ...prevChartData.series[2],
            data: buf3,
          },
          {
            ...prevChartData.series[3],
            data: buf4,
          },
        ],
      }));
    }, [buf1, buf2, buf3, buf4]);
  return (
    <div className='TLS_body'>
      <h1 className='TLS_header'>Traffic Light System</h1>
 <div className='TLS_section-container'>
    <div className="test">

    <div className="TLS_horizontal-container">
      <div>
        <section className="TLS_col-sm">
            <img className = "TLS_img"  src="/video_Lane01"  onerror="this.style.display='none';" />
   
        </section>
        <table className='TLS_table'>
        <tr className='TLS_tr'>

    {/* <th className='TLS_th'> {lane1Color}</th> */}
    
      {lane1Color === 'green' ? (
        <img src={green}  alt="green" style={{ width: '100px', height: '50px' }}/>
      ) : lane1Color === 'red' ? (
        <img src={red} alt="red" style={{ width: '100px', height: '50px' }}/>
      ) : (
        lane1Color
      )}
  
    
  </tr>
  <tr>
  <td className='TLS_td'> Normal Vehicle</td>
    <td className='TLS_td'>{lane01Value}</td>
    
  </tr>
  <tr>
  <td className='TLS_td'> Bus</td>
    <td className='TLS_td'>{lane01Bus}</td>
    
  </tr>
  </table>
  </div>
  <div>
        <section className="TLS_col-sm">
            <img className = "TLS_img"  src="/video_Lane02" onerror="this.style.display='none';"/>
        </section>
        <table className='TLS_table'>
        <tr className='TLS_tr'>
 
  {lane2Color === 'green' ? (
        <img src={green}  alt="green" style={{ width: '100px', height: '50px' }}/>
      ) : lane2Color === 'red' ? (
        <img src={red} alt="red" style={{ width: '100px', height: '50px' }}/>
      ) : (
        lane2Color
      )}
    
  </tr>
  <tr>
  <td className='TLS_td'> Normal Vehicle</td>
    <td className='TLS_td'>{lane02Value}</td>
    
  </tr>
  <tr>
  <td className='TLS_td'> Bus</td>
    <td className='TLS_td'>{lane02Bus}</td>
    
  </tr>
  </table>
  </div>
    </div>

   
    <div className="TLS_horizontal-container">
      <div>
        <section className="TLS_col-sm">
            <img  className = "TLS_img" src="/video_Lane03" onerror="this.style.display='none';"/>
        </section>
        <table className='TLS_table'>
        <tr className='TLS_tr'>
  
  {lane3Color === 'green' ? (
        <img src={green}  alt="green" style={{ width: '100px', height: '50px' }}/>
      ) : lane3Color === 'red' ? (
        <img src={red} alt="red" style={{ width: '100px', height: '50px' }}/>
      ) : (
        lane3Color
      )}
    
  </tr>
  <tr>
  <td className='TLS_td'>Normal Vehicle</td>
    <td className='TLS_td'>{lane03Value}</td>
    
  </tr>
  <tr>
  <td className='TLS_td'>Bus</td>
    <td className='TLS_td'>{lane03Bus}</td>
    
  </tr>
  </table>
        </div>
        
        <div>
        <section className="TLS_col-sm">
            <img className = "TLS_img"  src="/video_Lane04" onerror="this.style.display='none';"/>
        </section>
        <table className='TLS_table'>
        <tr className='TLS_tr'>
  
  {lane4Color === 'green' ? (
        <img src={green}  alt="green" style={{ width: '100px', height: '50px' }}/>
      ) : lane4Color === 'red' ? (
        <img src={red} alt="red" style={{ width: '100px', height: '50px' }}/>
      ) : (
        lane4Color
      )}
    
  </tr>
  <tr>
  <td className='TLS_td'>Normal Vehicle</td>
    <td className='TLS_td'>{lane04Value}</td>
    
  </tr>
  <tr>
  <td className='TLS_td'>Bus</td>
    <td className='TLS_td'>{lane04Bus}</td>
    
  </tr>
  </table>
        </div>
         <div>
     
    </div>
    </div>
   
</div>


<div className="test">
 <div className="TLS_upload-container">
      <div >
        <h2 className='TLS_header'>Traffic volume comparison</h2>
        <div >
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="line"
            width="500"
          />
        </div>
      </div>
    </div>


    <section >
      <div className="TLS_upload-container">
        {selectedFiles.map((file, index) => (
          <div key={index}>
            <input type="file" accept=".mp4" onChange={(e) => handleFileUpload(index, e)} />
            {/* <p>File {index + 1}: {file ? file.name : 'No file selected'}</p> */}
          </div>
        ))}
        <button className="TLS_upload-button" onClick={uploadVideos}>Upload Videos</button>
        <p className="TLS_upload-status">{uploadStatus}</p>
      </div>
      </section>
      
</div>
</div>
    </div>
  );
}

export default TrafficLightSystem;

