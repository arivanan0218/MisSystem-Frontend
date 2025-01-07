import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Breadcrumb from "../Components/Breadcrumb";
import Footer from "../Components/Footer";
import axios from "../axiosConfig"; // Import axios for HTTP requests
import UploadMarks from "../Components/UploadMarks"; // Import UploadMarks component

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [formOpen, setFormOpen] = useState(false); // State to control form visibility
  const [error, setError] = useState(null);

  // Get IDs from localStorage
  const token = localStorage.getItem("auth-token");
  const departmentId = localStorage.getItem("departmentId");
  const intakeId = localStorage.getItem("intakeId");
  const semesterId = localStorage.getItem("semesterId");
  const moduleId = localStorage.getItem("moduleId");
  const assignmentId = localStorage.getItem("assignmentId");

  const openForm = () => setFormOpen(true); // Open the form
  const closeForm = () => setFormOpen(false); // Close the form

  // Fetch marks from API
  useEffect(() => {
    const fetchMarks = async () => {
      try {
        if (
          !departmentId ||
          !intakeId ||
          !semesterId ||
          !moduleId ||
          !assignmentId
        ) {
          setError("Required data missing from localStorage.");
          return;
        }

        const response = await axios.get(
          `/marks/assignment/${departmentId}?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}&moduleId=${moduleId}&assignmentId=${assignmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(`Failed to fetch marks: ${response.statusText}`);
        }

        const data = response.data;
        console.log("Fetched marks:", data); // Log fetched data for debugging

        if (Array.isArray(data)) {
          setMarks(data); // Set the marks directly
        } else {
          throw new Error("Invalid data structure from API");
        }
      } catch (error) {
        console.error("Error fetching marks:", error);
        setError("Could not fetch marks. Please try again later.");
      }
    };

    fetchMarks();
  }, [departmentId, intakeId, semesterId, moduleId, assignmentId, token]);

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
          <div>
            <button
              onClick={openForm}
              className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[160px] h-[41px] ml-4"
              aria-label="Add Marks"
            >
              Add Marks +
            </button>
            {formOpen && <UploadMarks />}{" "}
            {/* Render UploadMarks component when formOpen is true */}
          </div>
        </div>

        <div className="mt-[80px]">
          {error && (
            <div className="text-center text-red-500 mb-4">{error}</div>
          )}
          {marks.length > 0 ? (
            marks.map((mark) => (
              <Link
                to={`/marks/${mark.markId}`}
                key={mark.markId}
                onClick={() => localStorage.setItem("markId", mark.markId)}
              >
                <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-full p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer">
                  <div>
                    {mark.studentName || "Unnamed Student"}:{" "}
                    {mark.marks || "No Marks"}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-gray-500">No marks available.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Marks;
