import { useState, useEffect } from "react";
import { Input, Button, Table } from "antd";
import Select from "react-select";
import instance from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export const ModuleRegistrationPage = () => {
  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedModules, setSelectedModules] = useState({});
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
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
      const res = await instance.get(
        `/module-registrations/student/${studentId}/semester/${semesterId}/intake/${intakeId}/department/${departmentId}`
      );
      
      // Only log once with a clear identifier
      console.log("ModuleRegistrationPage - API Response:", res.data);

      const updatedModules = {};
      
      // Check if modules exists and is an array before using forEach
      // The API returns 'modules' instead of 'takenModules'
      if (res.data && res.data.modules && Array.isArray(res.data.modules)) {
        // Process each module
        res.data.modules.forEach((mod) => {
          if (mod && mod.id) {
            // Use module id and gpa_Status from the response
            updatedModules[mod.id] = mod.gpa_Status || 'G'; 
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
      // This prevents the need for a duplicate API call in ModuleRegistrationForm
      localStorage.setItem('currentStudentData', JSON.stringify(res.data));
      
      // Navigate to the registration page
      navigate(`/registration/${studentId}`);
    } catch (error) {
      console.error("Error fetching module registrations:", error);
      alert(`Error fetching module registrations: ${error.message}`);
      
      // Update with empty object to avoid undefined errors in other parts of the code
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

    const takenModuleIds = Object.keys(takenModules).map((modId) => ({
      moduleId: modId,
      gpaStatus: takenModules[modId],
    }));

    const payload = {
      studentId,
      semesterId: localStorage.getItem("semesterId"),
      intakeId: localStorage.getItem("intakeId"),
      departmentId: localStorage.getItem("departmentId"),
      takenModules: takenModuleIds,
    };

    try {
      await instance.post("/module-registrations", payload);
      alert("Module registration successful!");
    } catch (error) {
      console.error("Error submitting module registration:", error);
      alert("Failed to register modules.");
    }
  };

  // Deduplicate the modules array based on the `id` property
  const uniqueModules = Array.from(new Map(modules.map((mod) => [mod.id, mod])).values());

  console.log("Unique Modules:", uniqueModules);

  const columns = [
    { title: "ID", dataIndex: "id" },
    { 
      title: "Reg No", 
      dataIndex: "student_Reg_No",
      render: (text, record) => record.student_Reg_No || record.regNo || 'N/A'
    },
    { 
      title: "Name", 
      dataIndex: "student_name",
      render: (text, record) => record.student_name || record.name || 'N/A'
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
    
    <div className="p-6">
      <Header/>
      <Input
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-1/4"
      />
      {/* Debugging info */}
      <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
        <p><strong>Students loaded:</strong> {students.length}</p>
        {students.length > 0 && (
          <div>
            <p><strong>First student properties:</strong> {Object.keys(students[0]).join(', ')}</p>
            <p><strong>Student Reg No field:</strong> {students[0].student_Reg_No || students[0].regNo || 'Not found'}</p>
          </div>
        )}
      </div>
      
      <Table
        dataSource={students.filter((s) => {
          // If search is empty, show all students
          if (!search) return true;
          
          // Try different possible property names for registration number
          const regNo = s.student_Reg_No || s.regNo || '';
          return regNo.toString().toLowerCase().includes(search.toLowerCase());
        })}
        columns={columns}
        rowKey="id"
        locale={{ emptyText: 'No students found. Please check the console for errors.' }}
      />
      <Footer/>
    </div>
  );
};
