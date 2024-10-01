import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export const Edit = () => {
  const para = useParams();

  const navigator = useNavigate()

  const [student, setStudent] = useState({
    Id : 0,
    name: "",
    admissionDate: "",
    isActive: false,
    imageUrl: "",
    addresses: [],
  });

  const [newAddress, setNewAddress] = useState({
    city: "",
    street: "",
  });

  const [imageFile, setImageFile] = useState(null); // Change this to store the file

  useEffect(() => {
    fetch(`http://localhost:5014/api/Students/${para.id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Error fetching student data");
      })
      .then((data) => {
        setStudent(data);
        setImageFile(data.imageUrl); // Store the image URL for preview
      })
      .catch((error) => {
        alert("Error occurred: " + error.message);
      });
  }, [para.id]);

  const handleStudentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudent({
      ...student,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const addAddress = () => {
    if (!newAddress.city || !newAddress.street) {
      alert("Please fill out all required fields.");
      return;
    }
    setStudent((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddress],
    }));
    setNewAddress({ city: "", street: "" });
  };

  // const delAddress = (index) => {
  //   const updatedAddresses = student.addresses.filter((_, i) => i !== index);
  //   setStudent({ ...student, addresses: updatedAddresses });
  // };

//   function delAddress(index) {
//     const updatedAddresses = student.addresses.filter((_, i) => i !== index);
//     setStudent({
//         ...student,
//         addresses: updatedAddresses
//     });
// }

function delAddress(index, event) {
  event.preventDefault(); // Prevent form submission
  const updatedAddresses = student.addresses.filter((_, i) => i !== index);
  setStudent({
      ...student,
      addresses: updatedAddresses
  });
}


  const handleUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // Set the file for upload
    const reader = new FileReader();
    reader.onload = () => {
      setStudent({ ...student, imageUrl: reader.result }); // Set the image for preview
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const updateStudent = (e) => {
    e.preventDefault();
    if (!student.name || student.addresses.some((addr) => !addr.city || !addr.street)) {
      alert("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", student.name);
    formData.append("admissionDate", student.admissionDate);
    formData.append("isActive", student.isActive);
    formData.append("addressesJson", JSON.stringify(student.addresses));

    if (imageFile) {
      formData.append("image", imageFile); // Append the actual file here
    }

    fetch(`http://localhost:5014/api/Students/${para.id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error updating student data");
        }
        return res.json();
      })
      .then(() => {
        alert("Student updated successfully");
        // Reset the state after successful update
        setStudent({
          name: "",
          admissionDate: "",
          isActive: false,
          imageUrl: "",
          addresses: [],
        });
        setNewAddress({ city: "", street: "" });
        setImageFile(null); 
        navigator('/list')
      })
      .catch((error) => {
        // alert("Error occurred: " + error.message);
        console.log(error);
        navigator('/list')
        
      });
  };

  return (
    <div className="container py-5">
      <form onSubmit={updateStudent} className="p-4 bg-white shadow-sm rounded">
        <div className="row">
          <div className="col-md-6">
            <h4 className="text-success mb-4">Update Student</h4>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                onChange={handleStudentChange}
                type="text"
                className="form-control form-control-lg"
                id="name"
                name="name"
                value={student.name}
                placeholder="Enter Student's Name"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="admissionDate" className="form-label">Admission Date</label>
              <input
                onChange={handleStudentChange}
                type="date"
                className="form-control form-control-lg"
                id="admissionDate"
                name="admissionDate"
                value={student.admissionDate.split("T")[0]}
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
              <label htmlFor="isActive" className="form-check-label"> Active?</label>
            </div>
            
            <div className="mb-4">
              {student.imageUrl && (
                <img
                  src={`http://localhost:5014/${student.imageUrl}`}
                  width={100}
                  height={60}
                  className="img-thumbnail mb-2"
                  alt="Student"
                />
              )}
              <input
                className="form-control form-control-lg"
                type="file"
                id="formFile"
                name="image"
                onChange={handleUpload}
              />
            </div>
            
            <div className="d-flex gap-3">
              <button className="btn btn-success btn-lg" type="submit">Update</button>
              <Link to="/list" className="btn btn-secondary btn-lg">Back To Student List</Link>
            </div>
          </div>
  
          <div className="col-md-6">
            <h4 className="text-primary mb-4">Student Address</h4>
            <div className="mb-3">
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
                className="btn btn-outline-primary btn-lg w-100">
                Add Address
              </button>
            </div>
  
            {student.addresses.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Sl.</th>
                      <th>Street</th>
                      <th>City</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                {student.addresses.map((a, j) => (
                  <tr key={j}>
                    <td>{j + 1}</td>
                    <td>{a.street}</td>
                    <td>{a.city}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => delAddress(j, e)} // Pass the event object
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

                </table>
              </div>
            ) : (
              <p className="text-warning">No addresses added. Please add an address.</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
  
  // return (
  //   <div className="container">
  //     <form onSubmit={updateStudent}>
  //       <div className="row">
  //         <div className="col-md-6">
  //           <h4>Update Student</h4>
  //           <div className="form-group">
  //             <label htmlFor="name">Name</label>
  //             <input
  //               onChange={handleStudentChange}
  //               type="text"
  //               className="form-control"
  //               id="name"
  //               name="name"
  //               value={student.name}
  //             />
  //           </div>
  //           <div className="form-group">
  //             <label htmlFor="admissionDate">Admission Date</label>
  //             <input
  //               onChange={handleStudentChange}
  //               type="date"
  //               className="form-control"
  //               id="admissionDate"
  //               name="admissionDate"
  //               value={student.admissionDate.split("T")[0]} // Format date
  //             />
  //           </div>
  //           <div className="form-check">
  //             <input
  //               onChange={handleStudentChange}
  //               className="form-check-input"
  //               type="checkbox"
  //               id="isActive"
  //               name="isActive"
  //               checked={student.isActive}
  //             />
  //             <label htmlFor="isActive" className="form-check-label">
  //               Active?
  //             </label>
  //           </div>
  //           <div className="form-control-file my-2">
  //             {student.imageUrl && ( // Change this to student.imageUrl
  //               <img
  //                 src={student.imageUrl} // Use the imageUrl from student
  //                 width={80}
  //                 height={50}
  //                 className="img-fluid rounded-start"
  //                 alt="Student"
  //               />
  //             )}
  //             <input
  //               className="form-control"
  //               type="file"
  //               id="formFile"
  //               name="image"
  //               onChange={handleUpload}
  //             />
  //           </div>
  //           <div className="form-group">
  //             <button className="btn btn-success" type="submit">
  //               Update
  //             </button>
  //             &nbsp;&nbsp;
  //             <Link to="/list" className="btn btn-secondary">
  //               Back To Student List
  //             </Link>
  //           </div>
  //         </div>
  //         <div className="col-md-6">
  //           <h4>Student Address</h4>
  //           <div className="form-group">
  //             <input
  //               type="text"
  //               placeholder="Enter City"
  //               className="form-control mb-2"
  //               id="city"
  //               name="city"
  //               value={newAddress.city}
  //               onChange={handleNewAddressChange}
  //             />
  //             <input
  //               type="text"
  //               placeholder="Enter Street"
  //               className="form-control mb-2"
  //               id="street"
  //               name="street"
  //               value={newAddress.street}
  //               onChange={handleNewAddressChange}
  //             />
  //             <button
  //               onClick={addAddress}
  //               type="button"
  //               className="btn btn-secondary mb-2"
  //             >
  //               Add Address
  //             </button>
  //           </div>
  //           {student.addresses.length > 0 ? (
  //             <table className="table table-bordered table-striped">
  //               <thead>
  //                 <tr>
  //                   <th>Sl.</th>
  //                   <th>Street</th>
  //                   <th>City</th>
  //                   <th>Action</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {student.addresses.map((a, j) => (
  //                   <tr key={j}>
  //                     <td>{j + 1}</td>
  //                     <td>{a.street}</td>
  //                     <td>{a.city}</td>
  //                     <td>
  //                       <button
  //                         className="btn btn-danger btn-sm"
  //                         onClick={() => delAddress(j)}
  //                       >
  //                         Delete
  //                       </button>
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           ) : (
  //             <p>No addresses added. Please add an address.</p>
  //           )}
  //         </div>
  //       </div>
  //     </form>
  //   </div>
  // );
};
