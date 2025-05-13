import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../Components/Header";
import Breadcrumb from "../../Components/Breadcrumb";
import Footer from "../../Components/Footer";
import axios from "../../axiosConfig"; // Import axios for HTTP requests
import edit from "../../assets/img/edit.svg";
import deleteIcon from "../../assets/img/delete.svg";
import AssignmentCreation from "./AssignmentCreation";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Get IDs from localStorage
  const token = localStorage.getItem("auth-token");
  const departmentId = localStorage.getItem("departmentId");
  const intakeId = localStorage.getItem("intakeId");
  const semesterId = localStorage.getItem("semesterId");
  const moduleId = localStorage.getItem("moduleId");
  const userRole = localStorage.getItem("userRole");

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const openEditForm = (assignment) => {
    setEditingAssignment(assignment);
    setEditFormOpen(true);
  };
  const closeEditForm = () => {
    setEditingAssignment(null);
    setEditFormOpen(false);
  };

  const addAssignment = (newAssignment) => {
    setAssignments((prevAssignments) => {
      return Array.isArray(prevAssignments)
        ? [...prevAssignments, newAssignment]
        : [newAssignment];
    });
  };

  const handleDelete = async (assignmentId) => {
    try {
      const token = localStorage.getItem("auth-token"); // Retrieve auth-token
      if (!token) {
        console.error("No token found. Redirecting to login.");
        window.location.href = "/login";
        return;
      }

      const response = await axios.delete(`/assignment/${assignmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setAssignments((prevAssignments) =>
          prevAssignments.filter((assignment) => assignment.id !== assignmentId)
        );
      } else {
        throw new Error("Failed to delete assignment");
      }
    } catch (err) {
      console.error("Error deleting assignment:", err);
      setError("Could not delete assignment. Please try again later.");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const { assignmentName, assingmentPercentage, assignmentDuration } =
      editingAssignment;

    if (
      assignmentName.trim() &&
      assingmentPercentage.trim() &&
      assignmentDuration.trim()
    ) {
      try {
        const token = localStorage.getItem("auth-token"); // Retrieve auth-token
        if (!token) {
          console.error("No token found. Redirecting to login.");
          window.location.href = "/login";
          return;
        }

        const response = await axios.put(
          `/assignment/${editingAssignment.id}`,
          {
            assignmentName,
            assingmentPercentage,
            assignmentDuration,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedAssignment = response.data;

        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === updatedAssignment.id
              ? updatedAssignment
              : assignment
          )
        );

        closeEditForm();
      } catch (error) {
        console.error("Error updating assignment:", error);
        setError("Failed to update assignment. Please try again.");
      }
    } else {
      setError("Please fill out all fields.");
    }
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if (!departmentId || !intakeId || !semesterId || !moduleId) {
          setError("Required data missing from localStorage.");
          return;
        }

        const response = await axios.get(
          `/assignment/module/${departmentId}?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}&moduleId=${moduleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(
            `Failed to fetch assignments: ${response.statusText}`
          );
        }

        const data = response.data;
        console.log("Fetched assignments:", data); // Log fetched data for debugging

        if (Array.isArray(data)) {
          setAssignments(data); // Set the assignments directly
        } else {
          throw new Error("Invalid data structure from API");
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setError("Could not fetch assignments. Please try again later.");
      }
    };

    fetchAssignments();
  }, [departmentId, intakeId, semesterId, moduleId, token]);

  return (
    <div>
      <Header />
      <Breadcrumb />
      <div className="mr-[20%] ml-[10%] px-8 font-poppins">
        <div className="py-8 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
          />
          {userRole === "ROLE_AR" && (
            <div>
              <button
                onClick={openForm}
                className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[160px] h-[41px] ml-4"
                aria-label="Add Assignment"
              >
                Add Assignment +
              </button>
              {formOpen && (
                <AssignmentCreation
                  closeForm={closeForm}
                  addAssignment={addAssignment}
                />
              )}

              <Link to={"/viewMarks"}>
                <button className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900">
                  View Marks
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-[80px]">
          {error && (
            <div className="text-center text-red-500 mb-4">{error}</div>
          )}
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white flex justify-between items-center"
              >
                <Link
                  to={`/departments/${assignment.id}/intakes/semesters/modules/assignments/marks`}
                  key={assignment.id}
                  className="flex-1"
                  onClick={
                    () => localStorage.setItem("assignmentId", assignment.id) // Fix: Use assignment.assignmentId
                  }
                >
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    <div>
                      {assignment.assignmentName || "Unnamed Assignment"}
                    </div>
                  </div>
                </Link>

                {userRole === "ROLE_AR" && (
                  <div className="flex space-x-2">
                    <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                      <button
                        onClick={() => openEditForm(assignment)}
                        className="text-yellow-500 hover:text-yellow-700"
                        aria-label="Edit Assignment"
                      >
                        <img src={edit} alt="edit" />
                      </button>
                    </div>

                    <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete Assignment"
                      >
                        <img src={deleteIcon} alt="delete" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No Assignments available.
            </div>
          )}
        </div>
      </div>

      {editFormOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeEditForm}
        >
          <div
            className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-blue-950 text-2xl font-semibold">
              Edit Department
            </h1>
            <form onSubmit={handleEdit}>
              {error && <div className="mb-4 text-red-500">{error}</div>}
              <div className="mb-6">
                <label
                  htmlFor="assignmentName"
                  className="block mb-2 text-blue-950 text-lg font-semibold"
                >
                  Assignment Name
                </label>
                <input
                  type="text"
                  id="assignmentName"
                  value={editingAssignment?.assignmentName || ""}
                  onChange={(e) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      assignmentName: e.target.value,
                    })
                  }
                  className="border border-blue-950 p-2 rounded w-full"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="assingmentPercentage"
                  className="block mb-2 text-blue-950 text-lg font-semibold"
                >
                  Assingment Percentage
                </label>
                <input
                  type="text"
                  id="assingmentPercentage"
                  value={editingAssignment?.assingmentPercentage || ""}
                  onChange={(e) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      assingmentPercentage: e.target.value,
                    })
                  }
                  className="border border-blue-950 p-2 rounded w-full"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="assignmentDuration"
                  className="block mb-2 text-blue-950 text-lg font-semibold"
                >
                  Assignment Duration
                </label>
                <input
                  type="text"
                  id="assignmentDuration"
                  value={editingAssignment?.assignmentDuration || ""}
                  onChange={(e) =>
                    setEditingAssignment({
                      ...editingAssignment,
                      assignmentDuration: e.target.value,
                    })
                  }
                  className="border border-blue-950 p-2 rounded w-full"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={closeEditForm}
                  type="button"
                  className="lg:w-[155px] md:w-[75px] mr-2 text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="lg:w-[155px] md:w-[75px] py-2 px-4 bg-blue-950 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Assignments;
