import React, { useEffect, useState } from "react";
import { json, Link } from "react-router-dom";
export const List = () => {
  const [student, setStudent] = useState([]);
  function GetStudents() {
    fetch("http://localhost:5014/api/Students")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("error");
      })
      .then((data) => {
        setStudent(data);
      });
  }
  useEffect(GetStudents, []);
  function deleteStudent(id, name) {
    const conf = confirm(`Do you want to delete ${name}`);
    if (conf) {
      console.log("di ", id);
      fetch("http://localhost:5014/api/Students/" + id, {
        method: "DELETE",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Error Occured");
        }
        GetStudents();
        alert(`${name} Deleted Successfully`);
      });
    }
  }
  console.log("student", student);
  return (
    <>
      <h2 className="my-4 text-center text-primary">Student List</h2>
      <table className="table table-bordered table-hover table-striped shadow-sm">
        <thead className="bg-dark text-white">
          <tr>
            <th>Student Information</th>
          </tr>
        </thead>
        <tbody>
          {student.map((s, i) => {
            return (
              <tr key={i}>
                <td className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={`http://localhost:5014/${s.imageUrl}`}
                      alt={s.name}
                      className="rounded-circle border border-primary"
                      height={60}
                      width={60}
                    />
                    <div className="ms-3">
                      <strong>Name:</strong> {s.name} <br />
                      <strong>Admission:</strong> {s.admissionDate} <br />
                      <strong>Active:</strong> {s.isActive ? "Yes" : "No"} <br />
                      <strong>Image URL:</strong> {s.imageUrl}
                    </div>
                  </div>
                  <h5 className="text-info">Address</h5>
                  {s.addresses.length > 0 ? (
                    <table className="table table-bordered table-sm table-striped">
                      <thead className="bg-light">
                        <tr>
                          <th>Id</th>
                          <th>City</th>
                          <th>Street</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.addresses.map((a, j) => {
                          return (
                            <tr key={j}>
                              <td>{a.id}</td>
                              <td>{a.city}</td>
                              <td>{a.street}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-warning">No addresses available</p>
                  )}
                  <div className="mt-3">
                    <Link
                      to={`/list/edit/${s.id}`}
                      className="btn btn-dark me-2"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/list/details/${s.id}`}
                      className="btn btn-info me-2"
                    >
                      Detail
                    </Link>
                    <button
                      onClick={() => deleteStudent(s.id, s.name)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
  
  // return (
  //   <>
  //     <h2>Student List</h2>
  //     <table className="table table-bordered table-striped">
  //       <thead>
  //         <tr>
  //           <th>Student Information</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {student.map((s, i) => {
  //           return (
  //             <>
  //               <tr key={i}>
  //                 <td>
  //                   <img
  //                     src={`http://localhost:5014/${s.imageUrl}`}
  //                     height={60}
  //                     width={60}
  //                   />
  //                   <br />
  //                   Name: {s.name} <br />
  //                   Admission: {s.admissionDate}
  //                   <br />
  //                   Active:{s.isActive ? "Yes" : "No"} <br />
  //                   Image: {s.imageUrl}
  //                   <h5>Address</h5>
  //                   {s.addresses.length > 0 ? (
  //                     <table className="table table-bordered table-striped">
  //                       <thead>
  //                         <tr>
  //                           <th>Id</th> <th>City</th>
  //                           <th>Street</th>
  //                         </tr>
  //                       </thead>
  //                       <tbody>
  //                         {s.addresses.map((a, j) => {
  //                           return (
  //                             <tr key={j}>
  //                               <td>{a.id}</td>
  //                               <td>{a.city}</td>
  //                               <td>{a.street}</td>
  //                             </tr>
  //                           );
  //                         })}
  //                       </tbody>{" "}
  //                     </table>
  //                   ) : (
  //                     <p> No student</p>
  //                   )}
  //                   <button className="btn  btn-dark">
  //                     <Link to={`/list/edit/${s.id}`}>Edit</Link>
  //                   </button>
  //                   <button className="btn  btn-info">
  //                     <Link to={`/list/details/${s.id}`}>Detail</Link>
  //                   </button>
  //                   <button
  //                     onClick={() => deleteStudent(s.id, s.name)}
  //                     className="btn  btn-danger"
  //                   >
  //                     Delete
  //                   </button>
  //                 </td>
  //               </tr>
  //             </>
  //           );
  //         })}
  //       </tbody>
  //     </table>
  //   </>
  // );
};
