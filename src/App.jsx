import React from "react";
import Sidebar from "./Components/Sidebar.jsx";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ModuleCreation from "./Features/ModuleManagement/ModuleCreation.jsx";
import Modules from "./Features/ModuleManagement/Modules.jsx";
import ModuleDetail from "./Features/ModuleManagement/ModuleDetail.jsx";
import Departments from "./Features/DegreeProgram/Departments.jsx";
import Intakes from "./Features/Intakes/Intakes.jsx";
import Semesters from "./Features/Semester/Semesters.jsx";
import Login from "./Features/Auth/Login.jsx";
import AddStudents from "./Features/student/AddStudents.jsx";
import { UserRoleProvider } from "./Context/UserRoleContext.jsx";
import StudentDepartment from "./Features/student/StudentDepartment.jsx";
import ModuleMarks from "./Features/ModuleManagement/ModuleMarks.jsx";
import Assignments from "./Features/Assignments/Assignments.jsx";
import UploadMarks from "./Components/UploadMarks.jsx";
import Marks from "./Features/Assignments/Marks.jsx";
import Signup from "./Features/Auth/Signup.jsx";
import LecturerDepartments from "./Features/lecturer/LecturerDepartments.jsx";
import Lecturers from "./Features/lecturer/Lecturers.jsx";
import UploadLecturers from "./Features/lecturer/UploadLecturer.jsx";
import ViewMarks from "./Features/Assignments/ViewMarks.jsx";
import Students from "./Features/student/Students.jsx";
import UploadStudents from "./Features/student/UploadStudent.jsx";
import StudentIntakes from "./Features/student/StudentIntakes.jsx";
import { ModuleRegistrationPage } from "./Features/ModuleManagement/ModuleRegistrationPage.jsx";
import { ModuleRegistrationForm } from "./Features/ModuleManagement/ModuleRegistrationForm.jsx";
// import TokenTest from "./Pages/TokenTest.jsx"; // Import the TokenTest diagnostic page
import ViewsemiMarks from "./Features/ModuleManagement/ViewsemiResults.jsx";
import ViewSemiResults from "./Features/ModuleManagement/ViewsemiResults.jsx";
import ViewFinalResults from "./Features/Semester/ViewFinalResults.jsx";
import Transcript from "./Features/Transcript/Transcript.jsx";
import StudentTranscript from "./Features/Transcript/StudentTranscript.jsx"
import MRPforStudent from "./Features/ModuleManagement/MRPforStudent.jsx";


function App() {
  return (
    <UserRoleProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes without Sidebar */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/token-test" element={<TokenTest />} /> */}
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
                  <Route path="/moduleMarks" element={<ModuleMarks />} />
                  
                  
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
                  {/* <Route path="/marks" element={<Marks />} /> */}
                  <Route path="/viewmarks" element={<ViewMarks />} />
                  <Route path="/semesterResults" element={<ViewsemiMarks />} />
                  <Route path="/viewFinalResults" element={<ViewFinalResults />} />

                  <Route path="/moduleRegistration" element={<ModuleRegistrationPage/>}/>
                  
                  <Route
                    path="/registration/:studentId"
                    element={<ModuleRegistrationForm />} />

                  <Route
                  path="/ModuleRegistrationFormViewForStudent"
                  element={<MRPforStudent />} />
                  
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
