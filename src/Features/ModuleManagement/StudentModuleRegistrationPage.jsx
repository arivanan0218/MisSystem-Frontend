import { useState, useEffect } from "react";
import { Input, Button, Table, Select as AntSelect, Tag, Modal, message } from "antd";
import Select from "react-select";
import instance from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export const StudentModuleRegistrationPage = () => {
  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedModules, setSelectedModules] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [semesterId, setSemesterId] = useState(localStorage.getItem("semesterId") || "");
  const [intakeId, setIntakeId] = useState(localStorage.getItem("intakeId") || "");
  const [departmentId, setDepartmentId] = useState(localStorage.getItem("departmentId") || "");

  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Check if token exists
      const token = localStorage.getItem('token') || localStorage.getItem('auth-token');
      console.log('Auth token exists:', !!token);
      
      // Fetch modules for the current department, intake, and semester
      const moduleResponse = await instance.get(`/module/semester`, {
        params: {
          departmentId,
          intakeId,
          semesterId
        }
      });
      
      console.log('Modules fetched successfully:', moduleResponse.data);
      setModules(Array.isArray(moduleResponse.data) ? moduleResponse.data : []);

      // Fetch students for the current department and intake
      const studentResponse = await instance.get("/student/", {
        params: {
          departmentId,
          intakeId
        }
      });
      
      console.log('Students fetched successfully:', studentResponse.data);
      setStudents(Array.isArray(studentResponse.data) ? studentResponse.data : []);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      message.error('Failed to load data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchModuleRegistration = async (studentId) => {
    setLoading(true);
    try {
      console.log(`Fetching module registrations for student ${studentId}`);
      
      const res = await instance.get(`/module-registration/student`, {
        params: {
          studentId,
          semesterId,
          intakeId,
          departmentId
        }
      });
      
      console.log("ModuleRegistrationPage - API Response:", res.data);

      // Store the student data in localStorage before navigating
      localStorage.setItem('currentStudentData', JSON.stringify(res.data));
      
      // Navigate to the registration form page
      navigate(`/registration/${studentId}`);
    } catch (error) {
      console.error("Error fetching module registrations:", error);
      message.error(`Failed to fetch registration details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openModuleSelectionModal = (student) => {
    setCurrentStudent(student);
    
    // Initialize module selection based on module types
    const initialSelection = {};
    modules.forEach(module => {
      // Core modules are always taken with GPA status
      if (module.moduleType === 'CM') {
        initialSelection[module.id] = {
          moduleId: module.id,
          moduleType: 'CM',
          gpaStatus: 'G',
          taken: true
        };
      }
      // General Electives are always NGPA if taken
      else if (module.moduleType === 'GE') {
        initialSelection[module.id] = {
          moduleId: module.id,
          moduleType: 'GE',
          gpaStatus: 'N',
          taken: false
        };
      }
      // Technical Electives can be either GPA or NGPA
      else if (module.moduleType === 'TE') {
        initialSelection[module.id] = {
          moduleId: module.id,
          moduleType: 'TE',
          gpaStatus: 'G',
          taken: false
        };
      }
    });
    
    setSelectedModules({
      [student.id]: initialSelection
    });
    
    setIsModalVisible(true);
  };

  const handleModuleStatusChange = (studentId, moduleId, taken) => {
    setSelectedModules(prev => {
      const updated = { ...prev };
      if (!updated[studentId][moduleId]) {
        return updated;
      }
      
      updated[studentId][moduleId] = {
        ...updated[studentId][moduleId],
        taken
      };
      
      return updated;
    });
  };

  const handleGpaStatusChange = (studentId, moduleId, gpaStatus) => {
    setSelectedModules(prev => {
      const updated = { ...prev };
      if (!updated[studentId][moduleId]) {
        return updated;
      }
      
      updated[studentId][moduleId] = {
        ...updated[studentId][moduleId],
        gpaStatus
      };
      
      return updated;
    });
  };

  const handleSubmit = async (studentId) => {
    setLoading(true);
    try {
      const studentModules = selectedModules[studentId] || {};
      
      // Validate selections
      const coreMissing = modules
        .filter(module => module.moduleType === 'CM')
        .some(module => !studentModules[module.id]?.taken);
      
      if (coreMissing) {
        message.error("All Core Modules must be selected");
        return;
      }
      
      // Format modules for API
      const takenModules = Object.values(studentModules)
        .filter(module => module.taken || module.moduleType === 'CM') // Include all taken modules and all CMs
        .map(module => ({
          moduleId: module.moduleId,
          gpaStatus: module.taken ? module.gpaStatus : "-" // "-" means not taken
        }));

      const payload = {
        studentId,
        semesterId,
        intakeId,
        departmentId,
        takenModules
      };

      console.log("Submitting registration with payload:", payload);
      
      const response = await instance.post("/module-registration", payload);
      console.log("Registration successful:", response);
      
      message.success("Module registration successful!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error submitting module registration:", error);
      
      let errorMsg = "Failed to register modules.";
      if (error.response) {
        errorMsg += ` Server responded with: ${error.response.data || error.response.status}`;
      } else if (error.request) {
        errorMsg += " No response received from server.";
      } else {
        errorMsg += ` Error: ${error.message}`;
      }
      
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Create a unique modules array based on module ID
  const uniqueModules = Array.from(
    new Map(modules.map(mod => [mod.id, mod])).values()
  );

  // Columns for the student table
  const columns = [
    { 
      title: "Reg No", 
      dataIndex: "studentRegNo",
      render: (text, record) => record.studentRegNo || record.regNo || 'N/A',
      sorter: (a, b) => (a.studentRegNo || a.regNo || '').localeCompare(b.studentRegNo || b.regNo || '')
    },
    { 
      title: "Name", 
      dataIndex: "studentName",
      render: (text, record) => record.studentName || record.name || 'N/A'
    },
    {
      title: "Actions",
      render: (_, student) => (
        <div className="flex space-x-2">
          <Button 
            type="primary" 
            onClick={() => openModuleSelectionModal(student)}
            loading={loading}
          >
            Register Modules
          </Button>
          <Button 
            onClick={() => fetchModuleRegistration(student.id)}
            loading={loading}
          >
            View Registration
          </Button>
        </div>
      ),
    },
  ];

  // Columns for the module selection modal table
  const moduleColumns = [
    {
      title: "Module Code",
      dataIndex: "moduleCode"
    },
    {
      title: "Module Name",
      dataIndex: "moduleName"
    },
    {
      title: "Type",
      dataIndex: "moduleType",
      render: (type) => {
        let color;
        switch (type) {
          case 'CM': color = 'blue'; break;
          case 'TE': color = 'green'; break;
          case 'GE': color = 'orange'; break;
          default: color = 'default';
        }
        return <Tag color={color}>{type}</Tag>;
      }
    },
    {
      title: "Credit",
      dataIndex: "credit",
      render: (credit, record) => record.moduleType === 'GE' ? 'N/A' : credit
    },
    {
      title: "Module Taken",
      render: (_, module) => {
        // Core modules are always taken and cannot be changed
        if (module.moduleType === 'CM') {
          return <Tag color="blue">Required</Tag>;
        }

        const isSelected = selectedModules[currentStudent?.id]?.[module.id]?.taken;
        
        return (
          <AntSelect
            value={isSelected ? "Taken" : "Not-Taken"}
            onChange={(value) => handleModuleStatusChange(
              currentStudent.id, 
              module.id, 
              value === "Taken"
            )}
            options={[
              { value: "Taken", label: "Taken" },
              { value: "Not-Taken", label: "Not Taken" }
            ]}
            style={{ width: 120 }}
            disabled={loading || module.moduleType === 'CM'} // Core modules cannot be changed
          />
        );
      }
    },
    {
      title: "GPA Status",
      render: (_, module) => {
        const moduleSelection = selectedModules[currentStudent?.id]?.[module.id];
        const isTaken = moduleSelection?.taken || module.moduleType === 'CM';
        
        // If module is not taken, show N/A
        if (!isTaken && module.moduleType !== 'CM') {
          return <span>N/A</span>;
        }
        
        // Core modules are always GPA
        if (module.moduleType === 'CM') {
          return <Tag color="green">GPA</Tag>;
        }
        
        // General Electives are always NGPA
        if (module.moduleType === 'GE') {
          return <Tag color="orange">NGPA</Tag>;
        }
        
        // Only Technical Electives can be selected as GPA or NGPA
        return (
          <AntSelect
            value={moduleSelection?.gpaStatus || 'G'}
            onChange={(value) => handleGpaStatusChange(
              currentStudent.id, 
              module.id, 
              value
            )}
            options={[
              { value: "G", label: "GPA" },
              { value: "N", label: "NGPA" }
            ]}
            style={{ width: 120 }}
            disabled={loading || !isTaken} // Disable if not taken
          />
        );
      }
    }
  ];

  return (
    <div>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Module Registration</h1>
        
        <div className="flex mb-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <span className="block p-2 border rounded bg-gray-100">{departmentId}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Intake</label>
            <span className="block p-2 border rounded bg-gray-100">{intakeId}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <span className="block p-2 border rounded bg-gray-100">{semesterId}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <Input
            placeholder="Search students by reg no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
            allowClear
          />
        </div>
        
        <Table
          dataSource={students.filter(student => {
            // If search is empty, show all students
            if (!search) return true;
            
            // Search by registration number, handling different property names
            const regNo = student.studentRegNo || student.regNo || '';
            return regNo.toString().toLowerCase().includes(search.toLowerCase());
          })}
          columns={columns}
          rowKey="id"
          loading={loading}
          locale={{ emptyText: 'No students found' }}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Module Selection Modal */}
      {currentStudent && (
        <Modal
          title={`Module Registration for ${currentStudent.studentName || currentStudent.name || 'Student'}`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          width={900}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={() => handleSubmit(currentStudent.id)}
            >
              Submit Registration
            </Button>
          ]}
        >
          <p className="mb-4">
            <strong>Registration No:</strong> {currentStudent.studentRegNo || currentStudent.regNo || 'N/A'}
          </p>
          
          <Table
            dataSource={uniqueModules}
            columns={moduleColumns}
            rowKey="id"
            pagination={false}
            loading={loading}
          />
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Note:</strong></p>
            <ul className="list-disc pl-5">
              <li>Core Modules (CM) are always taken as GPA</li>
              <li>Technical Electives (TE) can be taken as GPA or NGPA</li>
              <li>General Electives (GE) are always taken as NGPA</li>
            </ul>
          </div>
        </Modal>
      )}
      
      <Footer />
    </div>
  );
};

export default StudentModuleRegistrationPage;