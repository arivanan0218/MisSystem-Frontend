import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "../axiosConfig";

const UploadMarks = ({ closeForm, onUploadSuccess, editMode = false, markToEdit = null }) => {
  const [fileData, setFileData] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [editMark, setEditMark] = useState({
    studentId: 0,
    assignmentId: 0,
    marksObtained: 0
  });
  
  // Get module registration data from localStorage
  const moduleId = localStorage.getItem("moduleId");
  const semesterId = localStorage.getItem("semesterId");
  const intakeId = localStorage.getItem("intakeId");
  const departmentId = localStorage.getItem("departmentId");
  const assignmentId = localStorage.getItem("assignmentId");
  const token = localStorage.getItem("auth-token");
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [assignmentName, setAssignmentName] = useState("");

  // If in edit mode, set the initial value
  useEffect(() => {
    if (editMode && markToEdit) {
      setEditMark({
        studentId: markToEdit.studentId || 0,
        assignmentId: markToEdit.assignmentId || parseInt(assignmentId) || 0,
        marksObtained: markToEdit.marksObtained || 0
      });
    }
  }, [editMode, markToEdit, assignmentId]);

  // Fetch students and assignments on component mount
  useEffect(() => {
    const fetchStudentsAndAssignments = async () => {
      try {
        const studentsResponse = await axios.get("/student/");
        const assignmentsResponse = await axios.get("/assignment/");
        setStudents(studentsResponse.data);
        setAssignments(assignmentsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching student or assignment data. Please try again.");
      }
    };

    fetchStudentsAndAssignments();
  }, []);
  
  // Fetch registered students for the module directly from module_registration table
  useEffect(() => {
    const fetchRegisteredStudents = async () => {
      if (!moduleId) {
        console.error("Missing moduleId for fetching registered students");
        return;
      }

      try {
        // First try to fetch assignment details if we have an assignmentId
        if (assignmentId) {
          try {
            const assignmentResponse = await axios.get(`/assignment/${assignmentId}`);
            if (assignmentResponse.status === 200) {
              setAssignmentName(assignmentResponse.data.assignmentName || "Assignment");
              console.log('Assignment name set to:', assignmentResponse.data.assignmentName);
            }
          } catch (err) {
            console.warn('Could not fetch assignment details:', err.message);
          }
        }

        // Direct approach: Query the module_registration table through API
        console.log(`Fetching registered students for module ID: ${moduleId}`);
        
        // This endpoint should directly query the module_registration table using our new endpoint
        const endpoint = `/module-registration/module/${moduleId}`;
        console.log('Using endpoint:', endpoint);
        
        try {
          const response = await axios.get(endpoint);
          
          if (response.status === 200) {
            let studentsData = [];
            
            // Handle response from our new endpoint - should be an array of ModuleRegistrationDTO objects
            if (Array.isArray(response.data) && response.data.length > 0) {
              studentsData = response.data;
              console.log(`Successfully fetched ${studentsData.length} registered students`);
              setRegisteredStudents(studentsData);
              
              // Log the first student to understand the data structure
              console.log('First student data structure:', JSON.stringify(studentsData[0]));
            } else {
              console.warn('No registered students found in the response');
              // Try fallback approach
              await tryFallbackApproaches();
            }
          } else {
            console.warn(`Unexpected response status: ${response.status}`);
            await tryFallbackApproaches();
          }
        } catch (error) {
          console.error(`Error fetching from module_registration table: ${error.message}`);
          await tryFallbackApproaches();
        }
      } catch (error) {
        console.error("Error in fetchRegisteredStudents:", error);
      }
    };
    
    // Fallback approaches if the direct module_registration query fails
    const tryFallbackApproaches = async () => {
      console.log('Trying fallback approaches...');
      
      // Fallback 1: Try the student/module endpoint
      try {
        const endpoint = `/student/module/${moduleId}`;
        console.log('Trying fallback endpoint:', endpoint);
        const response = await axios.get(endpoint);
        
        if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
          console.log(`Fallback 1: Found ${response.data.length} students`);
          setRegisteredStudents(response.data);
          return;
        }
      } catch (err) {
        console.warn(`Fallback 1 failed: ${err.message}`);
      }
      
      // Fallback 2: Try all students as a last resort
      try {
        const endpoint = '/student/';
        console.log('Trying last resort endpoint:', endpoint);
        const response = await axios.get(endpoint);
        
        if (response.status === 200 && Array.isArray(response.data)) {
          console.log(`Last resort: Using all ${response.data.length} students`);
          setRegisteredStudents(response.data);
        } else {
          console.error('All approaches failed. No student data available.');
        }
      } catch (err) {
        console.error(`All approaches failed: ${err.message}`);
      }
    };

    fetchRegisteredStudents();
  }, [moduleId, semesterId, intakeId, departmentId, assignmentId, token]);

  // Handle file upload and data extraction
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Get current assignment details
    const currentAssignmentId = parseInt(localStorage.getItem("assignmentId"));
    let currentAssignmentName = assignmentName;
    
    // If we don't have the assignment name yet, try to find it in the assignments list
    if (!currentAssignmentName && assignments.length > 0) {
      const foundAssignment = assignments.find(a => a.id === currentAssignmentId);
      if (foundAssignment) {
        currentAssignmentName = foundAssignment.assignmentName;
      }
    }
    
    // If still no name, use a default with ID
    if (!currentAssignmentName && currentAssignmentId) {
      currentAssignmentName = `Assignment ${currentAssignmentId}`;
    }
    
    console.log(`Processing file for assignment: ${currentAssignmentName || 'Unknown'}`);
    
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log('Extracted data from Excel:', jsonData);
      
      // Enhance the data with assignment information
      const enhancedData = jsonData.map(row => {
        // Make sure student_Reg_No is preserved exactly as in the Excel file
        const studentRegNo = row.student_Reg_No || row['Student Reg No'] || row['Registration Number'] || '';
        const studentName = row.student_Name || row['Student Name'] || '';
        
        return {
          ...row,
          student_Reg_No: studentRegNo, // Ensure consistent property name
          student_Name: studentName,    // Include student name
          assignmentName: currentAssignmentName || 'Current Assignment',
          assignmentId: currentAssignmentId
        };
      });
      
      console.log('Enhanced data with assignment info:', enhancedData);
      setFileData(enhancedData);
    };

    reader.readAsArrayBuffer(file);
  };

  // Handle edit mark changes
  const handleEditChange = (e) => {
    const value = parseFloat(e.target.value);
    setEditMark(prev => ({
      ...prev,
      marksObtained: isNaN(value) ? 0 : value
    }));
  };

  // Handle saving edited mark
  const handleSaveEdit = async () => {
    try {
      if (!markToEdit || !markToEdit.id) {
        alert("Error: No mark selected for editing.");
        return;
      }

      // Validate the mark
      if (editMark.marksObtained < 0) {
        alert("Marks cannot be negative.");
        return;
      }

      // Create update payload - use the assignmentId from markToEdit if available
      const updateData = {
        studentId: markToEdit.studentId,
        assignmentId: markToEdit.assignmentId || parseInt(assignmentId),
        marksObtained: editMark.marksObtained
      };

      console.log("Sending update with data:", updateData);

      // Send update request
      const response = await axios.put(`/marks/${markToEdit.id}`, updateData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        alert("Mark updated successfully!");
        if (onUploadSuccess) {
          onUploadSuccess(); // Refresh the marks list
        }
        closeForm();
      } else {
        alert(`Error updating mark: ${response.data || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating mark:", error);
      let errorMessage = `Error updating mark: ${error.message}`;
      
      if (error.response && error.response.data) {
        errorMessage = error.response.data;
      }
      
      alert(errorMessage);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Log the file data for debugging
      console.log('File data before processing:', fileData);
      
      // Get current assignment ID from localStorage
      const currentAssignmentId = parseInt(localStorage.getItem("assignmentId"));
      
      if (!currentAssignmentId) {
        alert("Error: No assignment selected. Please select an assignment first.");
        return;
      }
      
      // Find the current assignment to get its details
      const currentAssignment = assignments.find(a => a.id === currentAssignmentId);
      if (!currentAssignment) {
        alert(`Error: Assignment with ID ${currentAssignmentId} not found.`);
        return;
      }
      
      console.log(`Uploading marks for assignment: ${currentAssignment.assignmentName} (ID: ${currentAssignmentId})`);
      
      // Process each row to create valid data for submission
      const validData = [];
      const invalidRows = [];
      
      for (const row of fileData) {
        // Find student by registration number
        let student;
        
        // Try to find by registration number using multiple possible property names
        if (row.student_Reg_No) {
          // Skip header rows
          if (row.student_Reg_No !== "Registration Number" && row.student_Reg_No !== "Student Reg No") {
            // Clean up registration number (remove any whitespace)
            const cleanRegNo = row.student_Reg_No.toString().trim();
            
            // Try multiple possible property names for registration number in the student object
            student = students.find(s => {
              // Get all possible registration number properties from student
              const studentRegNo = (s.regNo || '').toString().trim();
              const studentRegNo2 = (s.studentRegNo || '').toString().trim();
              const studentRegNo3 = (s.student_Reg_No || '').toString().trim();
              const studentId = (s.id || '').toString().trim();
              
              // Compare with the registration number from the Excel file
              return studentRegNo === cleanRegNo || 
                     studentRegNo2 === cleanRegNo || 
                     studentRegNo3 === cleanRegNo || 
                     studentId === cleanRegNo;
            });
            
            // Log for debugging
            if (student) {
              console.log(`Found student match for ${cleanRegNo}:`, student);
            } else {
              console.warn(`No student match found for registration number: ${cleanRegNo}`);
              // Log all student reg numbers for debugging
              console.log('Available student registration numbers:', 
                students.map(s => s.regNo || s.studentRegNo || s.student_Reg_No || s.id).filter(Boolean));
            }
          }
        }
        
        // Skip header row or invalid rows
        if (!student || row.marksObtained === undefined || row.marksObtained === "Marks") {
          invalidRows.push(row);
          continue;
        }
        
        // Add to valid data with the current assignment ID and preserve student registration number
        validData.push({
          studentId: student.id,
          assignmentId: currentAssignmentId, // Always use the current assignment ID
          marksObtained: parseFloat(row.marksObtained),
          student_Reg_No: row.student_Reg_No, // Preserve the registration number
          student_name: student.firstName ? `${student.firstName} ${student.lastName || ''}` : student.name || student.studentName || student.student_name || ''
        });
      }
      
      console.log('Valid data after processing:', validData);

      if (validData.length === 0) {
        // Show detailed error message
        let errorMessage = "No valid data to upload. Please check the file.\n\nPossible issues:";
        if (invalidRows.some(row => !students.find(s => s.regNo === row.student_Reg_No))) {
          errorMessage += "\n- Some student registration numbers could not be matched";
        }
        if (invalidRows.some(row => row.marksObtained === undefined)) {
          errorMessage += "\n- Some rows are missing marks values";
        }
        
        alert(errorMessage);
        return;
      }

      // Add authorization header
      const response = await axios.post("/marks/create-list", validData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.status === 200) {
        alert("Data uploaded successfully!");
        if (onUploadSuccess) {
          onUploadSuccess(); // Call callback to refresh the marks list
        }
        closeForm();
      } else {
        alert(`Error uploading data: ${response.data || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      let errorMessage = `Error uploading data: ${error.message}`;
      
      // Add more context to the error message
      if (error.response) {
        if (error.response.data) {
          errorMessage = error.response.data;
        } else {
          errorMessage += `\nStatus: ${error.response.status}`;
        }
      }
      
      alert(errorMessage);
    }
  };

  // Download the template with registered students
  const handleDownloadTemplate = async () => {
    // Show loading indicator
    alert("Preparing template with registered students...");
    
    // Get current assignment ID and name
    const currentAssignmentId = parseInt(localStorage.getItem("assignmentId"));
    
    if (!currentAssignmentId) {
      alert("Error: No assignment selected. Please select an assignment first.");
      return;
    }
    
    // Find the current assignment to get its details
    let currentAssignmentName = assignmentName;
    
    // If we don't have the assignment name yet, try to find it in the assignments list
    if (!currentAssignmentName && assignments.length > 0) {
      const foundAssignment = assignments.find(a => a.id === currentAssignmentId);
      if (foundAssignment) {
        currentAssignmentName = foundAssignment.assignmentName;
      } else {
        alert(`Error: Assignment with ID ${currentAssignmentId} not found.`);
        return;
      }
    }
    
    // If still no name, use a default with ID
    if (!currentAssignmentName) {
      currentAssignmentName = `Assignment ${currentAssignmentId}`;
    }
    
    console.log(`Creating template for assignment: ${currentAssignmentName} (ID: ${currentAssignmentId})`);
    
    // Use the registeredStudents from state, which is populated by the useEffect
    let registeredStudentsData = registeredStudents;
    
    // If we don't have registered students yet, try to fetch them directly from module_registration table
    if (!registeredStudentsData || registeredStudentsData.length === 0) {
      console.log('No registered students in state, attempting to fetch from module_registration table...');
      
      try {
        // Direct query to module_registration table with the new endpoint
        const endpoint = `/module-registration/module/${moduleId}`;
        console.log('Fetching from:', endpoint);
        
        const response = await axios.get(endpoint);
        
        if (response.status === 200) {
          // The response from our new endpoint is already an array of ModuleRegistrationDTO objects
          if (Array.isArray(response.data) && response.data.length > 0) {
            registeredStudentsData = response.data;
            console.log(`Successfully fetched ${registeredStudentsData.length} registered students from module_registration`);
            
            // Update the state for future use
            setRegisteredStudents(registeredStudentsData);
          } else {
            console.warn('No students found in module_registration response');
            // Try fallback approach
            await fetchStudentsFallback();
          }
        } else {
          console.warn(`Unexpected response status: ${response.status}`);
          await fetchStudentsFallback();
        }
      } catch (error) {
        console.error(`Error fetching from module_registration: ${error.message}`);
        await fetchStudentsFallback();
      }
    } else {
      console.log(`Using ${registeredStudentsData.length} registered students from state`);
    }
    
    // Fallback function to try alternative endpoints
    async function fetchStudentsFallback() {
      try {
        // Try student/module endpoint
        const response = await axios.get(`/student/module/${moduleId}`);
        
        if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
          registeredStudentsData = response.data;
          console.log(`Fallback: fetched ${registeredStudentsData.length} students from student/module endpoint`);
          setRegisteredStudents(registeredStudentsData);
        } else {
          // Last resort: all students
          const allStudentsResponse = await axios.get('/student/');
          if (allStudentsResponse.status === 200 && Array.isArray(allStudentsResponse.data)) {
            registeredStudentsData = allStudentsResponse.data || [];
            console.log(`Last resort: using all ${registeredStudentsData.length} students`);
            setRegisteredStudents(registeredStudentsData);
          } else {
            console.error('All approaches failed. Template may be incomplete.');
            alert('Could not fetch registered students. Template may include all students instead.');
          }
        }
      } catch (error) {
        console.error("All student fetching approaches failed:", error);
        alert(`Error fetching students: ${error.message}. Template may be incomplete.`);
      }
    }
    
    // Create the data array for the Excel sheet
    const excelData = [];
    
    // Add header row with clear column names - include student name for reference
    excelData.push(["student_Reg_No", "student_Name", "marksObtained"]);
    
    // Track if we successfully added any students
    let studentsAdded = 0;
    
    // Add registered students to the template
    if (registeredStudentsData && registeredStudentsData.length > 0) {
      console.log(`Processing ${registeredStudentsData.length} students for Excel template`);
      
      // Add each registered student to the Excel data
      registeredStudentsData.forEach((student, index) => {
        // Handle different data structures that might come from the API
        let regNo = '';
        let studentName = '';
        
        if (typeof student === 'object') {
          // Handle data from our new endpoint (ModuleRegistrationDTO)
          if (student.studentRegNo) {
            regNo = student.studentRegNo;
            studentName = student.studentName || '';
          }
          // Keep fallbacks for other possible formats 
          else if (student.regNo) {
            regNo = student.regNo;
            studentName = student.firstName ? `${student.firstName} ${student.lastName || ''}` : 
                         (student.studentName || '');
          } else if (student.student) {
            // Handle nested student object
            const studentObj = student.student;
            regNo = studentObj.regNo || studentObj.studentRegNo || '';
            studentName = studentObj.studentName || 
                         (studentObj.firstName ? `${studentObj.firstName} ${studentObj.lastName || ''}` : '');
          }
        } else if (typeof student === 'string') {
          regNo = student;
        }
        
        // Only add students with valid registration numbers
        if (regNo && regNo.trim() !== '') {
          console.log(`Adding student ${index+1}: ${regNo} ${studentName ? `(${studentName})` : ''}`);
          
          // Add both student registration number and name to make the template more user-friendly
          // But leave the marks column empty for the user to fill
          excelData.push([regNo, studentName, ""]);
          studentsAdded++;
        }
      });
    }
    
    // If no valid students were added, add example rows with clear indication they are examples
    if (studentsAdded === 0) {
      console.warn('No registered students found in database, adding example rows');
      excelData.push(["EXAMPLE_REG001", "Example Student 1", ""]);
      excelData.push(["EXAMPLE_REG002", "Example Student 2", ""]);
      
      // Add a note about examples
      alert("No registered students found for this module. Example rows have been added to the template.");
    } else {
      console.log(`Successfully added ${studentsAdded} students to the Excel template`);
    }

    // Create and download the Excel file
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    
    // Add some styling to the header row
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({r: 0, c: C});
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "EFEFEF" } }
      };
    }
    
    // Save the file
    XLSX.writeFile(workbook, `${currentAssignmentName}_MarksTemplate.xlsx`);
    
    alert("Template downloaded successfully. Please fill in the marks and upload the file.");
  };

  // If in edit mode, show the edit form
  if (editMode && markToEdit) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Edit Mark</h2>
        <div style={{ marginBottom: "20px" }}>
          <p><strong>Student:</strong> {markToEdit.student_name || "Unknown Student"}</p>
          <p><strong>Registration Number:</strong> {markToEdit.student_Reg_No || "Unknown"}</p>
          <p><strong>Assignment:</strong> {markToEdit.assignmentName || assignmentName || "Unknown Assignment"}</p>
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="marksObtained" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Marks Obtained:
          </label>
          <input
            type="number"
            id="marksObtained"
            min="0"
            step="0.01"
            value={editMark.marksObtained}
            onChange={handleEditChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          />
        </div>
        
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={closeForm}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              background: "#ffffff",
              color: "#1e3a8a",
              border: "2px solid #1e3a8a",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              background: "#1e3a8a",
              color: "#fff",
              border: "2px solid #1e3a8a",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  // Default view for file upload
  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Marks List</h2>

      {/* Button to download the template */}
      <button
        onClick={handleDownloadTemplate}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          background: "#1e3a8a",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Download Excel Template
      </button>

      {/* File upload section */}
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileUpload}
      />

      {/* Preview Data */}
      {fileData.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Preview Data:</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Student Reg No</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Student Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Assignment Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Marks Obtained</th>
              </tr>
            </thead>
            <tbody>
              {fileData.map((row, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.student_Reg_No}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.student_Name || ""}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.assignmentName}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.marksObtained}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submit Button placed near Cancel Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <button
          onClick={closeForm}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            background: "#ffffff",
            color: "#1e3a8a",
            border: "2px solid #1e3a8a",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={fileData.length === 0}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            background: "#1e3a8a",
            color: "#fff",
            border: "2px solid #1e3a8a",
            borderRadius: "5px",
            cursor: "pointer",
            opacity: fileData.length === 0 ? 0.5 : 1,
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadMarks;