// import { useState, useEffect } from "react";
// import { Input, Button, Table } from "antd"; // Ant Design
// import Select from "react-select";
// import instance from "../axiosConfig"; // Import the axios instance

// export const ModuleRegistrationPage = () => {
//   const [modules, setModules] = useState([]); // Ensure modules is an array
//   const [students, setStudents] = useState([]);
//   const [selectedModules, setSelectedModules] = useState({});
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     // Fetching modules
//     instance
//       .get("/module/")
//       .then((res) => {
//         console.log("Fetched modules:", res.data); // Debug log for modules
//         if (Array.isArray(res.data) && res.data.length > 0) {
//           setModules(res.data);
//         } else {
//           console.error(
//             "Modules API returned empty or unexpected data:",
//             res.data
//           );
//           setModules([]); // Fallback to an empty array
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching modules:", err);
//         setModules([]); // Ensure modules is set to empty on error
//       });

//     // Fetching students
//     instance
//       .get("/student/")
//       .then((res) => {
//         console.log("Fetched students:", res.data); // Debug log for students
//         setStudents(res.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching students:", err);
//       });
//   }, []);

//   const handleSelect = (studentId, moduleId, value) => {
//     setSelectedModules((prev) => {
//       const updated = { ...prev };
//       if (!updated[studentId]) updated[studentId] = [];
//       if (value === "G" || value === "N") {
//         updated[studentId] = [...new Set([...updated[studentId], moduleId])];
//       } else {
//         updated[studentId] = updated[studentId].filter((id) => id !== moduleId);
//       }
//       return updated;
//     });
//   };

//   const handleSubmit = async (studentId) => {
//     const student = students.find((s) => s.id === studentId);
//     const takenModuleIds = selectedModules[studentId] || [];
//     const payload = {
//       studentId: student.id,
//       semesterId: localStorage.getItem("semesterId"),
//       intakeId: localStorage.getItem("intakeId"),
//       departmentId: localStorage.getItem("departmentId"),
//       takenModuleIds,
//     };
//     try {
//       await instance.post("/module-registrations", payload);
//       alert("Module registration successful!");
//     } catch (error) {
//       console.error("Error submitting module registration:", error);
//       alert("Failed to register modules.");
//     }
//   };

//   // Define columns for Ant Design Table
//   const columns = [
//     { title: "ID", dataIndex: "id" },
//     { title: "Reg No", dataIndex: "student_Reg_No" },
//     { title: "Name", dataIndex: "student_name" },
//     ...modules.map((mod) => ({
//       title: mod.moduleCode, // Title of each module
//       key: mod.id,
//       render: (_, student) => (
//         <Select
//           options={[
//             { value: "", label: "-" },
//             { value: "G", label: "G" },
//             { value: "N", label: "N" },
//           ]}
//           onChange={(selectedOption) =>
//             handleSelect(student.id, mod.id, selectedOption.value)
//           }
//           className="w-full"
//         />
//       ),
//     })),
//     {
//       title: "Action",
//       render: (_, student) => (
//         <Button onClick={() => handleSubmit(student.id)}>Add</Button>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <Input
//         placeholder="Search students..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="mb-4 w-1/4"
//       />
//       <Table
//         dataSource={students.filter((s) =>
//           s.student_Reg_No.toLowerCase().includes(search.toLowerCase())
//         )}
//         columns={columns} // Pass the columns to Table component
//         rowKey="id"
//       />
//     </div>
//   );
// };

import { useState, useEffect } from "react";
import { Input, Button, Table } from "antd";
import Select from "react-select";
import instance from "../axiosConfig";
import { useNavigate } from "react-router-dom";

export const ModuleRegistrationPage = () => {
  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedModules, setSelectedModules] = useState({});
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    instance
      .get("/module/")
      .then((res) => {
        setModules(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setModules([]));

    instance
      .get("/student/")
      .then((res) => {
        setStudents(res.data);
      })
      .catch(() => setStudents([]));
  }, []);

  const fetchModuleRegistration = async (studentId) => {
    const semesterId = localStorage.getItem("semesterId");
    const intakeId = localStorage.getItem("intakeId");
    const departmentId = localStorage.getItem("departmentId");
    try {
      const res = await instance.get(
        `/module-registrations/student/${studentId}/semester/${semesterId}/intake/${intakeId}/department/${departmentId}`
      );
      console.log("Module Registration Data:", res.data); // Log data to console
      setSelectedModules((prev) => ({
        ...prev,
        [studentId]: res.data.takenModuleIds || [],
      }));
    } catch (error) {
      console.error("Error fetching module registrations:", error);
    }
    navigate(`/registration/${studentId}`);
  };

  const handleSelect = (studentId, moduleId, value) => {
    setSelectedModules((prev) => {
      const updated = { ...prev, [studentId]: prev[studentId] || [] };
      if (value === "G" || value === "N") {
        updated[studentId] = [...new Set([...updated[studentId], moduleId])];
      } else {
        updated[studentId] = updated[studentId].filter((id) => id !== moduleId);
      }
      return updated;
    });
  };

  const handleSubmit = async (studentId) => {
    const takenModuleIds = selectedModules[studentId] || [];
    const payload = {
      studentId,
      semesterId: localStorage.getItem("semesterId"),
      intakeId: localStorage.getItem("intakeId"),
      departmentId: localStorage.getItem("departmentId"),
      takenModuleIds,
    };
    try {
      await instance.post("/module-registrations", payload);
      alert("Module registration successful!");
    } catch (error) {
      console.error("Error submitting module registration:", error);
      alert("Failed to register modules.");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Reg No", dataIndex: "student_Reg_No" },
    { title: "Name", dataIndex: "student_name" },
    ...modules.map((mod) => ({
      title: mod.moduleCode,
      key: mod.id,
      render: (_, student) => (
        <Select
          options={[
            { value: "", label: "-" },
            { value: "G", label: "G" },
            { value: "N", label: "N" },
          ]}
          value={
            selectedModules[student.id]?.includes(mod.id)
              ? { value: "G", label: "G" }
              : { value: "", label: "-" }
          }
          onChange={(selectedOption) =>
            handleSelect(student.id, mod.id, selectedOption.value)
          }
          className="w-full"
        />
      ),
    })),
    {
      title: "Action",
      render: (_, student) => (
        <>
          <Button onClick={() => fetchModuleRegistration(student.id)}>
            Fetch
          </Button>

          <Button onClick={() => handleSubmit(student.id)}>Add</Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Input
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-1/4"
      />
      <Table
        dataSource={students.filter((s) =>
          s.student_Reg_No.toLowerCase().includes(search.toLowerCase())
        )}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};
