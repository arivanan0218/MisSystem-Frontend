import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../../Components/Header";
import Breadcrumb from "../../Components/Breadcrumb";
import Footer from "../../Components/Footer";
import ModuleCreation from "./Component/ModuleCreation";
import axios from "../../axiosConfig";
import edit from "../../assets/img/edit.svg";
import deleteIcon from "../../assets/img/delete.svg";
import { use } from "react";

const Modules = () => {
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);

  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  // Get the user role from localStorage
  const userRole = localStorage.getItem("userRole");

  // Get IDs from localStorage
  const token = localStorage.getItem("auth-token");
  const semesterId = localStorage.getItem("semesterId");
  const departmentId = localStorage.getItem("departmentId");
  const intakeId = localStorage.getItem("intakeId");  
  const studentId = localStorage.getItem("studentId");

  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  const addModule = (newModule) => {
    setModules((prevModules) => {
      // If editing an existing module, replace it
      if (editingModule && editingModule.id === newModule.id) {
        return prevModules.map(module => 
          module.id === newModule.id ? newModule : module
        );
      }
      // Otherwise add new module
      return Array.isArray(prevModules)
        ? [...prevModules, newModule]
        : [newModule];
    });
  };

  const openEditForm = (module) => {
    setEditingModule(module);
    setEditFormOpen(true);
  };
  
  const closeEditForm = () => {
    setEditingModule(null);
    setEditFormOpen(false);
  };

  const handleDelete = async (moduleId) => {
    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this module?")) {
      return;
    }
    
    try {
      if (!token) {
        setError("Authentication required. Please log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      const response = await axios.delete(`module/${moduleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setModules((prevModules) =>
          prevModules.filter((module) => module.id !== moduleId)
        );
      } else {
        throw new Error("Failed to delete module");
      }
    } catch (err) {
      console.error("Error deleting module:", err);
      setError(err.response?.data?.message || "Could not delete module. Please try again later.");
    }
  };
  useEffect(() => {
    const fetchModulesForAR = async () => {
      try {
        if (!departmentId || !intakeId || !semesterId) {
          setError("Required data missing from localStorage.");
          return;
        }

        if (!token) {
          setError("Authentication required. Please log in again.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
          return;
        }

        const endpoint = `/module/semester?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}`;
        console.log("Calling API endpoint:", endpoint);

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error(`Failed to fetch modules: ${response.statusText}`);
        }

        const data = response.data;
        console.log("Fetched modules:", data);

        if (Array.isArray(data)) {
          setModules(data);
        } else {
          throw new Error("Invalid data structure from API");
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setError("Authentication failed. Please log in again.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          setError(error.response?.data?.message || "Could not fetch modules. Please try again later.");
        }
      }
    };

    const fetchModulesForStudent = async () => {
  try {
    if (!departmentId || !intakeId || !semesterId || !studentId) {
      setError("Required data missing from localStorage.");
      return;
    }

    if (!token) {
      setError("Authentication required. Please log in again.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    // STEP 1: Fetch registered module IDs for the student
    const registeredEndpoint = `module-registration/student?studentId=${studentId}&semesterId=${semesterId}&intakeId=${intakeId}&departmentId=${departmentId}`;
    console.log("Fetching registered module IDs from:", registeredEndpoint);

    const registeredResponse = await axios.get(registeredEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (registeredResponse.status !== 200) {
      throw new Error("Failed to fetch registered module IDs.");
    }

    const registeredData = registeredResponse.data;

    const registeredModuleIds = registeredData.modules
      .filter(mod => mod.registrationStatus === 'Approved')
      .map(mod => mod.id);
    // console.log("Registered Module IDs:", registeredModuleIds);
    // console.log("registeredData :", registeredData);
    // STEP 2: Fetch all available modules for the semester
    // const pathVariable = "query";
      const modulesEndpoint = `module/semester?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}`;
            console.log("Fetching all semester modules from:", modulesEndpoint);

    const modulesResponse = await axios.get(modulesEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (modulesResponse.status !== 200) {
      throw new Error("Failed to fetch semester modules.");
    }

    const allModules = modulesResponse.data;
    console.log("All Semester Modules:", allModules);

    // STEP 3: Filter semester modules by registered module IDs
    const filteredModules = allModules.filter(module =>
      registeredModuleIds.includes(module.id.toString())
    );

    console.log("Filtered Modules for Student:", filteredModules);
    setModules(filteredModules);

  } catch (error) {
    console.error("Error in fetchModulesForStudent:", error);
    setError(
      error.response?.data?.message || "Could not fetch modules. Please try again later."
    );
  }
};


    if (userRole === "ROLE_AR" || userRole === "ROLE_LECTURER") {
      fetchModulesForAR();
    } else if (userRole === "ROLE_STUDENT") {
      fetchModulesForStudent();
    }
  }, [userRole, departmentId, intakeId, semesterId, studentId, token]);

  // Helper function to get module type label
  const getModuleTypeLabel = (type) => {
    switch (type) {
      case 'CM': return 'Core Module';
      case 'TE': return 'Technical Elective';
      case 'GE': return 'General Elective';
      default: return type;
    }
  };

  // Helper function to get GPA status label
  const getGpaStatusLabel = (status) => {
    switch (status) {
      case 'G': return 'GPA';
      case 'N': return 'Non-GPA';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
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
        ]}
      />
      <div className="flex-grow px-4 sm:px-6 lg:px-20 font-poppins justify-center lg:mr-[4%] lg:ml-[2%] 2xl:mr-[10%] 2xl:ml-[5%]">
        <div className="py-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-[405px] h-[41px] px-3 cursor-pointer text-md"
          />
          {userRole === "ROLE_AR" && (
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4  ">
              <button
                onClick={openForm}
                className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full px-4 py-2 w-full sm:w-auto"
                aria-label="Add Module"
              >
               + Module
              </button>

              <button
                onClick={() => navigate("/moduleRegistration")}
                className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full px-4 py-2 w-full sm:w-auto"
                aria-label="Register Module"
              >
                Module Registration
              </button>
            
              <Link to={"/semesterResults"}>
                <button className="bg-blue-950 text-white px-4 py-2 mt-1 rounded-lg font-medium hover:bg-blue-900">
                  Semester Results
                </button>
              </Link>
              
              {formOpen && (
                <ModuleCreation closeForm={closeForm} addModule={addModule} />
              )}
            </div>

          )}
        </div>
        {userRole === "ROLE_STUDENT" && (
          <div className="flex justify-between items-center mb-4"> 
           <Link to={"/ModuleRegistrationFormViewForStudent"}>
              <button className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900 ml-4">
                Module Registration
              </button>
            </Link>
            
          </div>
        )}

        <div className="md:mt-[80px]">
          {error && (
            <div className="text-center p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {modules.length > 0 ? (
            modules.map((module) => (
              <div
                key={module.id}
                className="bg-white flex md:w-full justify-between items-center gap-2"
              >
          <Link
            to={
              userRole === "ROLE_AR"
                ? `/departments/${module.id}/intakes/semesters/modules/assignments`
                : userRole === "ROLE_STUDENT"
                ? `/moduleMarks`
                : userRole === "ROLE_LECTURER"
                ? `/departments/${module.id}/intakes/semesters/modules/assignments`
                : "#"
            }
            className="flex-1"
            onClick={() => localStorage.setItem("moduleId", module.id)}
          >
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    <div className="flex flex-col">
                      <div>
                        <span className="sm:w-auto w-0 flex-1 sm:truncate truncate whitespace-nowrap overflow-hidden text-ellipsis">
                          {module.moduleName}
                        </span>
                        <span>
                          ({module.moduleCode})
                        </span>
                      </div>

                      <div className="flex text-sm font-normal mt-1">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md mr-2">
                          {getModuleTypeLabel(module.moduleType)}
                        </span>
                        <span className={`px-2 py-1 rounded-md ${module.gpaStatus === 'G' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} sm:w-auto w-0 flex-1 sm:truncate truncate whitespace-nowrap overflow-hidden text-ellipsis`}>
                          {getGpaStatusLabel(module.gpaStatus)}
                        </span>
                        {(module.moduleType === 'CM' || module.moduleType === 'TE') && module.credit && (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md ml-2 truncate sm:truncate-none">
                            {module.credit} Credits
                          </span>
                        )}
                      </div>
                    </div>
                   
                  </div>
                </Link>
               
                {userRole === "ROLE_AR" && (
                  <div className="flex space-x-2">
                    <div className="bg-white text-blue-950 border-blue-950 min-h-[77px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                      <button
                        onClick={() => openEditForm(module)}
                        className="text-yellow-500 hover:text-yellow-700"
                        aria-label="Edit Module"
                      >
                        <img src={edit} alt="edit" />
                      </button>
                    </div>

                    <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                      <button
                        onClick={() => handleDelete(module.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete module"
                      >
                        <img src={deleteIcon} alt="delete" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No Modules available.
            </div>
          )}
        </div>
      </div>

      {editFormOpen && (
        <ModuleCreation 
          closeForm={closeEditForm} 
          addModule={addModule} 
          isEditing={true} 
          currentModule={editingModule} 
        />
      )}

      <Footer />
    </div>
  );
};

export default Modules;
