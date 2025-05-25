import { useState, useEffect, useRef  } from "react";
import { Table, Button, Select, Tag, message, Spin, Alert, Modal, Input, Tabs, Breadcrumb } from "antd";
import instance from "../../axiosConfig";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import BreadcrumbItem from "../../Components/Breadcrumb";
import { UpOutlined } from "@ant-design/icons";

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
  const [approvedData, setApprovedData] = useState([]);
  const [showApproved, setShowApproved] = useState(false);
  const registrationTableRef = useRef(null);
  const approvedTableRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);



  useEffect(() => {
    // Load filter options
    fetchFilterOptions();
    
    // If all filters are set, load pending registrations
    if (selectedFilters.departmentId && selectedFilters.intakeId && selectedFilters.semesterId) {
      fetchPendingRegistrations();
      fetchModuleList();
    }

    // Scroll event listener for scroll-to-top button
  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300);
  };

  window.addEventListener("scroll", handleScroll);

  // Cleanup function
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };

  }, []);

  const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};


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

      // Scroll to table
      setTimeout(() => {
        registrationTableRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);                
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

  const fetchApprovedRegistrations = async (moduleId) => {
    setLoading(true);
    try {
      const response = await instance.get(`/module-registration/module/${moduleId}`);
      setApprovedData(response.data.filter(item => item.registrationStatus === "Approved"));
      setShowApproved(true);
      setSelectedModule(moduleId);
      // Scroll to table
      setTimeout(() => {
        approvedTableRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error("Error fetching approved registrations:", error);
      message.error("Failed to load approved registrations.");
    } finally {
      setLoading(false);
    }
  };

  // Columns for the pending registrations table
  // Columns for the pending registrations table (only for pending, not for approved)
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

  // Columns for the approved registrations table (no actions)
  const approvedColumns = [
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
    <div className="flex space-x-2">
      <Button
        type="primary"
        size="small"
        onClick={() => fetchModuleRegistrations(record.id)}
        loading={loading}
      >
        Pending
      </Button>
      <Button
        size="small"
        onClick={() => fetchApprovedRegistrations(record.id)}
        loading={loading}
      >
        Approved
      </Button>
    </div>
  )
}

  ];

  return (
  <div>
    <Header />
    <div className="p-4">
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
      <h2 className="text-xl font-semibold mb-4">Module Registration Approval</h2>

      

      {error && (
        <Alert message={error} type="error" showIcon className="mb-4" />
      )}

      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Pending Registrations" key="1">
            <Table
              dataSource={pendingRegistrations}
              columns={pendingColumns}
              rowKey="id"
              pagination={{ pageSize: 8 }}
            />
          </TabPane>
          <TabPane tab="Module Wise View" key="2">
            <Table
              dataSource={moduleList}
              columns={moduleColumns}
              rowKey="id"
              pagination={{ pageSize: 8 }}
            />
            {selectedModule && (
              <>
                <div ref={registrationTableRef}>
                  <h3 className="mt-6 mb-2 text-lg font-medium">
                    Pending Registrations for &nbsp;
                      {
                        (moduleList.find(m => m.id === selectedModule)?.moduleName || "")
                      }
                      {" "}
                      - (
                      {
                        (moduleList.find(m => m.id === selectedModule)?.moduleCode || "")
                      }
                      )
                  </h3>
                  <Table
                    dataSource={moduleRegistrations}
                    columns={pendingColumns}
                    rowKey="id"
                    pagination={{ pageSize: 8 }}
                  />
                </div>

                {showApproved && (
                  <div ref={approvedTableRef} className="mt-6">
                    <h3 className="mb-2 text-lg font-medium">
                      Approved Registrations for&nbsp;
                      {
                        (moduleList.find(m => m.id === selectedModule)?.moduleName || "")
                      }
                      {" "}
                      - (
                      {
                        (moduleList.find(m => m.id === selectedModule)?.moduleCode || "")
                      }
                      )
                    </h3>
                    <Table
                      dataSource={approvedData}
                      columns={approvedColumns}
                      rowKey="id"
                      pagination={{ pageSize: 8 }}
                      loading={loading}
                    />
                  </div>
                )}
              </>
            )}

          </TabPane>
        </Tabs>
      </Spin>
    </div>

    <Modal
      title="Edit Registration"
      visible={editModalVisible}
      onOk={handleEditSubmit}
      onCancel={() => setEditModalVisible(false)}
    >
      {currentRegistration && (
        <>
          <div className="mb-3">
            <label>Status:</label>
            <Select
              value={currentRegistration.status}
              onChange={(value) =>
                setCurrentRegistration({ ...currentRegistration, status: value })
              }
              style={{ width: "100%" }}
            >
              <Option value="Taken">Taken</Option>
              <Option value="Not Taken">Not Taken</Option>
            </Select>
          </div>
          <div className="mb-3">
            <label>GPA Status:</label>
            <Select
              value={currentRegistration.gpaStatus}
              onChange={(value) =>
                setCurrentRegistration({
                  ...currentRegistration,
                  gpaStatus: value,
                })
              }
              style={{ width: "100%" }}
            >
              <Option value="GPA">GPA</Option>
              <Option value="NGPA">NGPA</Option>
            </Select>
          </div>
        </>
      )}
    </Modal>

    <Footer />
    {showScrollTop && (
  <button
    onClick={scrollToTop}
    className="fixed bottom-6 right-6 z-50 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
  >
    <UpOutlined style={{ fontSize: "20px" }} />
  </button>
)}

  </div>
);
}
export default ModuleRegistrationPage;