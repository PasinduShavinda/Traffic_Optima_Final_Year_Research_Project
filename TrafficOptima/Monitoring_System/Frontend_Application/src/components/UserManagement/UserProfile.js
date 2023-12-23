import React, { useEffect, useState } from 'react';
import './UserProfile.css'; // Import your CSS file for styling

function UserProfile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from your Flask API
    fetch('/user-data') // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <div style={{
      display: "flex",
      margin: "3rem",
      flexDirection: "column",
      width: window.innerWidth - 270,
    }}>
      <div className="user-profile-card">
        <h2>User profile</h2>
        {userData ? (
          <div className="user-details">
            <table className="user-table">
              <tbody>
                <tr>
                  <td className="key-cell">Name:</td>
                  <td className="value-cell">{userData.fullname}</td>
                </tr>
                <tr>
                  <td className="key-cell">Email:</td>
                  <td className="value-cell">{userData.email}</td>
                </tr>
                <tr>
                  <td className="key-cell">Organization Name:</td>
                  <td className="value-cell">{userData.organization_name}</td>
                </tr>
                <tr>
                  <td className="key-cell">Organization ID:</td>
                  <td className="value-cell">{userData.organization_id}</td>
                </tr>
                <tr>
                  <td className="key-cell">Employee No:</td>
                  <td className="value-cell">{userData.employee_no}</td>
                </tr>
                {userData.permissions && userData.permissions.length > 0 && (
                  <tr>
                    <td className="key-cell-p">Permissions:</td>
                    <td className="value-cell">
                      <ul className="permissions-list">
                        {userData.permissions.map((permission, index) => (
                          <li key={index}>{permission}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="key-cell">Role:</td>
                  <td className="value-cell">{userData.role}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;

