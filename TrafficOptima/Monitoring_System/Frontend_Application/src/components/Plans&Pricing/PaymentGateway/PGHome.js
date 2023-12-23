import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/system";
import PGCardInput from "../PaymentGateway/PGCardInput";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "../PaymentGateway/PGStyles.css";
import swal from "sweetalert";
import "../../Plans&Pricing/PaymentGateway/PayForm.css";
import PayOptions from "../../../assets/card_img.png";
import { useNavigate } from "react-router-dom";

const useStyles = styled({
  root: {
    maxWidth: 500,
    margin: "35vh auto",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start",
  },
  div: {
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
  },
  button: {
    margin: "2em auto 1em",
  },
});

function PGHome() {
  const classes = useStyles();
  // State
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  // Retrieve the Organization ID and User ID from local storage
  const organizationId = localStorage.getItem("organization_id");
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  // Function to validate form feilds
  const validate = () => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    const fullNameRegex = /^[A-Za-z ]*$/;

    let result = true;

    if (email === "" && name === "" && address === "") {
      result = false;
      swal("Payment Failed!", "You must fill all the fields ❗️❗️ ", "error");
    } else if (email === "" || email === null) {
      result = false;
      swal("Payment Failed!", "Email cannot be empty ❗️❗️ ", "error");
    } else if (name === "" || name === null) {
      result = false;
      swal("Payment Failed!", "Name cannot be empty ❗️❗️ ", "error");
    } else if (address === "" || address === null) {
      result = false;
      swal("Payment Failed!", "Address cannot be empty ❗️❗️ ", "error");
    } else if (!email.match(emailRegex)) {
      result = false;
      swal(
        "Payment Failed!",
        "Please enter a valid email address ❗️❗️ ",
        "error"
      );
    } else if (!name.match(fullNameRegex)) {
      result = false;
      swal("Payment Failed!", "Name cannot contain numbers ❗️❗️ ", "error");
    }
    return result;
  };

  const handleSubmitPay = async (event) => {
    if (validate()) {
      if (!stripe || !elements) {
        return;
      }

      const res = await axios.post("/pay", {
        email: email,
        name: name,
        address: address,
        organizationId: organizationId,
        userId: userId,
      });

      const clientSecret = res.data["client_secret"];

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: email,
            name: name,
            address: {
              line1: address,
            },
          },
        },
      });

      if (result.error) {
        swal(
          "Payment Declined!",
          "Sorry.. Insufficient Credits in Your Account!!",
          "error"
        );
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === "succeeded") {
          // Show a success message to your customer
          swal("Pyament Successful!", "Your Plan Upgraded to Pro Version !!", "success");
          navigate('/plans-pricing')
          window.location.reload();
        }
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="planprice-body">
          <div className="pf_container">
            <forms action>
              <div>
                <div>
                  <h3 className="title">billing details</h3>
                  <div className="inputBox">
                    <span>full name :</span>
                    <input
                      type="text"
                      placeholder="john deo"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <br></br>
                  <div className="inputBox">
                    <span>email :</span>
                    <input
                      type="email"
                      placeholder="example@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <br></br>
                  <div className="inputBox">
                    <span>address :</span>
                    <input
                      type="text"
                      placeholder="room - street - locality"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <br></br>
                </div>
                <div>
                  <h3 className="title">payment</h3>
                  <div className="inputBox">
                    <span>name on card :</span>
                    <input type="text" placeholder="mr. john deo" />
                  </div>
                  <br></br>
                  <PGCardInput />
                  <br></br>
                  <div className="inputBox">
                    <span>cards accepted :</span>
                    <br></br>
                    <img src={PayOptions} alt />
                    <br></br>
                  </div>
                  <br></br>
                </div>
              </div>
              <div className={classes.div}>
                <center>
                  <Button
                    variant="contained"
                    color="primary"
                    className="submit-btn"
                    onClick={handleSubmitPay}
                  >
                    Proceed Payment
                  </Button>
                </center>
              </div>
            </forms>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PGHome;
