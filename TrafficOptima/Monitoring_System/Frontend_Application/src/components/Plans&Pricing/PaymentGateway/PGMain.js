import React from 'react';
import PGHome from '../PaymentGateway/PGHome';
import '../PaymentGateway/PGStyles.css';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51O3WF2SIbnBLnqs7SpKsOVW0Ixh2DRHaSxH1xpA9zd0xp97fq07GkXVjBIr8aUebHJy86NKm3IBHJ4VaMpZtc5cA00U5cK6O1i");

function PGMain() {
  return (
    <div style={{
      display: "flex",
      margin: "1rem",
      flexDirection: "column",
      width: window.innerWidth -100,
  }}>
    <Elements stripe={stripePromise}>
      <PGHome />
    </Elements>
    </div>
  );
}

export default PGMain;
