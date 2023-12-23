import React, { useState, useEffect } from 'react';
import './PlansPricing.css'
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

function PlansPricing() {

    const organizationId = localStorage.getItem('organization_id')
    const [isPlanFree, setIsPlanFree] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const getOrganizationDetailsById = async (organizationId) => {
            try {
                const response = await fetch(`/getone/${organizationId}`);
                if (response.ok) {
                    const orgDetails = await response.json();
                    setIsPlanFree(orgDetails.data.isPlanFree);
                } else {
                    throw new Error('Failed to fetch organization details');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        // Call the function with the organization ID from local storage
        getOrganizationDetailsById(organizationId);
    }, [organizationId]);


    const handleDowngradePlan = async (event) => {
        try {
            const res = await fetch('/downgrade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    organizationId: organizationId,
                }),
            });

            if (res.status === 201) {
                // Show a success message to your customer
                swal("Successful!", "Your Plan Downgraded to Free Version !!", "success");
                window.location.reload();
            } else {
                console.error('Downgrade request failed with status code:', res.status);
            }
        } catch (error) {
            console.error('An error occurred while making the downgrade request:', error);
        }
    };

    const handleCurrentPlanFree = () => {
        swal("Traffic Optima", "You Currently in Free Plan.", "info");
    }

    const handleCurrentPlanPro = () => {
        swal("Traffic Optima", "You Currently in Professional Plan.", "info");
    }

    return (
        <div style={{
            display: "flex",
            margin: "1rem",
            flexDirection: "column",
            width: window.innerWidth - 144
        }}>
            <div className='planprice-body'>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
                <div>
                    <div className="wrapperfree">
                        <header>
                            <label style={{ marginLeft: '120px' }}>FREE</label>
                        </header>
                        <div className="card-area">
                            <div className="cards">
                                <div className="row row-1">
                                    <div className="price-details">
                                        <span className="price">00</span>
                                    </div>
                                    <ul className="features">
                                        <li><i className="fas fa-check" /><span>Traffic Light Optimization</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <button hidden={isPlanFree} onClick={handleDowngradePlan}>Downgrade to Free</button>
                        <button hidden={!isPlanFree} onClick={handleCurrentPlanFree}>Current Plan</button>
                    </div>
                </div>

                <div style={{ marginLeft: '100px' }}>
                    <div className="wrapperpaid">
                        <header>
                            <label style={{ marginLeft: '120px' }}>PRO</label>
                        </header>
                        <div className="card-area">
                            <div className="cards">
                                <div className="row">
                                    <div className="price-details">
                                        <span className="price">500</span>
                                    </div>
                                    <ul className="features">
                                        <li><i className="fas fa-check" /><span>Traffic Light Optimization</span></li>
                                        <li><i className="fas fa-check" /><span>Emergency Vehicle Prioritization</span></li>
                                        <li><i className="fas fa-check" /><span>Accident Severity Detection & Alerting</span></li>
                                        <li><i className="fas fa-check" /><span>Traffic Violation Detection & Reporting</span></li>
                                        <li><i className="fas fa-check" /><span>Manage Organization Members</span></li>
                                        <li><i className="fas fa-check" /><span>Customized Permissions</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <Link
                            to="/payment-card"
                        >
                            <button hidden={!isPlanFree}>Upgrade to PRO</button>
                        </Link>
                        <button hidden={isPlanFree} onClick={handleCurrentPlanPro}>Current Plan</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlansPricing;
