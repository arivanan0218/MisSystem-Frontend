import React, {useState, useRef } from 'react';
import { Card, Table, Typography, Button, message, Checkbox } from 'antd';
import { MinusCircleFilled, PlusCircleFilled } from '@ant-design/icons';
import Header from "../../Components/Header";
import Breadcrumb from "../../Components/Breadcrumb";
import Footer from "../../Components/Footer";

const { Title } = Typography;

export const MRPforStudent = () => {
const studentId = localStorage.getItem("selectedStudentId");
// Initial data state
  const [data, setData] = useState([
    { key: 1, code: 'EE 4133', name: 'Module 1', gpa: 'N' },
    { key: 2, code: 'EE 4133', name: 'Module 2', gpa: 'G' },
    { key: 3, code: 'EE 4133', name: 'Module 3', gpa: 'N' },
    { key: 4, code: 'EE 4140', name: 'Module 4', gpa: 'G' },
  ]);
  const [data2, setData2] = useState([
    { key: 1, code: 'EE 4312', name: 'Module 5', gpa: false, ngpa: false },
    { key: 2, code: 'EE 4302', name: 'Module 6', gpa: false, ngpa: false },
    { key: 3, code: 'EE 4164', name: 'Module 7', gpa: false, ngpa: false },
    { key: 4, code: 'EE 4421', name: 'Module 8', gpa: false, ngpa: false },
    { key: 5, code: 'EE 4162', name: 'Module 9', gpa: false, ngpa: false },
  ]);

 // Function to handle record deletion
  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.success('Module removed successfully!');
  };
// Toggle GPA / NGPA checkboxes for eligible modules
  const handleCheckboxChange = (key, type) => {
    setData2(prev =>
      prev.map(item => {
        if (item.key === key) {
          if (type === 'gpa') {
            return { ...item, gpa: !item.gpa, ngpa: item.gpa ? false : item.ngpa };
          } else {
            return { ...item, ngpa: !item.ngpa, gpa: item.ngpa ? false : item.gpa };
          }
        }
        return item;
      })
    );
  };

 // Add a module from eligible modules to selected modules
  const handleAdd = (key) => {
    const moduleToAdd = data2.find(item => item.key === key);
    if (moduleToAdd) {
      // Determine GPA status: 'G' if gpa true, 'N' if ngpa true, else 'N'
      const gpaStatus = moduleToAdd.gpa ? 'G' : moduleToAdd.ngpa ? 'N' : 'N';

      // Check if already added to avoid duplicates (optional)
      const alreadyAdded = data.some(item => item.code === moduleToAdd.code && item.name === moduleToAdd.name);
      if (alreadyAdded) {
        message.warning('Module already selected!');
        return;
      }

      setData([...data, { key: Date.now(), code: moduleToAdd.code, name: moduleToAdd.name, gpa: gpaStatus }]);
      message.success(`${moduleToAdd.name} added to selected modules!`);
    }
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
      <Button
        type="text"  // Use text type to have a flat button style
        icon={<MinusCircleFilled style={{ color: '#172554', fontSize: '20px' }} />}  // Blue color
        onClick={() => handleDelete(record.key)}
      />
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
      { label: 'Home', link: '' },
      { label: 'Dashboard', link: '' },
      { label: 'Department of Computer Engineering', link: '' },
      { label: 'E 2017 Batch (19th Intake)', link: '' },
      { label: 'Semester 4', link: '' },
      { label: 'Modules', link: '' },
      { label: 'Module Registration', link: '' }
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
        <button
          className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900 ml-4"
          onClick={() => window.location.href = `/registration/${studentId}`}
        >
          Download
        </button>
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
      </div>
      
    </div>
    <Footer />
  </div>
 );
};

export default MRPforStudent;