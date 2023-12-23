
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import loginImage from './../images/login-bg.png'
import swal from "sweetalert";
import Swal from 'sweetalert2';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Remove the previous token cookie
      Cookies.remove("token");
      localStorage.clear();
      const response = await axios.post('/login', {
        email,
        password,
      });

      const { token, user } = response.data.data;

      // Store the JWT token in a cookie
      Cookies.set('token', token);
      localStorage.setItem('organization_id', user.organization_id);
      localStorage.setItem('role', user.role);
      localStorage.setItem('organization_name', user.organization_name);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem("permissions", user.permissions);
      localStorage.setItem("userId", user._id);
      console.log('token:', Cookies.get('token')); // Add this line for debugging
      console.log('user:', user)
      swal("Successful!", "Successfully Login ✅ ", "success");
      window.location.href = '/';
    } catch (error) {
      if (error.response && error.response.status === 401) {
        swal("Login Failed!", "Incorrect User Credentials ❗️❗️ ", "error");
      } else {
        swal("Login Failed!", "Error Occurred ❗️❗️ ", "error");
      }
      console.error('Login failed:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div style={{ display: 'flex', width: '1000px', background: '#f7f7f7', borderRadius: '10px' }}>
        <div style={{ flex: 1, padding: '20px' }}>
          <img
            src={loginImage}
            alt="Login Image"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px 0 0 10px' }}
          />
        </div>
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <form className="border p-3" style={{ width: '100%', padding: '30px', height: '100%' }} onSubmit={handleLogin}>
            <h2 className="text-center">Login</h2>
            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div> */}
            <div className="form-group mb-3">
              <label>Password</label>
              <div className="input-group">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
            <p className="mt-3 text-center" style={{ alignSelf: 'center' }}>
              Don't have an account? <a href="/Siginin">Sign Up</a>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
