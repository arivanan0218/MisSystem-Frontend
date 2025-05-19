import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../../Components/Header";
import Breadcrumb from "../../Components/Breadcrumb";
import Footer from "../../Components/Footer";
import ModuleCreation from "../ModuleManagement/ModuleCreation";
import axios from "../../axiosConfig";
import edit from "../../assets/img/edit.svg";
import deleteIcon from "../../assets/img/delete.svg";

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
    const fetchModules = async () => {
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

        // The backend endpoint expects a path variable that's not actually used, but is required by the URL pattern
        // We'll use a placeholder value for the path variable and pass the actual values as query parameters
        const pathVariable = "query"; // This is just a placeholder, the actual values are passed as query params
        
        // Construct the endpoint URL to match exactly what the backend expects
        const endpoint = `module/semester/${pathVariable}?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}`;
        console.log("Calling API endpoint:", endpoint);
        
        const response = await axios.get(
          endpoint,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(`Failed to fetch modules: ${response.statusText}`);
        }

        const data = response.data;
        console.log("Fetched modules:", data);

        if (Array.isArray(data)) {
          setModules(data); // Set the modules directly
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

    fetchModules();
  }, [departmentId, intakeId, semesterId, token]);

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
        ]}
      />
      <div className="flex-grow px-4 sm:px-6 lg:px-20 font-poppins">
        <div className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
          />
          {userRole === "ROLE_AR" && (
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-4">
  <button
    onClick={openForm}
    className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full px-4 py-2 w-full sm:w-auto"
    aria-label="Add Module"
  >
    Add Module +
  </button>

  <button
    onClick={() => navigate("/moduleRegistration")}
    className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full px-4 py-2 w-full sm:w-auto"
    aria-label="Register Module"
  >
    Register your module
  </button>

  <Link to={"/semesterResults"} className="w-full sm:w-auto">
    <button
      className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full px-4 py-2 w-full sm:w-auto"
    >
      View semester Results
    </button>
  </Link>

 
  <Link to={"/semesterResults"}>
                <button className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900 ml-4">
                  View semester Results
                </button>
              </Link>
              
              {formOpen && (
                <ModuleCreation closeForm={closeForm} addModule={addModule} />
              )}
            </div>

          )}
        </div>

        <div className="mt-[80px]">
          {error && (
            <div className="text-center p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {modules.length > 0 ? (
            modules.map((module) => (
              <div
                key={module.id}
                className="bg-white flex justify-between items-center"
              >
                <Link
                  to={`/departments/${module.id}/intakes/semesters/modules/assignments`}
                  className="flex-1"
                  onClick={() => localStorage.setItem("moduleId", module.id)}
                >
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    <div className="flex flex-col">
                      <span>{module.moduleName} ({module.moduleCode})</span>
                      <div className="flex text-sm font-normal mt-1">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md mr-2">
                          {getModuleTypeLabel(module.moduleType)}
                        </span>
                        <span className={`px-2 py-1 rounded-md ${module.gpaStatus === 'G' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {getGpaStatusLabel(module.gpaStatus)}
                        </span>
                        {(module.moduleType === 'CM' || module.moduleType === 'TE') && module.credit && (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md ml-2">
                            {module.credit} Credits
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                {userRole === "ROLE_AR" && (
                  <div className="flex space-x-2">
                    <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] min-w-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
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