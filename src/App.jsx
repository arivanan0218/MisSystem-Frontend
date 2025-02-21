import React from "react";
import Sidebar from "./Components/Sidebar.jsx";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ModuleCreation from "./Components/ModuleCreation.jsx";
import Modules from "./Pages/Modules.jsx";
import ModuleDetail from "./Pages/ModuleDetail.jsx";
import Departments from "./Pages/Departments.jsx";
import Intakes from "./Pages/Intakes.jsx";
import Semesters from "./Pages/Semesters.jsx";
import Login from "./Pages/Login.jsx";
import AddStudents from "./Pages/AddStudents.jsx";
import { UserRoleProvider } from "./Context/UserRoleContext.jsx";
import StudentDepartment from "./student/StudentDepartment.jsx";
import ModuleMarks from "./Pages/ModuleMarks.jsx";
import EndExamResults from "./Pages/EndExamResults.jsx";
import Assignments from "./Pages/Assignments.jsx";
import UploadMarks from "./Components/UploadMarks.jsx";
import Marks from "./Pages/Marks.jsx";
import Signup from "./Pages/Signup.jsx";
import { ModuleRegistrationPage } from "./Pages/ModuleRegistrationPage.jsx";
import { ModuleRegistrationForm } from "./Components/ModuleRegistrationForm.jsx";

function App() {
  return (
    <UserRoleProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes without Sidebar */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Routes with Sidebar */}
          <Route
            path="*"
            element={
              <Sidebar>
                <Routes>
                  <Route
                    path="/departments/:degreename/intakes/:intakename/semesters"
                    element={<Semesters />}
                  />

                  <Route
                    path="/departments/:degreename/intakes/semesters/modules"
                    element={<Modules />}
                  />
                  <Route path="/createModule" element={<ModuleCreation />} />
                  <Route path="/module/:id" element={<ModuleDetail />} />
                  <Route path="/departments" element={<Departments />} />
                  <Route
                    path="/studentDepartments"
                    element={<StudentDepartment />}
                  />
                  <Route
                    path="/departments/:degreename/intakes"
                    element={<Intakes />}
                  />
                  <Route path="/students" element={<AddStudents />} />
                  <Route
                    path="/students/addStudents"
                    element={<AddStudents />}
                  />
                  <Route path="/semesters" element={<Semesters />} />
                  <Route
                    path="/departments/:degreename/intakes/semesters"
                    element={<Semesters />}
                  />
                  <Route
                    path="/departments/:degreename/intakes/semesters/modules/assignments"
                    element={<Assignments />}
                  />
                  <Route path="/assignments" element={<Assignments />} />
                  <Route path="/uploadMarks" element={<UploadMarks />} />

                  <Route
                    path="/departments/:degreename/intakes/semesters/modules/assignments/marks"
                    element={<Marks />}
                  />
                  <Route path="/marks" element={<Marks />} />

                  <Route
                    path="/moduleRegistration"
                    element={<ModuleRegistrationPage />}
                  />

                  <Route
                    path="/registration/:studentId"
                    element={<ModuleRegistrationForm />}
                  />
                </Routes>
              </Sidebar>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserRoleProvider>
  );
}

export default App;

// Lets begin with dev branch
// hello
