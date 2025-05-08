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
      const res = await instance.get(
        `/module-registrations/student/${studentId}/semester/${semesterId}/intake/${intakeId}/department/${departmentId}`
      );
      console.log("Module Registration Data:", res.data);

      const updatedModules = {};
      // Ensure the GPA status for each taken module is fetched and saved
      res.data.takenModules.forEach((mod) => {
        updatedModules[mod.moduleId] = mod.gpaStatus; // Store moduleId with GPA status
      });

      setSelectedModules((prev) => ({
        ...prev,
        [studentId]: updatedModules,
      }));
    } catch (error) {
      console.error("Error fetching module registrations:", error);
    }

    navigate(`/registration/${studentId}`);
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
    { title: "Reg No", dataIndex: "regNo" },
    { title: "Name", dataIndex: "name" },
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
      <Input
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-1/4"
      />
      <Table
        dataSource={students.filter((s) =>
          s.regNo?.toLowerCase().includes(search.toLowerCase())
        )}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};
