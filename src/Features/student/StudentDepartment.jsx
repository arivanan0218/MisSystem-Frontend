import { useState, useEffect } from 'react';
import Footer from '../../Components/Footer';
import { Link } from 'react-router-dom';
import Header from '../../Components/Header';
import Breadcrumb from '../../Components/Breadcrumb';
import axios from '../../axiosConfig';

const StudentDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          console.error('No token found. Redirecting to login.');
          window.location.href = '/login';
          return;
        }

        const response = await axios.get('/department/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setDepartments(response.data);
        } else {
          throw new Error('Failed to fetch departments');
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Could not fetch departments. Please try again later.');
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div>
      <Header />
      <Breadcrumb
        breadcrumb={[
          { label: 'Home', link: '/departments' },
          { label: 'Student Departments', link: '/studentdepartments' },
        ]}
      />
      <div className="mr-[20%] ml-[10%] px-8 font-poppins">
        <div className="py-8 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
          />
        </div>

        <div className="mt-[80px]">
          {error && <div className="text-center text-red-500 mb-4">{error}</div>}
          {departments.length > 0 ? (
            departments.map((department) => (
              <div key={department.id} className="bg-white flex justify-between items-center">
                <Link
                  to={`/studentdepartments/${department.id}/sintakes`}
                  className="flex-1"
                  onClick={() => localStorage.setItem('departmentId', department.id)}
                >
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    {department.departmentName}
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No departments available.</div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StudentDepartments;
