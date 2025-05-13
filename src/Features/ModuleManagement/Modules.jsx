import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../../Components/Header";
import Breadcrumb from "../../Components/Breadcrumb";
import Footer from "../../Components/Footer";
import ModuleCreation from "../ModuleManagement/ModuleCreation";
import axios from "../../axiosConfig"; // Import axios for HTTP requests
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
  const intakeId = localStorage.getItem("intakeId"); // Get intakeId from localStorage


  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);



  const addModule = (newModule) => {
    setModules((prevModules) => {
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
    try {
      const token = localStorage.getItem("auth-token"); // Retrieve auth-token
      if (!token) {
        console.error("No token found. Redirecting to login.");
        window.location.href = "/login";
        return;
      }

      const response = await axios.delete(`/module/${moduleId}`, {
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
      setError("Could not delete module. Please try again later.");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const { moduleName, moduleCode, credit, GPA_Status, moduleCoordinator } =
      editingModule;

    if (
      moduleName.trim() &&
      moduleCode.trim() &&
      String(credit).trim() &&
      GPA_Status &&
      moduleCoordinator.trim()
    ) {
      try {
        const token = localStorage.getItem("auth-token"); // Retrieve auth-token
        if (!token) {
          console.error("No token found. Redirecting to login.");
          window.location.href = "/login";
          return;
        }

        const response = await axios.put(
          `/module/${editingModule.id}`,
          {
            moduleName,
            moduleCode,
            credit,
            GPA_Status,
            moduleCoordinator,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedModule = response.data;

        setModules((prevModules) =>
          prevModules.map((module) =>
            module.id === updatedModule.id ? updatedModule : module
          )
        );

        closeEditForm();
      } catch (error) {
        console.error("Error updating module:", error);
        setError("Failed to update module. Please try again.");
      }
    } else {
      setError("Please fill out all fields.");
    }
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        if (!departmentId || !intakeId || !semesterId) {
          setError("Required data missing from localStorage.");
          return;
        }

        // The backend endpoint expects a path variable that's not actually used, but is required by the URL pattern
        // We'll use a placeholder value for the path variable and pass the actual values as query parameters
        const pathVariable = "query"; // This is just a placeholder, the actual values are passed as query params
        
        // Construct the endpoint URL to match exactly what the backend expects
        const endpoint = `/module/semester/${pathVariable}?departmentId=${departmentId}&intakeId=${intakeId}&semesterId=${semesterId}`;
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
        console.log("Fetched modules:", data); // Log fetched data for debugging

        if (Array.isArray(data)) {
          setModules(data); // Set the modules directly
        } else {
          throw new Error("Invalid data structure from API");
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
        setError("Could not fetch modules. Please try again later.");
      }
    };

    fetchModules();
  }, [departmentId, intakeId, semesterId, token]);

  return (
    <div>
      <Header />
      <Breadcrumb
        breadcrumb={[
          { label: "Home", link: "/departments" },
          { label: "Degree Programs", link: `/departments` },
          { label: "Intakes", link: `/departments/${departmentId}/intakes` }, // Correct path with intakeName
          {
            label: "Semesters",
            link: `/departments/${departmentId}/intakes/${intakeId}/semesters`,
          }, // Correct path with intakeName
          {
            label: "Modules",
            link: `/departments/${departmentId}/intakes/semesters/modules`,
          },
        ]}
      />
      <div className="mr-[20%] ml-[10%] px-8 font-poppins">
        <div className="py-8 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-200 rounded-full w-full max-w-[471px] h-[41px] px-3 cursor-pointer text-md"
          />
          {userRole === "ROLE_AR" && (
            <div>
              <button
                onClick={openForm}
                className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[144px] h-[41px] ml-4"
                aria-label="Add Module"
              >
                Add Module +
              </button>
              <button
                onClick={() => navigate("/moduleRegistration")}
                className="bg-white text-blue-900 border-[3px] border-blue-950 font-semibold rounded-full w-[200px] h-[41px] ml-4"
                aria-label="Add Module"
              >
                Register your module
              </button>

              <Link to={"/semesterResults"}>
                <button className="bg-blue-950 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900">
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
            <div className="text-center text-red-500 mb-4">{error}</div>
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
                  onClick={() => localStorage.setItem("moduleId", module.id)} // Save departmentId to localStorage
                >
                  <div className="bg-white text-blue-950 border-blue-950 min-h-[45px] border-t-[1px] border-r-[2px] border-l-[1px] border-b-[3px] font-semibold w-[95%] p-2 px-4 rounded-[12px] hover:shadow-lg mb-3 cursor-pointer flex justify-between items-center">
                    {module.moduleName}
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
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeEditForm}
        >
          <div
            className="w-[75%] p-8 rounded-md shadow-md bg-white border-[3px] border-blue-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-blue-950 text-2xl font-semibold">
              Edit Module
            </h1>
            <form onSubmit={handleEdit}>
              {error && <div className="mb-4 text-red-500">{error}</div>}
              <div className="mb-6">
                <label
                  htmlFor="moduleName"
                  className="block mb-2 text-blue-950 text-lg font-semibold"
                >
                  Module Name
                </label>
                <input
                  type="text"
                  id="moduleName"
                  value={editingModule?.moduleName || ""}
                  onChange={(e) =>
                    setEditingModule({
                      ...editingModule,
                      moduleName: e.target.value,
                    })
                  }
                  className="border border-blue-950 p-2 rounded w-full"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="moduleCode"
                  className="block mb-2 text-blue-950 text-lg font-semibold"
                >
                  Module Code
                </label>
                <input
                  type="text"
                  id="moduleCode"
                  value={editingModule?.moduleCode || ""}
                  onChange={(e) =>
                    setEditingModule({
                      ...editingModule,
                      moduleCode: e.target.value,
                    })
                  }
                  className="border border-blue-950 p-2 rounded w-full"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="credit"
                  className="block mb-2 text-blue-950 text-lg font-semibold"
                >
                  Credit
                </label>
                <input
                  type="text"
                  id="credit"
                  value={editingModule?.credit || ""}
                  onChange={(e) =>
                    setEditingModule({
                      ...editingModule,
                      credit: e.target.value,
                    })
                  }
                  className="border border-blue-950 p-2 rounded w-full"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="GPA_Status"
                  className="block mb-2 text-blue-950 text-lg font-semibold"
                >
                  GPA Status
                </label>
                <select
                  id="GPA_Status"
                  value={editingModule?.GPA_Status || ""}
                  onChange={(e) =>
                    setEditingModule({
                      ...editingModule,
                      GPA_Status: e.target.value,
                    })
                  }
                  className="border border-blue-950 p-2 rounded w-full cursor-pointer"
                >
                  <option value="" disabled>Select GPA Status</option>
                  <option value="G">GPA (G)</option>
                  <option value="N">Non-GPA (N)</option>
                </select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="moduleCoordinator"
                  className="block mb-2 text-blue-950 text-lg font-semibold"
                >
                  Module Coordinator
                </label>
                <input
                  type="text"
                  id="moduleCoordinator"
                  value={editingModule?.moduleCoordinator || ""}
                  onChange={(e) =>
                    setEditingModule({
                      ...editingModule,
                      moduleCoordinator: e.target.value,
                    })
                  }
                  className="border border-blue-950 p-2 rounded w-full"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={closeEditForm}
                  type="button"
                  className="lg:w-[155px] md:w-[75px] mr-2 text-center px-4 py-2 rounded-lg bg-white font-semibold text-blue-950 border-[2px] border-blue-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="lg:w-[155px] md:w-[75px] py-2 px-4 bg-blue-950 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      {editFormOpen && (
        <ModuleCreation
          closeForm={closeEditForm}
          addModule={addModule}
          isEditing={true}
          currentModule={editingModule}
        />
      )}
    </div>
  );
};

export default Modules;