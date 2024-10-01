import { useEffect, useState } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FloatingLabel, Form } from 'react-bootstrap';
import { getAllMedicinesApi, uploadMedDetails, deleteMedicineApi, updateMedicineApi } from './services/allApi';

function App() {
  const [show, setShow] = useState(false);
  const [allMedicines, setAllMedicines] = useState([]);
  const [medDetails, setMedDetails] = useState({ name: "", price: "", stock: "" });
  const [isEdit, setIsEdit] = useState(false); // New state to track edit mode
  const [editId, setEditId] = useState(null);  // Track the ID of the medicine being edited

  // Fetch medicines on component load
  useEffect(() => {
    getAllMedicines();
  }, []);

  const getAllMedicines = async () => {
    try {
      const result = await getAllMedicinesApi();
      if (result.status >= 200 && result.status < 300) {
        setAllMedicines(result.data);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setMedDetails({ name: "", price: "", stock: "" }); // Reset the form when closing
    setIsEdit(false); // Reset edit mode
  };
  
  const handleShow = () => setShow(true);

  // Handle Add or Edit submission
  const handleAddOrEdit = async () => {
    const { name, price, stock } = medDetails;
    if (name && price && stock) {
      if (isEdit) {
        // If in edit mode, update the medicine
        const result = await updateMedicineApi(editId, medDetails);
        if (result.status >= 200 && result.status < 300) {
          handleClose();
          setMedDetails({ name: "", price: "", stock: "" });
          alert(`${result.data.name} Details Updated Successfully`);
          getAllMedicines(); // Refresh medicine list
        }
      } else {
        // If not in edit mode, add a new medicine
        const result = await uploadMedDetails(medDetails);
        if (result.status >= 200 && result.status < 300) {
          handleClose();
          setMedDetails({ name: "", price: "", stock: "" });
          alert(`${result.data.name} Details Added Successfully`);
          getAllMedicines(); // Refresh medicine list
        }
      }
    } else {
      alert("Please fill out the form completely");
    }
  };

  // Handle Edit button click
  const handleEdit = (medicine) => {
    setMedDetails({ name: medicine.name, price: medicine.price, stock: medicine.stock });
    setEditId(medicine.id);  // Set the id of the medicine to be edited
    setIsEdit(true);         // Set edit mode to true
    handleShow();            // Show the modal for editing
  };

  const handleDelete = async (id) => {
    if(allMedicines.length>0){
      const confirmed = window.confirm("Are you sure you want to delete this medicine?");
      if (confirmed) {
        const result = await deleteMedicineApi(id);
        if (result.status >= 200 && result.status < 300) {
          const updatedMedicines = allMedicines.filter(med => med.id !== id);
          setAllMedicines(updatedMedicines);
          alert("Medicine deleted successfully");
        }
      }
    }
  }

  return (
    <>
      <div className="container mt-5">
        <h1>Medicine Management</h1>
        <table className="table mt-3 border-dark border border-2">
          <thead>
            <tr>
              <th>Id</th>
              <th>Medicine Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allMedicines.length ? (
              allMedicines.map((medicine, index) => (
                <tr key={medicine.id}>
                  <td>{index + 1}</td>
                  <td>{medicine.name}</td>
                  <td>₹{medicine.price}</td>
                  <td>{medicine.stock}</td>
                  <td>
                    <div className="d-flex justify-content-end me-5">
                      <button
                        className="btn btn-warning rounded py-2 px-3 text-light fw-bold"
                        onClick={() => handleEdit(medicine)} // Edit handler
                      >
                        <i className="fa-solid fa-pen"></i> Edit
                      </button>
                      <button
                        className="btn btn-danger rounded py-2 px-2 fw-bold ms-2"
                        onClick={() => handleDelete(medicine.id)}
                      >
                        <i className="fa-solid fa-trash-can"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No medicines available</td>
              </tr>
            )}
          </tbody>
        </table>
        <button onClick={handleShow} className="btn btn-success rounded py-2 px-2 fw-bold ms-2">
          <i className="fa-solid fa-plus"></i> Add Item
        </button>
      </div>

      {/* Modal for adding/editing medicine */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{isEdit ? "Edit" : "Add"} Medicine Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="rounded border border-dark p-3">
            <FloatingLabel controlId="medicineName" label="Medicine Name" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter medicine name"
                value={medDetails.name}
                onChange={(e) => setMedDetails({ ...medDetails, name: e.target.value })}
              />
            </FloatingLabel>
            <FloatingLabel controlId="medicinePrice" label="Medicine Price" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter price"
                value={medDetails.price}
                onChange={(e) => setMedDetails({ ...medDetails, price: e.target.value })}
              />
            </FloatingLabel>
            <FloatingLabel controlId="medicineStock" label="Stock in Nos" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter stock quantity"
                value={medDetails.stock}
                onChange={(e) => setMedDetails({ ...medDetails, stock: e.target.value })}
              />
            </FloatingLabel>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddOrEdit}>
            {isEdit ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
