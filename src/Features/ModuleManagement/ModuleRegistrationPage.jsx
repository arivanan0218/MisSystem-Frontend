// // import { useState, useEffect } from "react";
// // import { Input, Button, Table } from "antd";
// // import Select from "react-select";
// // import instance from "../axiosConfig";
// // import { useNavigate } from "react-router-dom";
// // import Header from "../Components/Header";
// // import Footer from "../Components/Footer";

// // export const ModuleRegistrationPage = () => {
// //   const [modules, setModules] = useState([]);
// //   const [students, setStudents] = useState([]);
// //   const [selectedModules, setSelectedModules] = useState({});
// //   const [search, setSearch] = useState("");

// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     // Check if token exists
// //     const token = localStorage.getItem('token');
// //     console.log('Auth token exists:', !!token);
    
// //     // Fetch modules
// //     console.log('Fetching modules...');
// //     instance
// //       .get("/module/")
// //       .then((res) => {
// //         console.log('Modules fetched successfully:', res.data);
// //         setModules(Array.isArray(res.data) ? res.data : []);
// //       })
// //       .catch((error) => {
// //         console.error('Error fetching modules:', error.response?.status, error.message);
// //         setModules([]);
// //       });

// //     // Fetch students
// //     console.log('Fetching students...');
// //     instance
// //       .get("/student/")
// //       .then((res) => {
// //         console.log('Students fetched successfully:', res.data);
// //         console.log('Student data type:', typeof res.data);
// //         console.log('Is array?', Array.isArray(res.data));
// //         if (res.data && res.data.length > 0) {
// //           console.log('First student:', res.data[0]);
// //         }
// //         setStudents(Array.isArray(res.data) ? res.data : []);
// //       })
// //       .catch((error) => {
// //         console.error('Error fetching students:', error.response?.status, error.message);
// //         setStudents([]);
// //       });
// //   }, []);

// //   useEffect(() => {
// //     // Automatically select GPA modules when students and modules are loaded
// //     const updatedSelection = {};
// //     students.forEach((student) => {
// //       modules.forEach((mod) => {
// //         if (mod.gpa_Status === "G") {
// //           if (!updatedSelection[student.id]) {
// //             updatedSelection[student.id] = {};
// //           }
// //           updatedSelection[student.id][mod.id] = "G"; // Store GPA status
// //         }
// //       });
// //     });
// //     setSelectedModules(updatedSelection);
// //   }, [modules, students]);

// //   const fetchModuleRegistration = async (studentId) => {
// //     const semesterId = localStorage.getItem("semesterId");
// //     const intakeId = localStorage.getItem("intakeId");
// //     const departmentId = localStorage.getItem("departmentId");

// //     try {
// //       console.log(`Fetching module registrations for student ${studentId}`);
// //       const res = await instance.get(
// //         `/module-registration/student/${studentId}/semester/${semesterId}/intake/${intakeId}/department/${departmentId}`
// //       );
      
// //       // Only log once with a clear identifier
// //       console.log("ModuleRegistrationPage - API Response:", res.data);

// //       const updatedModules = {};
      
// //       // Check if modules exists and is an array before using forEach
// //       // The API returns 'modules' instead of 'takenModules'
// //       if (res.data && res.data.modules && Array.isArray(res.data.modules)) {
// //         // Process each module
// //         res.data.modules.forEach((mod) => {
// //           if (mod && mod.id) {
// //             // Use module id and gpa_Status from the response
// //             updatedModules[mod.id] = mod.gpa_Status || 'G'; 
// //           }
// //         });

// //         setSelectedModules((prev) => ({
// //           ...prev,
// //           [studentId]: updatedModules,
// //         }));
        
// //         console.log(`Successfully processed ${res.data.modules.length} modules for student ${studentId}`);
// //       } else {
// //         console.log("No modules found in the response or invalid format");
// //         // Still update the state with an empty object to avoid undefined errors
// //         setSelectedModules((prev) => ({
// //           ...prev,
// //           [studentId]: {},
// //         }));
// //       }
      
// //       // Store the student data in localStorage before navigating
// //       // This prevents the need for a duplicate API call in ModuleRegistrationForm
// //       localStorage.setItem('currentStudentData', JSON.stringify(res.data));
      
// //       // Navigate to the registration page
// //       navigate(`/registration/${studentId}`);
// //     } catch (error) {
// //       console.error("Error fetching module registrations:", error);
// //       alert(`Error fetching module registrations: ${error.message}`);
      
// //       // Update with empty object to avoid undefined errors in other parts of the code
// //       setSelectedModules((prev) => ({
// //         ...prev,
// //         [studentId]: {},
// //       }));
// //     }
// //   };

// //   const handleSelect = (studentId, moduleId, value) => {
// //     setSelectedModules((prev) => {
// //       const updated = { ...prev };

// //       if (!updated[studentId]) {
// //         updated[studentId] = {};
// //       }

// //       if (value) {
// //         updated[studentId][moduleId] = value;
// //       } else {
// //         delete updated[studentId][moduleId];
// //       }

// //       return { ...updated }; // Ensures re-render
// //     });
// //   };

// //   const handleSubmit = async (studentId) => {
// //     const takenModules = selectedModules[studentId] || {};
// //     const invalidModules = uniqueModules.filter(
// //       (mod) => mod.gpa_Status !== "G" && !takenModules[mod.id]
// //     );

// //     if (invalidModules.length > 0) {
// //       alert("Please make a selection for all required modules.");
// //       return;
// //     }

// //     const takenModuleIds = Object.keys(takenModules).map((modId) => ({
// //       moduleId: modId,
// //       gpaStatus: takenModules[modId],
// //     }));

// //     const payload = {
// //       studentId,
// //       semesterId: localStorage.getItem("semesterId"),
// //       intakeId: localStorage.getItem("intakeId"),
// //       departmentId: localStorage.getItem("departmentId"),
// //       takenModules: takenModuleIds,
// //     };

// //     try {
// //       await instance.post("/module-registration", payload);
// //       alert("Module registration successful!");
// //     } catch (error) {
// //       console.error("Error submitting module registration:", error);
// //       alert("Failed to register modules.");
// //     }
// //   };

// //   // Deduplicate the modules array based on the `id` property
// //   const uniqueModules = Array.from(new Map(modules.map((mod) => [mod.id, mod])).values());

// //   console.log("Unique Modules:", uniqueModules);

// //   const columns = [
// //     { title: "ID", dataIndex: "id" },
// //     { 
// //       title: "Reg No", 
// //       dataIndex: "studentRegNo",
// //       render: (text, record) => record.studentRegNo || record.regNo || 'N/A'
// //     },
// //     { 
// //       title: "Name", 
// //       dataIndex: "studentName",
// //       render: (text, record) => record.studentName || record.name || 'N/A'
// //     },
// //     ...uniqueModules.map((mod) => ({
// //       title: mod.moduleCode,
// //       key: mod.id, // Use the unique `id` as the key
// //       render: (_, student) => {
// //         const selectedStatus = selectedModules[student.id]?.[mod.id] || " ";
// //         return mod.gpa_Status === "G" ? (
// //           <span>G</span> // GPA modules always show "G"
// //         ) : (
// //           <Select
// //             options={[
// //               { value: "-", label: "-" },
// //               { value: "G", label: "G" },
// //               { value: "N", label: "N" },
// //             ]}
// //             value={
// //               selectedStatus
// //                 ? { value: selectedStatus, label: selectedStatus }
// //                 : { value: " ", label: "-" }
// //             }
// //             onChange={(selectedOption) =>
// //               handleSelect(student.id, mod.id, selectedOption.value)
// //             }
// //             className="w-full"
// //           />
// //         );
// //       },
// //     })),
// //     {
// //       title: "Action",
// //       render: (_, student) => (
// //         <>
// //           <Button onClick={() => fetchModuleRegistration(student.id)}>Fetch</Button>
// //           <Button onClick={() => handleSubmit(student.id)}>Add</Button>
// //         </>
// //       ),
// //     },
// //   ];

// //   return (
    
// //     <div className="p-6">
// //       <Header/>
// //       <Input
// //         placeholder="Search students..."
// //         value={search}
// //         onChange={(e) => setSearch(e.target.value)}
// //         className="mb-4 w-1/4"
// //       />
// //       {/* Debugging info */}
// //       <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
// //         <p><strong>Students loaded:</strong> {students.length}</p>
// //         {students.length > 0 && (
// //           <div>
// //             <p><strong>First student properties:</strong> {Object.keys(students[0]).join(', ')}</p>
// //             <p><strong>Student Reg No field:</strong> {students[0].studentRegNo || students[0].regNo || 'Not found'}</p>
// //           </div>
// //         )}
// //       </div>
      
// //       <Table
// //         dataSource={students.filter((s) => {
// //           // If search is empty, show all students
// //           if (!search) return true;
          
// //           // Try different possible property names for registration number
// //           const regNo = s.studentRegNo || s.regNo || '';
// //           return regNo.toString().toLowerCase().includes(search.toLowerCase());
// //         })}
// //         columns={columns}
// //         rowKey="id"
// //         locale={{ emptyText: 'No students found. Please check the console for errors.' }}
// //       />
// //       <Footer/>
// //     </div>
// //   );
// // };


// import { useState, useEffect, useCallback } from "react";
// import { Input, Button, Table } from "antd";
// import Select from "react-select";
// import instance from "../axiosConfig";
// import { useNavigate } from "react-router-dom";
// import Header from "../Components/Header";
// import Footer from "../Components/Footer";

// export const ModuleRegistrationPage = () => {
//   const [modules, setModules] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedModules, setSelectedModules] = useState({});
//   const [search, setSearch] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if token exists
//     const token = localStorage.getItem('token') || localStorage.getItem('auth-token');
//     console.log('Auth token exists:', !!token);
    
//     // Fetch modules
//     console.log('Fetching modules...');
//     instance
//       .get("/module/")
//       .then((res) => {
//         console.log('Modules fetched successfully:', res.data);
//         setModules(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch((error) => {
//         console.error('Error fetching modules:', error.response?.status, error.message);
//         setModules([]);
//       });

//     // Fetch students
//     console.log('Fetching students...');
//     instance
//       .get("/student/")
//       .then((res) => {
//         console.log('Students fetched successfully:', res.data);
//         console.log('Student data type:', typeof res.data);
//         console.log('Is array?', Array.isArray(res.data));
//         if (res.data && res.data.length > 0) {
//           console.log('First student:', res.data[0]);
//         }
//         setStudents(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch((error) => {
//         console.error('Error fetching students:', error.response?.status, error.message);
//         setStudents([]);
//       });
//   }, []);

//   useEffect(() => {
//     // Automatically select GPA modules when students and modules are loaded
//     const updatedSelection = {};
//     students.forEach((student) => {
//       modules.forEach((mod) => {
//         if (mod.gpa_Status === "G") {
//           if (!updatedSelection[student.id]) {
//             updatedSelection[student.id] = {};
//           }
//           updatedSelection[student.id][mod.id] = "G"; // Store GPA status
//         }
//       });
//     });
//     setSelectedModules(updatedSelection);
//   }, [modules, students]);

//   const fetchModuleRegistration = async (studentId) => {
//     const semesterId = localStorage.getItem("semesterId");
//     const intakeId = localStorage.getItem("intakeId");
//     const departmentId = localStorage.getItem("departmentId");

//     try {
//       console.log(`Fetching module registrations for student ${studentId}`);
//       // Use the correct endpoint pattern according to the Swagger docs
//       const res = await instance.get(
//         `/module-registration/student`, {
//           params: {
//             studentId,
//             semesterId,
//             intakeId,
//             departmentId
//           }
//         }
//       );
      
//       // Only log once with a clear identifier
//       console.log("ModuleRegistrationPage - API Response:", res.data);

//       const updatedModules = {};
      
//       // Check if modules exists and is an array before using forEach
//       // The API returns 'modules' according to Swagger
//       if (res.data && res.data.modules && Array.isArray(res.data.modules)) {
//         // Process each module
//         res.data.modules.forEach((mod) => {
//           if (mod && mod.moduleId) {
//             // Use moduleId and grade from the response structure
//             updatedModules[mod.moduleId] = mod.grade || 'G'; 
//           }
//         });

//         setSelectedModules((prev) => ({
//           ...prev,
//           [studentId]: updatedModules,
//         }));
        
//         console.log(`Successfully processed ${res.data.modules.length} modules for student ${studentId}`);
//       } else {
//         console.log("No modules found in the response or invalid format");
//         // Still update the state with an empty object to avoid undefined errors
//         setSelectedModules((prev) => ({
//           ...prev,
//           [studentId]: {},
//         }));
//       }
      
//       // Store the student data in localStorage before navigating
//       // This prevents the need for a duplicate API call in ModuleRegistrationForm
//       localStorage.setItem('currentStudentData', JSON.stringify(res.data));
      
//       // Navigate to the registration page
//       navigate(`/registration/${studentId}`);
//     } catch (error) {
//       console.error("Error fetching module registrations:", error);
//       alert(`Error fetching module registrations: ${error.message}`);
      
//       // Update with empty object to avoid undefined errors in other parts of the code
//       setSelectedModules((prev) => ({
//         ...prev,
//         [studentId]: {},
//       }));
//     }
//   };

//   const handleSelect = (studentId, moduleId, value) => {
//     setSelectedModules((prev) => {
//       const updated = { ...prev };

//       if (!updated[studentId]) {
//         updated[studentId] = {};
//       }

//       if (value) {
//         updated[studentId][moduleId] = value;
//       } else {
//         delete updated[studentId][moduleId];
//       }

//       return { ...updated }; // Ensures re-render
//     });
//   };

//   const handleSubmit = async (studentId) => {
//     const takenModules = selectedModules[studentId] || {};
//     const invalidModules = uniqueModules.filter(
//       (mod) => mod.gpa_Status !== "G" && !takenModules[mod.id]
//     );

//     if (invalidModules.length > 0) {
//       alert("Please make a selection for all required modules.");
//       return;
//     }

//     // Update this section to match the API's expected format
//     const modulesList = Object.keys(takenModules).map((modId) => ({
//       moduleId: modId,
//       grade: takenModules[modId],
//       moduleName: modules.find(m => m.id.toString() === modId.toString())?.moduleName || "",
//       moduleCode: modules.find(m => m.id.toString() === modId.toString())?.moduleCode || "",
//       status: "Taken"
//     }));

//     const payload = {
//       studentId,
//       semesterId: localStorage.getItem("semesterId"),
//       intakeId: localStorage.getItem("intakeId"),
//       departmentId: localStorage.getItem("departmentId"),
//       modules: modulesList  // Changed from takenModules to modules
//     };

//     try {
//       await instance.post("/module-registration", payload);
//       alert("Module registration successful!");
//     } catch (error) {
//       console.error("Error submitting module registration:", error);
//       alert("Failed to register modules.");
//     }
//   };

//   // Deduplicate the modules array based on the `id` property
//   const uniqueModules = Array.from(new Map(modules.map((mod) => [mod.id, mod])).values());

//   console.log("Unique Modules:", uniqueModules);

//   const columns = [
//     { title: "ID", dataIndex: "id" },
//     { 
//       title: "Reg No", 
//       dataIndex: "studentRegNo", // Use correct API field name
//       render: (text, record) => record.studentRegNo || 'N/A'
//     },
//     { 
//       title: "Name", 
//       dataIndex: "studentName", // Use correct API field name
//       render: (text, record) => record.studentName || 'N/A'
//     },
//     ...uniqueModules.map((mod) => ({
//       title: mod.moduleCode,
//       key: mod.id, // Use the unique `id` as the key
//       render: (_, student) => {
//         const selectedStatus = selectedModules[student.id]?.[mod.id] || " ";
//         return mod.gpa_Status === "G" ? (
//           <span>G</span> // GPA modules always show "G"
//         ) : (
//           <Select
//             options={[
//               { value: "-", label: "-" },
//               { value: "G", label: "G" },
//               { value: "N", label: "N" },
//             ]}
//             value={
//               selectedStatus
//                 ? { value: selectedStatus, label: selectedStatus }
//                 : { value: " ", label: "-" }
//             }
//             onChange={(selectedOption) =>
//               handleSelect(student.id, mod.id, selectedOption.value)
//             }
//             className="w-full"
//           />
//         );
//       },
//     })),
//     {
//       title: "Action",
//       render: (_, student) => (
//         <>
//           <Button onClick={() => fetchModuleRegistration(student.id)}>Fetch</Button>
//           <Button onClick={() => handleSubmit(student.id)}>Add</Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Header />
//       <div className="p-6">
//         <Input
//           placeholder="Search students..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="mb-4 w-1/4"
//         />
//         {/* Debugging info - can be removed for production */}
//         <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
//           <p><strong>Students loaded:</strong> {students.length}</p>
//           {students.length > 0 && (
//             <div>
//               <p><strong>First student properties:</strong> {Object.keys(students[0]).join(', ')}</p>
//               <p><strong>Student Reg No field:</strong> {students[0].studentRegNo || 'Not found'}</p>
//             </div>
//           )}
//         </div>
        
//         <Table
//           dataSource={students.filter((s) => {
//             // If search is empty, show all students
//             if (!search) return true;
            
//             // Search using the correct field name
//             const regNo = s.studentRegNo || '';
//             return regNo.toString().toLowerCase().includes(search.toLowerCase());
//           })}
//           columns={columns}
//           rowKey="id"
//           locale={{ emptyText: 'No students found. Please check the console for errors.' }}
//         />
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default ModuleRegistrationPage;

import { useState, useEffect } from "react";
import { Input, Button, Table } from "antd";
import Select from "react-select";
import instance from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export const ModuleRegistrationPage = () => {
  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedModules, setSelectedModules] = useState({});
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token') || localStorage.getItem('auth-token');
    console.log('Auth token exists:', !!token);
    
    // Fetch modules
    console.log('Fetching modules...');
    instance
      .get("/module/")
      .then((res) => {
        console.log('Modules fetched successfully:', res.data);
        setModules(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error('Error fetching modules:', error.response?.status, error.message);
        setModules([]);
      });

    // Fetch students
    console.log('Fetching students...');
    instance
      .get("/student/")
      .then((res) => {
        console.log('Students fetched successfully:', res.data);
        console.log('Student data type:', typeof res.data);
        console.log('Is array?', Array.isArray(res.data));
        if (res.data && res.data.length > 0) {
          console.log('First student:', res.data[0]);
        }
        setStudents(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error('Error fetching students:', error.response?.status, error.message);
        setStudents([]);
      });
  }, []);

  useEffect(() => {
    // Automatically select GPA modules when students and modules are loaded
    const updatedSelection = {};
    students.forEach((student) => {
      modules.forEach((mod) => {
        if (mod.gpa_Status === "G") {
          if (!updatedSelection[student.id]) {
            updatedSelection[student.id] = {};
          }
          updatedSelection[student.id][mod.id] = "G"; // Store GPA status
        }
      });
    });
    setSelectedModules(updatedSelection);
  }, [modules, students]);

  const fetchModuleRegistration = async (studentId) => {
    const semesterId = localStorage.getItem("semesterId");
    const intakeId = localStorage.getItem("intakeId");
    const departmentId = localStorage.getItem("departmentId");

    try {
      console.log(`Fetching module registrations for student ${studentId}`);
      
      // Try both API endpoint patterns to ensure compatibility
      let res;
      try {
        // First attempt: Query parameters approach
        console.log("Trying endpoint with query parameters");
        res = await instance.get(
          `/module-registration/student`, {
            params: {
              studentId,
              semesterId,
              intakeId,
              departmentId
            }
          }
        );
      } catch (err) {
        console.log("Query parameters approach failed:", err.message);
        console.log("Trying path parameters approach");
        
        // Second attempt: Path parameters approach
        res = await instance.get(
          `/module-registration/student/${studentId}/semester/${semesterId}/intake/${intakeId}/department/${departmentId}`
        );
      }
      
      // Only log once with a clear identifier
      console.log("ModuleRegistrationPage - API Response:", res.data);

      const updatedModules = {};
      
      // Handle both API response formats
      if (res.data && res.data.modules && Array.isArray(res.data.modules)) {
        // Process each module - handle both possible field names
        res.data.modules.forEach((mod) => {
          if (mod) {
            const moduleId = mod.moduleId || mod.id;
            if (moduleId) {
              // Use either grade or gpa_Status
              updatedModules[moduleId] = mod.grade || mod.gpa_Status || 'G'; 
            }
          }
        });

        setSelectedModules((prev) => ({
          ...prev,
          [studentId]: updatedModules,
        }));
        
        console.log(`Successfully processed ${res.data.modules.length} modules for student ${studentId}`);
      } else {
        console.log("No modules found in the response or invalid format");
        // Still update the state with an empty object to avoid undefined errors
        setSelectedModules((prev) => ({
          ...prev,
          [studentId]: {},
        }));
      }
      
      // Store the student data in localStorage before navigating
      localStorage.setItem('currentStudentData', JSON.stringify(res.data));
      
      // Navigate to the registration page
      navigate(`/registration/${studentId}`);
    } catch (error) {
      console.error("Error fetching module registrations:", error);
      alert(`Error fetching module registrations: ${error.message}`);
      
      // Update with empty object to avoid undefined errors
      setSelectedModules((prev) => ({
        ...prev,
        [studentId]: {},
      }));
    }
  };

  const handleSelect = (studentId, moduleId, value) => {
    setSelectedModules((prev) => {
      const updated = { ...prev };

      if (!updated[studentId]) {
        updated[studentId] = {};
      }

      if (value) {
        updated[studentId][moduleId] = value;
      } else {
        delete updated[studentId][moduleId];
      }

      return { ...updated }; // Ensures re-render
    });
  };

  const handleSubmit = async (studentId) => {
    const takenModules = selectedModules[studentId] || {};
    const invalidModules = uniqueModules.filter(
      (mod) => mod.gpa_Status !== "G" && !takenModules[mod.id]
    );

    if (invalidModules.length > 0) {
      alert("Please make a selection for all required modules.");
      return;
    }

    // Try both API payload formats to ensure compatibility
    try {
      // Format 1: Using the takenModules format from the first code example
      const takenModuleIds = Object.keys(takenModules).map((modId) => ({
        moduleId: modId,
        gpaStatus: takenModules[modId],
      }));

      const payload1 = {
        studentId,
        semesterId: localStorage.getItem("semesterId"),
        intakeId: localStorage.getItem("intakeId"),
        departmentId: localStorage.getItem("departmentId"),
        takenModules: takenModuleIds,
      };

      console.log("Attempting submission with payload format 1:", payload1);
      
      try {
        const response = await instance.post("/module-registration", payload1);
        console.log("Registration successful with format 1:", response);
        alert("Module registration successful!");
        return; // Exit if successful
      } catch (error) {
        console.error("Format 1 failed, trying format 2:", error);
        // Continue to try format 2
      }

      // Format 2: Using the modules format from the second code example
      const modulesList = Object.keys(takenModules).map((modId) => {
        const module = modules.find(m => m.id.toString() === modId.toString());
        return {
          moduleId: modId,
          grade: takenModules[modId],
          moduleName: module?.moduleName || "",
          moduleCode: module?.moduleCode || "",
          status: "Taken"
        };
      });

      const payload2 = {
        studentId,
        semesterId: localStorage.getItem("semesterId"),
        intakeId: localStorage.getItem("intakeId"),
        departmentId: localStorage.getItem("departmentId"),
        modules: modulesList
      };

      console.log("Attempting submission with payload format 2:", payload2);
      const response = await instance.post("/module-registration", payload2);
      console.log("Registration successful with format 2:", response);
      alert("Module registration successful!");
      
    } catch (error) {
      console.error("Error submitting module registration (both formats failed):", error);
      
      // More detailed error message
      let errorMsg = "Failed to register modules.";
      if (error.response) {
        errorMsg += ` Server responded with status: ${error.response.status}.`;
        if (error.response.data && error.response.data.message) {
          errorMsg += ` Message: ${error.response.data.message}`;
        }
      } else if (error.request) {
        errorMsg += " No response received from server. Please check your connection.";
      } else {
        errorMsg += ` Error: ${error.message}`;
      }
      
      alert(errorMsg);
    }
  };

  // Deduplicate the modules array based on the `id` property
  const uniqueModules = Array.from(new Map(modules.map((mod) => [mod.id, mod])).values());

  console.log("Unique Modules:", uniqueModules);

  const columns = [
    { title: "ID", dataIndex: "id" },
    { 
      title: "Reg No", 
      dataIndex: "studentRegNo",
      render: (text, record) => record.studentRegNo || record.regNo || 'N/A'
    },
    { 
      title: "Name", 
      dataIndex: "studentName",
      render: (text, record) => record.studentName || record.name || 'N/A'
    },
    ...uniqueModules.map((mod) => ({
      title: mod.moduleCode,
      key: mod.id, // Use the unique `id` as the key
      render: (_, student) => {
        const selectedStatus = selectedModules[student.id]?.[mod.id] || " ";
        return mod.gpa_Status === "G" ? (
          <span>G</span> // GPA modules always show "G"
        ) : (
          <Select
            options={[
              { value: "-", label: "-" },
              { value: "G", label: "G" },
              { value: "N", label: "N" },
            ]}
            value={
              selectedStatus
                ? { value: selectedStatus, label: selectedStatus }
                : { value: " ", label: "-" }
            }
            onChange={(selectedOption) =>
              handleSelect(student.id, mod.id, selectedOption.value)
            }
            className="w-full"
          />
        );
      },
    })),
    {
      title: "Action",
      render: (_, student) => (
        <>
          <Button onClick={() => fetchModuleRegistration(student.id)}>Fetch</Button>
          <Button onClick={() => handleSubmit(student.id)}>Add</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <div className="p-6">
        <Input
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-1/4"
        />
        {/* Debugging info - can be removed for production */}
        <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
          <p><strong>Students loaded:</strong> {students.length}</p>
          {students.length > 0 && (
            <div>
              <p><strong>First student properties:</strong> {Object.keys(students[0]).join(', ')}</p>
              <p><strong>Student Reg No field:</strong> {students[0].studentRegNo || students[0].regNo || 'Not found'}</p>
            </div>
          )}
        </div>
        
        <Table
          dataSource={students.filter((s) => {
            // If search is empty, show all students
            if (!search) return true;
            
            // Search by registration number, handling different property names
            const regNo = s.studentRegNo || s.regNo || '';
            return regNo.toString().toLowerCase().includes(search.toLowerCase());
          })}
          columns={columns}
          rowKey="id"
          locale={{ emptyText: 'No students found. Please check the console for errors.' }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default ModuleRegistrationPage;