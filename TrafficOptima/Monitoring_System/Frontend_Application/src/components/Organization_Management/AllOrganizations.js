
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import Swal from 'sweetalert2';
import swal from "sweetalert";
const OrganizationList = () => {
  const [organizations, setOrganizations] = useState([]);
  const history = useNavigate();
  useEffect(() => {
    // Fetch organization data when the component mounts

    const token = Cookies.get('token');
    if (token) {
      axios
        .get('/organization', {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setOrganizations(response.data.data);
        })
        .catch((error) => {
          console.error('Failed to fetch organizations:', error);
        });
    }
  }, []);

  const handleDelete = async (id) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, The Organizers cannot access their accounts!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then(async (Delete) => {
      if (Delete) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`/organization/${id}`, {
            headers: {
              Authorization: token,
            },
          });
          window.location.reload();
        } catch (error) {
          console.error('Error deleting organization:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Organization can\'t be deleted!',
          });
        }
      } else {
        swal('Cancelled', 'The Organization has not been deleted.', 'info');
      }
    });
  };

  // const handleDelete = async (id) => {

  // };


  const handleEdit = (id) => {

    history(`/editOrganizations/${id}`);


  };
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Organization List</h2>
      <table className="table table-bordered table-centered">
        <thead className="thead-dark">
          <tr>
            <th>Organization Name</th>
            <th>Organization Email</th>
            <th>Country</th>
            <th>isPlanFree</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((org) => (
            <tr key={org._id}>
              <td>{org.organization_name}</td>
              <td>{org.organization_email}</td>
              <td>{org.Country}</td>
              <td>{org.isPlanFree ? 'true' : 'false'}</td>
              <td>
                <a
                  className="btn btn-outline-warning"
                  href={`#`} onClick={() => handleEdit(org._id)}

                >
                  <i className="fas fa-edit"></i>&nbsp;Edit
                </a>

                &nbsp;&nbsp;
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(org._id)}
                >
                  <i className="far fa-trash-alt"></i>&nbsp;Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizationList;
