import React, {useState, useRef, useEffect } from 'react';
import { Card, Table, Typography, Button, message, Checkbox, Modal } from 'antd';
import { MinusCircleFilled, PlusCircleFilled } from '@ant-design/icons';
import Header from "../../Components/Header";
import Breadcrumb from "../../Components/Breadcrumb";
import Footer from "../../Components/Footer";
import axios from 'axios';
import instance from "../../axiosConfig";

const { Title } = Typography;

export const MRPforStudent = () => {
// const studentId = localStorage.getItem("studentId");
const studentId = 1;
const departmentId = localStorage.getItem('departmentId');
const intakeId = localStorage.getItem('intakeId');
const semesterId = localStorage.getItem('semesterId');
const [data, setData] = useState([]);     // Selected Modules
const [data2, setData2] = useState([]);   // Eligible Modules
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchInitialData();
}, [departmentId, intakeId, semesterId]);

const fetchInitialData = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth-token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const moduleResponse = await instance.get(`/module/semester/{departmentAndIntakeAndSemesterId}`, {
      params: { departmentId, intakeId, semesterId },
      headers
    });

    const modules = Array.isArray(moduleResponse.data) ? moduleResponse.data : [];

    const selectedCMModules = modules
      .filter(m => m.moduleType === 'CM')
      .map((m, i) => ({
        key: m.id, // use the actual moduleId
        moduleId: m.id,
        code: m.moduleCode,
        name: m.moduleName,
        gpa: 'GPA',
        moduleType: 'CM',
      }));

    const eligibleModules = modules
      .filter(m => m.moduleType !== 'CM') // Only GE and TE
      .map((m, i) => ({
        key: m.id, // use the actual moduleId
        moduleId: m.id,
        code: m.moduleCode,
        name: m.moduleName,
        gpa: false,        // for checkbox
        ngpa: m.moduleType === 'GE' ? true : false, // GE defaults to NGPA
        moduleType: m.moduleType,
      }));

    setData(selectedCMModules);  // Selected modules
    setData2(eligibleModules);   // Eligible modules
    console.log('Selected Modules:', selectedCMModules);
    console.log('Eligible Modules:', eligibleModules);

  } catch (error) {
    console.error('Error fetching modules:', error);
    message.error('Failed to load modules.');
  } finally {
    setLoading(false);
  }
};
 // Function to handle record deletion
  const handleDelete = (key) => {
  const moduleToRemove = data.find((item) => item.key === key);
  if (moduleToRemove) {
    setData(prev => prev.filter((item) => item.key !== key));

    if (moduleToRemove.moduleType !== 'CM') {
      // Re-add to eligible modules
      setData2(prev => [
        ...prev,
        {
          key: moduleToRemove.moduleId,
          moduleId: moduleToRemove.moduleId, 
          code: moduleToRemove.code,
          name: moduleToRemove.name,
          gpa: moduleToRemove.gpa === 'GPA',
          ngpa: moduleToRemove.gpa === 'NGPA',
          moduleType: moduleToRemove.moduleType
        }
      ]);
    }

    message.success('Module removed successfully!');
  }
};

 // Toggle GPA / NGPA checkboxes for eligible modules
  const handleCheckboxChange = (key, type) => {
  setData2(prev =>
    prev.map(item => {
      if (item.key === key) {
        const updatedItem = { ...item };
        if (type === 'gpa') {
          updatedItem.gpa = !item.gpa;
          updatedItem.ngpa = false;
        } else if (type === 'ngpa') {
          updatedItem.ngpa = !item.ngpa;
          updatedItem.gpa = false;
        }
        return updatedItem;
      }
      return item;
    })
  );
};

 // Add a module from eligible modules to selected modules
 const handleAdd = (key) => {
  const moduleToAdd = data2.find(item => item.key === key);
  if (moduleToAdd) {
    let gpaStatus = 'NGPA';
    if (moduleToAdd.moduleType === 'TE') {
      gpaStatus = moduleToAdd.gpa ? 'GPA' : moduleToAdd.ngpa ? 'NGPA' : 'NGPA';
    } else if (moduleToAdd.moduleType === 'GE') {
      gpaStatus = 'NGPA';
    }

    const alreadyAdded = data.some(item => item.code === moduleToAdd.code && item.name === moduleToAdd.name);
    if (alreadyAdded) {
      message.warning('Module already selected!');
      return;
    }

    // Add to selected modules (with moduleId!)
    setData(prev => [
      ...prev,
      {
        key: moduleToAdd.moduleId,
        moduleId: moduleToAdd.moduleId, 
        code: moduleToAdd.code,
        name: moduleToAdd.name,
        gpa: gpaStatus,
        moduleType: moduleToAdd.moduleType
      }
    ]);

    // Remove from eligible modules
    setData2(prev => prev.filter(item => item.key !== key));

    message.success(`${moduleToAdd.name} added to selected modules!`);
  }
};

const showConfirmationBeforeSubmit = () => {
  Modal.confirm({
    title: 'Are you sure you want to submit?',
    content: 'Once submitted, changes will be saved. You CAN NOT modify them later.',
    okText: 'Yes, Submit',
    cancelText: 'Cancel',
    onOk: handleSave,
  });
};

const handleSave = async () => {
  // Prepare takenModules array
  const takenModules = data.map((item) => ({
    moduleId: Number(item.moduleId),
    gpaStatus: item.gpa === "GPA" ? "G" : item.gpa === "NGPA" ? "N" : item.gpa,
    moduleType: item.moduleType
  }));

  // Prepare the full payload
  const payload = {
    studentId: Number(studentId),
    semesterId: Number(semesterId),
    intakeId: Number(intakeId),
    departmentId: Number(departmentId),
    takenModules
  };

  try {
    // Prepare authorization header
    const token = localStorage.getItem('token') || localStorage.getItem('auth-token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Make the POST request
    console.log('Payload:', payload);
    console.log('Headers:', headers);

    const response = await instance.post('/module-registration', payload, { headers });

    // Handle response
    if (response.status === 200 || response.status === 201) {
      message.success('Modules saved successfully!');
      
      // Store submission time for signature
      localStorage.setItem('submissionTime', new Date().toISOString());
      
      // Call navigate function after successful save
      handleNavigate();
    } else {
      message.error(`Failed to save modules. Status code: ${response.status}`);
    }
  } catch (err) {
    // Error logging
    if (err.response) {
      console.error('Server responded with error:', err.response.data);
      message.error(`Error: ${err.response.data.message || 'Failed to save modules.'}`);
    } else {
      console.error('Request error:', err.message);
      message.error('Network or server error occurred.');
    }
  }
};

const handleNavigate = () => {
  window.location.href = `/registration/${studentId}`;
};




 // Columns for selected modules table
  const columns = [
  {
    title: 'Module Code',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Module Name',
    dataIndex: 'name',
    key: 'name',
    responsive: ['md'],
  },
  {
    title: 'GPA Status G/N',
    dataIndex: 'gpa',
    key: 'gpa',
    align: 'center',
  },
  {
    title: 'Action',
    key: 'action',
    align: 'center',
    render: (_, record) => (
      record.moduleType !== 'CM' ? (
        <Button
          type="text"
          icon={<MinusCircleFilled style={{ color: '#172554', fontSize: '20px' }} />}
          onClick={() => handleDelete(record.key)}
        />
      ) : null
    ),

  },
];
 // Columns for eligible modules table
  const columns2 = [
    {
      title: 'Module Code',
      dataIndex: 'code',
      key: 'code',
      align: 'left',
    },
    {
      title: 'Module Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      responsive: ['md'],
    },
    {
      title: 'GPA',
      dataIndex: 'gpa',
      key: 'gpa',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={record.gpa}
          disabled={record.moduleType === 'GE'}
          onChange={() => handleCheckboxChange(record.key, 'gpa')}
        />
      ),
    },
    {
      title: 'NGPA',
      dataIndex: 'ngpa',
      key: 'ngpa',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={record.ngpa}
          disabled={record.moduleType === 'GE'}
          onChange={() => handleCheckboxChange(record.key, 'ngpa')}
        />
      ),
    },

    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          icon={<PlusCircleFilled style={{ color: '#172554', fontSize: '20px' }} />}
          onClick={() => handleAdd(record.key)}
        />
      ),
    },
];
  
  return (
  <div>
    <Header />
    <Breadcrumb
        breadcrumb={[
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
            link: `/ModuleRegistrationFormViewForStudent`,
          },
        ]}
      />
    <div className="mx-4 mr-[20%] ml-[10%] px-8 font-poppins">
      <div className="py-8 flex items-center justify-between">
        <input
        type="text"
        placeholder="Search"
        className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
        />
      </div>
      <div>
        <div className="flex justify-between items-center w-full">
        <span className="text-blue-950 text-xl font-medium font-['Poppins']">
          Module Selection
        </span>
        
        </div>
      </div>
      <div className="w-full h-0.1 bg-[#d9d9d9] outline outline-1 outline-offset-[-0.5px] outline-blue-950 mt-4 mb-4"></div>
        <div className="text-blue-950 text-xl font-medium font-['Poppins'] mb-4">
          Selected&nbsp;Modules        
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          size="middle"
          rowClassName={() => 'text-blue-950'}
        />
      <div>  
        <div className="text-blue-950 text-xl font-medium font-['Poppins'] mb-4 mt-4">
          Eligible&nbsp;Modules      
        </div>
        <div className="mt-4">
          <Table
            columns={columns2}
            dataSource={data2}
            pagination={false}
            bordered
            size="middle"
            rowClassName={() => 'text-blue-950'}
            scroll={{ x: '100%' }}
          />
        </div>
        <div className="flex flex-col md:flex-row md:justify-end justify-center items-center mt-4">
          <button
                onClick={handleNavigate}
                className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-64 px-4 py-2 my-2"
                aria-label="Add Degree Program"
              >
                Module Registration Form
          </button>
          <button
            className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900 ml-4"
            style={{ minWidth: 180 }}
            onClick={showConfirmationBeforeSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      
    </div>
    <Footer />
  </div>
 );
};

export default MRPforStudent;