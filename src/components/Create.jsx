import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export const Create = () => {  

  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    admissionDate: '',
    isActive: false,
    imageUrl: "",
    addresses: [],
  });

  const [newAddress, setnewAddress] = useState({
    city: "",
    street: "",
  });

  const [imageUrl, setImage] = useState(null);

  const addAddress = () => {
    if (!newAddress.city || !newAddress.street) {
      alert("Please fill out all required fields.");
      return;
    }

    setStudent({
      ...student,
      addresses: [...student.addresses, newAddress],
    });
    setnewAddress({ city: "", street: "" });
  };

  function handleUpload(e) {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      setStudent({ ...student, imageUrl: reader.result }); // Set the image URL for preview
    };
    reader.readAsDataURL(file); // Convert file to data URL
  }

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setnewAddress({
      ...newAddress,
      [name]: value,
    });
  };

  const handleStudentChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    setStudent({
      ...student,
      [name]: finalValue,
    });
  };

  const createStudent = (e) => {
    e.preventDefault();
    if (!student.name || student.addresses.some(p => !p.city || !p.street)) {
      alert("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    
    // Append student data
    formData.append("name", student.name);
    formData.append("admissionDate", student.admissionDate);
    formData.append("isActive", student.isActive);
    
    // Append addresses as a JSON string
    formData.append("AddressesJson", JSON.stringify(student.addresses));

    // Append image file if available
    if (imageUrl) {
      formData.append("image", imageUrl);
    }

    fetch('http://localhost:5014/api/Students', {
      method: "POST",
      body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      alert("Student created successfully");
      navigate('/list');
    })
    .catch((error) => {
      alert("Error Occurred: " + error.message);
    });
  };

  const delAddress = (j) => {
    const updatedAddresses = student.addresses.filter((_, i) => i !== j);
    setStudent({ ...student, addresses: updatedAddresses });
  };

  return (
    <div className="container mt-5">
      <form onSubmit={createStudent} encType="multipart/form-data" className="shadow-lg p-4 rounded bg-light">
        <div className="row">
          <div className="col-md-6">
            <h4 className="text-primary mb-4">Student Info</h4>
            <div className="form-group mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input 
                type="text"
                onChange={handleStudentChange}
                className="form-control form-control-lg"
                id="name"
                name="name"
                value={student.name}
                placeholder="Enter student's name"
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="admissionDate" className="form-label">Admission Date</label>
              <input 
                onChange={handleStudentChange} 
                type="date" 
                name="admissionDate"
                className="form-control form-control-lg"
                id="admissionDate"
                value={student.admissionDate} 
              />
            </div>

            <div className="form-check mb-3">
              <input 
                onChange={handleStudentChange}
                className="form-check-input"
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={student.isActive}
              />
              <label htmlFor="isActive" className="form-check-label"> Active? </label>
            </div>

            <div className="mb-3">
              {student.imageUrl && (
                <img 
                  src={student.imageUrl} 
                  width={80} 
                  height={50} 
                  className="img-fluid rounded shadow-sm mb-2"
                  alt="Student Preview" 
                />
              )}
              <input 
                className="form-control"
                type="file"
                id="formFile"
                name="imageUrl"
                onChange={handleUpload}
              />
            </div>

            <div className="form-group mb-3">
              <button className="btn btn-success btn-lg" type="submit">Create</button>
              &nbsp;&nbsp;
              <button type="button" className="btn btn-info btn-lg">Clear</button>
            </div>

            <div className="form-group">
              <a className="btn btn-secondary btn-lg" href="students">Back To Student List</a>
            </div>
          </div>

          <div className="col-md-6">
            <h4 className="text-primary mb-4">Student Address</h4>
            <div className="form-group mb-3">
              <input 
                type="text"
                placeholder="Enter City"
                className="form-control form-control-lg mb-2"
                id="city"
                name="city"
                value={newAddress.city}
                onChange={handleNewAddressChange}
              />
              <input
                type="text"
                placeholder="Enter Street"
                className="form-control form-control-lg mb-2"
                id="street"
                name="street"
                value={newAddress.street}
                onChange={handleNewAddressChange}
              />
              <button 
                onClick={addAddress} 
                type="button"
                className="btn btn-secondary btn-lg">
                Add Address
              </button>
            </div>

            {student.addresses.length > 0 ? (
              <div>
                <table className="table table-bordered table-hover table-striped shadow-sm">
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>Sl.</th>
                      <th>City</th>
                      <th>Street</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.addresses.map((a, j) => (
                      <tr key={j}>
                        <td>{j + 1}</td>
                        <td>{a.city}</td>
                        <td>{a.street}</td>
                        <td>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => delAddress(j)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-warning">No addresses added yet.</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
