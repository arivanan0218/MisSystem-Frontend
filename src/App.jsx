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
//import TranscriptLanding from "./Pages/TranscriptLanding.jsx";
//import TranscriptPage from "./Transcript/pages/TranscriptPage.jsx";
import LecturerDepartments from "./lecturer/LecturerDepartments.jsx";
import Lecturers from "./lecturer/Lecturers.jsx";
import UploadLecturers from "./lecturer/UploadLecturer.jsx";
import ViewMarks from "./Pages/ViewMarks.jsx";
import Students from "./student/Students.jsx";
import UploadStudents from "./student/UploadStudent.jsx";
import StudentIntakes from "./student/StudentIntakes.jsx";
import { ModuleRegistrationPage } from "./Pages/ModuleRegistrationPage.jsx";
import { ModuleRegistrationForm } from "./Components/ModuleRegistrationForm.jsx";
import TokenTest from "./Pages/TokenTest.jsx"; // Import the TokenTest diagnostic page
import Transcript from "./Pages/Transcript.jsx";
import StudentTranscript from "./Pages/StudentTranscript.jsx"

function App() {
  return (
    <UserRoleProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes without Sidebar */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/token-test" element={<TokenTest />} />
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
                  <Route path="/lecturerdepartments" element={<LecturerDepartments />} />
                  <Route path="/moduleRegistration" element={<ModuleRegistrationPage/>}/>
                  
                  <Route
                    path="/studentdepartments/:degreename/sintakes"
                    element={<StudentIntakes />}
                  />

                  <Route
                    path="/studentdepartments/:degreename/sintakes/:intakename/students"
                    element={<Students />}
                  />
                  <Route
                    path="/registration/:studentId"
                    element={<ModuleRegistrationForm />}
                  />

                  <Route
                    path="/transcript"
                    element={<Transcript />}
                  />
                   <Route
                    path="/module/endExam"
                    element={<StudentTranscript />}
                  />
                  <Route
                    path="/lecturerdepartments/:degreename/lecturers"
                    element={<Lecturers />}
                  />
                  <Route path="/students" element={<Students />} />
                  <Route
                    path="/studentdepartments/:degreename/sintakes/students"
                    element={<Students />}
                  />
                  <Route
                    path="/studentDepartments"
                    element={<StudentDepartment />}
                  />
                  
                 
                  <Route
                    path="/departments/:degreename/intakes"
                    element={<Intakes />}
                  />
                  
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
                  <Route path="/uploadLecturers" element={<UploadLecturers />} />
                  <Route path="/uploadStudents" element={<UploadStudents />} />

                  <Route
                    path="/departments/:degreename/intakes/semesters/modules/assignments/marks"
                    element={<Marks />}
                  />
                  <Route path="/lecturers" element={<Lecturers />} />
                  <Route path="/marks" element={<Marks />} />
                  <Route path="/viewmarks" element={<ViewMarks />} />

                  <Route path="/moduleRegistration" element={<ModuleRegistrationPage/>}/>
                  
                  <Route
                    path="/registration/:studentId"
                    element={<ModuleRegistrationForm />} />
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
