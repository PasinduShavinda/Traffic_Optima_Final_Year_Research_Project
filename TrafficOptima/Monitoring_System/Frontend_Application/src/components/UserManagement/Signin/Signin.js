import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import loginImage from './../images/sign-up.avif'
const Signin = () => {

    // State variables for managing form inputs
    const [email, setEmail] = useState("");
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState({});
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [employeeNos, setEmployeeNos] = useState([]);
    const [selectedEmployeeNo, setSelectedEmployeeNo] = useState(""); 
    const [id, setid] = useState(""); 
    const navigate = useNavigate();

    // Function to validate email and password
    const validate = () => {

        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        const fullNameRegex = /^[A-Za-z ]*$/;


        let result = true;
        if (email === ''  && fullName === '' && password === '' && confirmPassword === '' && role === '') {
            result = false;
            swal("Registration Failed!", "You must fill all the fields ❗️❗️ ", "error");
        }
        else if (email === '' || email === null) {
            result = false;
            swal("Registration Failed!", "Email cannot be empty ❗️❗️ ", "error");
        }
        else if (password === '' || password === null) {
            result = false;
            swal("Registration Failed!", "Password cannot be empty ❗️❗️ ", "error");
        }
        else if (confirmPassword === '' || confirmPassword === null) {
            result = false;
            swal("Registration Failed!", "Confirm password cannot be empty ❗️❗️ ", "error");
        }
        else if (!email.match(emailRegex)) {
            result = false;
            swal("Registration Failed!", "Please enter a valid email address ❗️❗️ ", "error");
        }
        else if (!password.match(passwordRegex)) {
            result = false;
            swal("Registration Failed!", "Please enter a strong password ❗️❗️ ", "error");
        }
        else if (password !== confirmPassword) {
            result = false;
            swal("Registration Failed!", "Passwords does not match ❗️❗️ ", "error");
        }
        else if (!fullName.match(fullNameRegex)) {
            result = false;
            swal("Registration Failed!", "Name cannot contain numbers ❗️❗️ ", "error");
        }
        return result;
    }

    const handlesubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            if (selectedOrganization._id) {
                let regObj = {
                    password:password,
                    fullName:fullName
                };

                fetch(`/update-user/${id}`, {
                    method: "PUT",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(regObj)
                })
                    .then((res) => {
                        swal("Successful!", "Registration Successful ✅ 👏", "success");
                        navigate('/');
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                swal("Registration Failed!", "Please select an organization ❗️❗️ ", "error");
            }
        }
    };
    const fetchOrganizations = () => {
        fetch("/organization")
            .then((response) => response.json())
            .then((data) => {
                setOrganizations(data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    useEffect(() => {
        if (selectedOrganization.organization_name) {
            const requestBody = {
                organization_name: selectedOrganization.organization_name
            };
    
            fetch("http://127.0.0.1:5000/get_users_by_organization", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
                .then((response) => response.json())
                .then((data) => {
                    setEmployeeNos(data.employee_nos);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [selectedOrganization]);

    useEffect(() => {
        if (selectedOrganization._id && selectedEmployeeNo) {
            const requestBody = {
                organization_name: selectedOrganization.organization_name,
                employee_no: selectedEmployeeNo,
            };
    
            fetch("http://127.0.0.1:5000/find_one_user_by_org_and_emp", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
                .then((response) => response.json())
                .then((data) => {
            
                    setEmail(data.email);
                    setid(data._id.$oid);
                    
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [selectedOrganization, selectedEmployeeNo]);
    
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ display: 'flex', width: '1000px', background: '#f7f7f7', borderRadius: '10px' }}>
        <div style={{ flex: 1, padding: '20px' }}>
          <img
            src={loginImage}
            alt="Login Image"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px 0 0 10px' }}
          />
        </div>
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <form className="border p-3" style={{ width: '100%', padding: '30px', height: '100%' }} onSubmit={handlesubmit}>
            <h2 className="text-center">Register</h2>
            <div className="form-group mb-3">
              <label>Organization Name</label>
              <select
                value={selectedOrganization._id}
                onChange={(e) => {
                  const orgId = e.target.value;
                  const selectedOrg = organizations.find((org) => org._id === orgId);
                  setSelectedOrganization(selectedOrg || {});
                }}
                className="form-control"
              >
                <option value="">Select Organization</option>
                {organizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.organization_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mb-3">
              <label>Employee Number</label>
              <select
                value={selectedEmployeeNo}
                onChange={(e) => setSelectedEmployeeNo(e.target.value)}
                className="form-control"
              >
                <option value="">Select Employee Number</option>
                {employeeNos && employeeNos.map((employeeNo) => (
                  <option key={employeeNo} value={employeeNo}>
                    {employeeNo}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true}
              />
            </div>
            <div className="form-group mb-3">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
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
            <div className="form-group mb-3">
              <label>Confirm Password</label>
              <div className="input-group">
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control"
                />
                <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>
           
            <button type="submit" className="btn btn-primary">
              Register
            </button>
            <p className="mt-3 text-center" style={{ alignSelf: 'center' }}>
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
    );
}

export default Signin;