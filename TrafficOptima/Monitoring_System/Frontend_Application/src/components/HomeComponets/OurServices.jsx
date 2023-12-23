import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function OurServices() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div style={{ marginTop: "2rem", marginBottom: "4rem" }}>
      <h1>Our Services</h1>
      <div style={{ marginTop: "2rem", marginBottom: "4rem" }}>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <h4>Traffic Optimization</h4>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Using advanced real-time traffic data, the intelligent traffic
              lights dynamically adjust signal timings to minimize congestion
              and reduce waiting times. Buses and emergency vehicles are
              equipped with communication with the traffic lights. This
              innovative system not only enhances traffic flow but also plays a
              crucial role in improving public transport reliability and
              emergency response times, ultimately making cities more efficient
              and safer.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <h4>Emergency Vehicle Prioritization</h4>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ fontSize: "17px" }}>
              Emergency vehicle prioritization, also known as "emergency vehicle
              preemption," is a crucial system that enhances public safety by
              granting priority to emergency vehicles such as ambulances, fire
              trucks, and police cars. This technology allows these vehicles to
              control traffic signals and intersections, ensuring swift and
              unobstructed passage to their destination during critical
              emergencies. By minimizing response times, emergency vehicle
              prioritization plays a vital role in saving lives and minimizing
              damage in urgent situations, making it an indispensable component
              of modern emergency services.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <h4>Accident Severity Detection</h4>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              The "Accident Severity Detection and Alerting Emergency Services"
              component is a system that automatically senses and evaluates the
              seriousness of accidents. When a high-severity accident occurs, it
              rapidly informs emergency services. This system uses various
              sensors and data analysis techniques to assess the accident's
              impact force, vehicle speed, and other factors, ensuring a quick
              response from first responders. Its primary purpose is to reduce
              emergency response time, potentially saving lives and improving
              the effectiveness of emergency services.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <h4>Violation Detection</h4>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Violation detection systems play a pivotal role in ensuring road
              safety and enforcing traffic regulations. These systems utilize
              advanced technologies such as computer vision and machine learning
              algorithms to identify and monitor various violations, including
              helmet detection, speed tracking, and wrong-way driving.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel5"}
          onChange={handleChange("panel5")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <h4>Add more users & Customized Permissions</h4>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              You have the capability to include members in your established
              organization, enabling you to allocate varying permission levels
              that align with their respective job roles. Additionally, you
              retain the authority to both remove and adjust the members you've
              added, along with their associated permissions.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
