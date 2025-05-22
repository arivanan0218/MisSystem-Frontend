import { useState, useEffect } from "react";
import { Table, Button, Select, Tag, message, Spin, Alert, Modal, Input, Tabs, Breadcrumb } from "antd";
import instance from "../../axiosConfig";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import BreadcrumbItem from "../../Components/Breadcrumb";

const { TabPane } = Tabs;
const { Option } = Select;

export const ModuleRegistrationPage = () => {
  const [loading, setLoading] = useState(false);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [moduleList, setModuleList] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleRegistrations, setModuleRegistrations] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRegistration, setCurrentRegistration] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [intakes, setIntakes] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    departmentId: localStorage.getItem("departmentId") || "",
    intakeId: localStorage.getItem("intakeId") || "",
    semesterId: localStorage.getItem("semesterId") || ""
  });
  const [error, setError] = useState(null);
  const departmentId = localStorage.getItem("departmentId");
  const intakeId = localStorage.getItem("intakeId");  

  useEffect(() => {
    // Load filter options
    fetchFilterOptions();
    
    // If all filters are set, load pending registrations
    if (selectedFilters.departmentId && selectedFilters.intakeId && selectedFilters.semesterId) {
      fetchPendingRegistrations();
      fetchModuleList();
    }
  }, []);

  const fetchFilterOptions = async () => {
    setLoading(true);
    try {
      // Fetch departments
      const deptResponse = await instance.get('/department/');
      setDepartments(deptResponse.data);
      
      // Fetch intakes
      const intakeResponse = await instance.get('/intake/');
      setIntakes(intakeResponse.data);
      
      // Fetch semesters
      const semesterResponse = await instance.get('/semester/');
      setSemesters(semesterResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching filter options:", error);
      setError("Failed to load filter options. Please refresh the page.");
      setLoading(false);
    }
  };

  const fetchPendingRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get('/module-registration/pending', {
        params: {
          departmentId: selectedFilters.departmentId,
          intakeId: selectedFilters.intakeId,
          semesterId: selectedFilters.semesterId
        }
      });
      
      setPendingRegistrations(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pending registrations:", error);
      setError("Failed to load pending registrations.");
      setLoading(false);
    }
  };

  const fetchModuleList = async () => {
    setLoading(true);
    try {
      const response = await instance.get('/module/semester', {
        params: {
          departmentId: selectedFilters.departmentId,
          intakeId: selectedFilters.intakeId,
          semesterId: selectedFilters.semesterId
        }
      });
      
      setModuleList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching module list:", error);
      setError("Failed to load module list.");
      setLoading(false);
    }
  };

  const fetchModuleRegistrations = async (moduleId) => {
    setLoading(true);
    try {
      const response = await instance.get('/module-registration/pending/module', {
        params: {
          moduleId,
          departmentId: selectedFilters.departmentId,
          intakeId: selectedFilters.intakeId,
          semesterId: selectedFilters.semesterId
        }
      });
      
      setModuleRegistrations(response.data);
      setSelectedModule(moduleId);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching module registrations:", error);
      message.error("Failed to load module registrations.");
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Save to localStorage
    localStorage.setItem(field, value);
  };

  const applyFilters = () => {
    fetchPendingRegistrations();
    fetchModuleList();
    setSelectedModule(null);
    setModuleRegistrations([]);
  };

  const handleApproveRegistration = async (registrationId) => {
    setLoading(true);
    try {
      await instance.put('/module-registration/update', {
        registrationId,
        action: "APPROVE"
      });
      
      message.success("Registration approved successfully");
      
      // Refresh the data
      if (selectedModule) {
        fetchModuleRegistrations(selectedModule);
      } else {
        fetchPendingRegistrations();
      }
    } catch (error) {
      console.error("Error approving registration:", error);
      message.error("Failed to approve registration");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRegistration = async (registrationId) => {
    setLoading(true);
    try {
      await instance.put('/module-registration/update', {
        registrationId,
        action: "REJECT"
      });
      
      message.success("Registration rejected successfully");
      
      // Refresh the data
      if (selectedModule) {
        fetchModuleRegistrations(selectedModule);
      } else {
        fetchPendingRegistrations();
      }
    } catch (error) {
      console.error("Error rejecting registration:", error);
      message.error("Failed to reject registration");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (registration) => {
    setCurrentRegistration(registration);
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    if (!currentRegistration) return;
    
    setLoading(true);
    try {
      await instance.put('/module-registration/update', {
        registrationId: currentRegistration.id,
        action: "EDIT",
        gpaStatus: currentRegistration.gpaStatus,
        status: currentRegistration.status
      });
      
      message.success("Registration updated successfully");
      
      // Refresh the data
      if (selectedModule) {
        fetchModuleRegistrations(selectedModule);
      } else {
        fetchPendingRegistrations();
      }
      
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error updating registration:", error);
      message.error("Failed to update registration");
    } finally {
      setLoading(false);
    }
  };

  // Function to determine module type tag
  const getModuleTypeDisplay = (type) => {
    switch (type) {
      case 'CM': return { text: 'Core Module', color: 'blue' };
      case 'TE': return { text: 'Technical Elective', color: 'green' };
      case 'GE': return { text: 'General Elective', color: 'orange' };
      default: return { text: type || 'Unknown', color: 'default' };
    }
  };

  // Columns for the pending registrations table
  const pendingColumns = [
    {
      title: "Reg No",
      dataIndex: "studentRegNo",
      key: "studentRegNo"
    },
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName"
    },
    {
      title: "Module Code",
      dataIndex: "moduleCode",
      key: "moduleCode"
    },
    {
      title: "Module Name",
      dataIndex: "moduleName",
      key: "moduleName"
    },
    {
      title: "Module Type",
      dataIndex: "moduleType",
      key: "moduleType",
      render: (type) => {
        const display = getModuleTypeDisplay(type);
        return <Tag color={display.color}>{display.text}</Tag>;
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => status === "Taken" ? "✓ Taken" : "✗ Not Taken"
    },
    {
      title: "GPA Status",
      dataIndex: "gpaStatus",
      key: "gpaStatus",
      render: (status) => {
        let text, color;
        switch (status) {
          case 'GPA':
            text = 'GPA';
            color = 'green';
            break;
          case 'NGPA':
            text = 'NGPA';
            color = 'orange';
            break;
          default:
            text = status || 'N/A';
            color = 'default';
        }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button 
            type="primary" 
            size="small" 
            onClick={() => handleApproveRegistration(record.id)}
            loading={loading}
          >
            Approve
          </Button>
          <Button 
            danger 
            size="small" 
            onClick={() => handleRejectRegistration(record.id)}
            loading={loading}
          >
            Reject
          </Button>
          <Button 
            size="small" 
            onClick={() => openEditModal(record)}
            loading={loading}
          >
            Edit
          </Button>
        </div>
      )
    }
  ];

  // Columns for the module selection list
  const moduleColumns = [
    {
      title: "Module Code",
      dataIndex: "moduleCode",
      key: "moduleCode"
    },
    {
      title: "Module Name",
      dataIndex: "moduleName",
      key: "moduleName"
    },
    {
      title: "Module Type",
      dataIndex: "moduleType",
      key: "moduleType",
      render: (type) => {
        const display = getModuleTypeDisplay(type);
        return <Tag color={display.color}>{display.text}</Tag>;
      }
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      render: (credit, record) => record.moduleType === 'GE' ? 'N/A' : credit
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button 
          type="primary" 
          onClick={() => fetchModuleRegistrations(record.id)}
          loading={loading}
        >
          View Registrations
        </Button>
      )
    }
  ];

  return (
    <div>
      <Header />
      <BreadcrumbItem
        breadcrumb={[
          { label: "Home", link: "/departments" },
          { label: "Degree Programs", link: `/departments` },
          { label: "Intakes", link: `/departments/${departmentId}/intakes` },
          {
            label: "Semesters",
            link: `/departments/${departmentId}/intakes/${intakeId}/semesters`,
          },
          {
            label: "Modules",
            link: `/departments/${departmentId}/intakes/semesters/modules`,
          },
          {
            label: "Module Registration",
            link: `/moduleRegistration`,
          },
        ]}
      />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Module Registration Administration</h1>
        
        {error && (
          <Alert 
            message="Error" 
            description={error}
            type="error" 
            showIcon
            className="mb-4"
          />
        )}
        
        <div className="bg-gray-100 p-4 rounded mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <Select
                placeholder="Select Department"
                value={selectedFilters.departmentId || undefined}
                onChange={(value) => handleFilterChange('departmentId', value)}
                className="w-full"
                loading={loading}
              >
                {departments.map(dept => (
                  <Option key={dept.id} value={dept.id.toString()}>
                    {dept.departmentName}
                  </Option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intake</label>
              <Select
                placeholder="Select Intake"
                value={selectedFilters.intakeId || undefined}
                onChange={(value) => handleFilterChange('intakeId', value)}
                className="w-full"
                loading={loading}
              >
                {intakes.map(intake => (
                  <Option key={intake.id} value={intake.id.toString()}>
                    {intake.intakeName}
                  </Option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <Select
                placeholder="Select Semester"
                value={selectedFilters.semesterId || undefined}
                onChange={(value) => handleFilterChange('semesterId', value)}
                className="w-full"
                loading={loading}
              >
                {semesters.map(semester => (
                  <Option key={semester.id} value={semester.id.toString()}>
                    {semester.semesterName}
                  </Option>
                ))}
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                type="primary" 
                onClick={applyFilters}
                loading={loading}
                disabled={!selectedFilters.departmentId || !selectedFilters.intakeId || !selectedFilters.semesterId}
                className="w-full"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultActiveKey="1">
          <TabPane tab="All Pending Registrations" key="1">
            {loading && pendingRegistrations.length === 0 ? (
              <div className="flex justify-center my-8">
                <Spin size="large" tip="Loading pending registrations..." />
              </div>
            ) : (
              <Table
                dataSource={pendingRegistrations}
                columns={pendingColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'No pending registrations found' }}
              />
            )}
          </TabPane>
          
          <TabPane tab="By Module" key="2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium mb-2">Modules</h3>
                {loading && moduleList.length === 0 ? (
                  <div className="flex justify-center my-8">
                    <Spin size="large" tip="Loading modules..." />
                  </div>
                ) : (
                  <Table
                    dataSource={moduleList}
                    columns={moduleColumns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'No modules found' }}
                    rowClassName={(record) => record.id === selectedModule ? 'bg-blue-50' : ''}
                  />
                )}
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-2">Module Registrations</h3>
                {selectedModule ? (
                  loading && moduleRegistrations.length === 0 ? (
                    <div className="flex justify-center my-8">
                      <Spin size="large" tip="Loading registrations..." />
                    </div>
                  ) : (
                    <Table
                      dataSource={moduleRegistrations}
                      columns={pendingColumns}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                      locale={{ emptyText: 'No registrations found for this module' }}
                    />
                  )
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-md p-8 text-center text-gray-500">
                    Select a module to view registrations
                  </div>
                )}
              </div>
            </div>
          </TabPane>
        </Tabs>
        
        {/* Edit Registration Modal */}
        <Modal
          title="Edit Registration"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onOk={handleEditSubmit}
          confirmLoading={loading}
        >
          {currentRegistration && (
            <div className="space-y-4">
              <div>
                <p><strong>Student:</strong> {currentRegistration.studentName}</p>
                <p><strong>Reg No:</strong> {currentRegistration.studentRegNo}</p>
                <p><strong>Module:</strong> {currentRegistration.moduleCode} - {currentRegistration.moduleName}</p>
                <p><strong>Module Type:</strong> {currentRegistration.moduleType}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select
                  value={currentRegistration.status}
                  onChange={(value) => setCurrentRegistration({ ...currentRegistration, status: value })}
                  className="w-full"
                >
                  <Option value="Taken">Taken</Option>
                  <Option value="Not-Taken">Not Taken</Option>
                </Select>
              </div>
              
              {(currentRegistration.moduleType === 'TE' && currentRegistration.status === 'Taken') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GPA Status</label>
                  <Select
                    value={currentRegistration.gpaStatus}
                    onChange={(value) => setCurrentRegistration({ ...currentRegistration, gpaStatus: value })}
                    className="w-full"
                  >
                    <Option value="GPA">GPA</Option>
                    <Option value="NGPA">NGPA</Option>
                  </Select>
                </div>
              )}
              
              <Alert
                message="Note"
                description={
                  <ul className="list-disc pl-5">
                    <li>Core Modules (CM) are always taken as GPA</li>
                    <li>Technical Electives (TE) can be taken as GPA or NGPA</li>
                    <li>General Electives (GE) are always taken as NGPA</li>
                  </ul>
                }
                type="info"
                showIcon
              />
            </div>
          )}
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default ModuleRegistrationPage;