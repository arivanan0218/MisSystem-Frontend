import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Table, Tag, Spin, Alert, message } from "antd";
import instance from "../../axiosConfig";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import BreadcrumbItem from "../../Components/Breadcrumb";

export const ModuleRegistrationForm = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef();
  // Get the user role from localStorage
  const userRole = localStorage.getItem("userRole");
  const semesterId = localStorage.getItem("semesterId");
  const intakeId = localStorage.getItem("intakeId");
  const departmentId = localStorage.getItem("departmentId");
  const today = new Date();
const formattedDate = today.toISOString().slice(0, 10); // "2025-05-22"
  useEffect(() => {
    // First try to get data from localStorage (set by ModuleRegistrationPage)
    const storedData = localStorage.getItem('currentStudentData');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("ModuleRegistrationForm - Using stored data");
        setStudentData(parsedData);
        setLoading(false);
        // Clear the stored data to avoid stale data on refresh
        localStorage.removeItem('currentStudentData');
        return;
      } catch (e) {
        console.error("Error parsing stored student data:", e);
        setError("Error loading stored data. Fetching from server...");
        // Continue to fetch from API
      }
    }
    
    // If no stored data is available or there was an error parsing it, fetch from API
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("ModuleRegistrationForm - Fetching data from API");
      const res = await instance.get(`/module-registration/student`, {
        params: {
          studentId,
          semesterId,
          intakeId,
          departmentId
        }
      });
      
      setStudentData(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching module registrations:", error);
      setError("Failed to load registration data. Please try again later.");
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Module Registration Form",
    onAfterPrint: () => message.success("Print job sent successfully!"),
  });

  const handleDownloadPDF = async () => {
    try {
      message.loading("Generating PDF...");
      
      const element = componentRef.current;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Module_Registration_Form.pdf");
      
      message.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      message.error("Failed to generate PDF. Please try again.");
    }
  };

  // Function to map grade (G/N/-) to display value
  const getGpaStatusDisplay = (grade) => {
    switch (grade) {
      case 'G': return { text: 'GPA', color: 'green' };
      case 'N': return { text: 'NGPA', color: 'orange' };
      case '-': return { text: 'Not Applicable', color: 'gray' };
      default: return { text: grade || 'Unknown', color: 'default' };
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

  // Function to map registration status to display value
  const getRegistrationStatusDisplay = (status) => {
    switch (status) {
      case 'Approved': return { text: 'Approved', color: 'green' };
      case 'Rejected': return { text: 'Rejected', color: 'red' };
      case 'Pending': return { text: 'Pending Approval', color: 'gold' };
      default: return { text: status || 'Unknown', color: 'default' };
    }
  };

   // Function to check if all modules are approved
  const areAllModulesApproved = () => {
    if (!studentData || !studentData.modules) return false;
    return studentData.modules.every(module => module.registrationStatus === "Approved");
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading registration data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert 
          message="Error" 
          description={error}
          type="error" 
          showIcon
          action={
            <Button onClick={fetchStudentData} type="primary">
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  const columns = [
    {
      title: "Module Code",
      dataIndex: "code",
      key: "code"
    },
    {
      title: "Module Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
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
      dataIndex: "grade",
      key: "grade",
      render: (grade) => {
        const display = getGpaStatusDisplay(grade);
        return <Tag color={display.color}>{display.text}</Tag>;
      }
    },
    {
      title: "Registration Status",
      dataIndex: "registrationStatus",
      key: "registrationStatus",
      render: (status) => {
        const display = getRegistrationStatusDisplay(status);
        return <Tag color={display.color}>{display.text}</Tag>;
      }
    }
  ];

  // Only show these columns in the printable version
  const printColumns = [
    {
      title: "Module Code",
      dataIndex: "code",
      key: "code"
    },
    {
      title: "Module Name",
      dataIndex: "name",
      key: "name"
    },
    
    {
      title: "Modules Taken",
      dataIndex: "status",
      key: "status",
      render: (status) => status === "Taken" ? "✓" : "✗"
    },
    {
      title: "GPA Status (G/N)",
      dataIndex: "grade",
      key: "grade"
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
            link: `/registration/${studentId}`,
          },
        ]}
      />
      <div className="p-6">
        <div className="flex justify-end space-x-4 mb-6">
          {userRole === 'ROLE_AR' && (
            <Button
              type="primary"
              onClick={handlePrint}
              className="bg-blue-600"
            >
              Print Form
            </Button>
          )}
          <Button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white"
          >
            Download PDF
          </Button>
          <Button
            onClick={fetchStudentData}
            className="bg-gray-200"
          >
            Refresh Data
          </Button>
        </div>
        {/* Interactive version */}
        {userRole === "ROLE_AR" && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Module Registration Details</h1>
          {studentData && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Student Name</h3>
                  <p className="text-lg font-semibold">{studentData.studentName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Registration No</h3>
                  <p className="text-lg font-semibold">{studentData.studentRegNo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department</h3>
                  <p className="text-lg font-semibold">{studentData.departmentName}</p>
                </div>
              </div>
              <Table
                dataSource={studentData.modules}
                columns={columns}
                rowKey={(record) => record.id || record.moduleId}
                pagination={false}
                className="mb-6"
              />
            </div>
          )}
        </div>
        )}
        {/* Printable version (hidden until print is triggered) */}
        {/* <div className="hidden"> */}
        {(userRole === "ROLE_STUDENT" || userRole === "ROLE_AR") && (
          <div
            ref={componentRef}
            className="bg-white p-8 border border-gray-300 max-w-[800px] mx-auto"
          >
            {studentData && (
              <>
                <h2 className="text-center text-xl font-bold mb-4">
                  Registration for {" "}
                  {localStorage.getItem("semesterName") || "Current"} Modules for End Semester Examination{" "}
                  {studentData.departmentName}
                </h2>
                <div className="mb-4">
                  <p className="mb-1">
                    <strong>Name:</strong> {studentData.studentName}
                  </p>
                  <p className="mb-1">
                    <strong>Registration No:</strong> {studentData.studentRegNo}
                  </p>
                  <p className="mb-1">
                    <strong>Department:</strong> {studentData.departmentName}
                  </p>
                </div>
                <table className="w-full border-collapse border border-gray-400 mt-4">
                  <thead>
                    <tr className="bg-gray-200">
                      {printColumns.map((column) => (
                        <th key={column.key} className="border border-gray-400 p-2 text-left">
                          {column.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.modules.map((module) => (
                      <tr key={module.id || module.moduleId}>
                        <td className="border border-gray-400 p-2">
                          {module.code || module.moduleCode}
                        </td>
                        <td className="border border-gray-400 p-2">
                          {module.name || module.moduleName}
                        </td>
                        <td className="border border-gray-400 p-2 text-center">
                          {module.status === "Taken" ? "✓" : "✗"}
                        </td>
                        <td className="border border-gray-400 p-2 text-center">
                          {module.grade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-6 space-y-4">
                  <p>
                    <strong>Signature of the Student:</strong>__{studentData.studentName}__<strong>Date:</strong>__{formattedDate}__
                  </p>
                  <p>
                    <strong>Recommendation of the Advisor:</strong> ____________________
                  </p>
                  <p>
                    <strong>Signature of the Advisor:</strong> ____________________ <strong>Date:</strong> ____________________
                  </p>
                  <p>
                    <strong>AR Approval:</strong> {areAllModulesApproved() ? "________Approved________" : "____________________"} <strong>Date:</strong> {areAllModulesApproved() ? `__${formattedDate}__` : "____________________"}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
        {/* </div> */}
      </div>
      <Footer />
    </div>
  );
};

export default ModuleRegistrationForm;