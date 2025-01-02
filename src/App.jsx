import React from 'react'
import Sidebar from './Components/Sidebar.jsx'
import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ModuleCreation from './Components/ModuleCreation.jsx'
import Modules from './Pages/Modules.jsx'
import ModuleDetail from './Pages/ModuleDetail.jsx'
import Departments from './Pages/Departments.jsx'
import Intakes from './Pages/Intakes.jsx'
import Semesters from './Pages/Semesters.jsx'
import Login from './Pages/Login.jsx'
import AddStudents from './Pages/AddStudents.jsx'
import { UserRoleProvider } from './Context/UserRoleContext.jsx'
import StudentDepartment from './student/StudentDepartment.jsx'


function App() {
  return (
    <UserRoleProvider>
    <BrowserRouter>
      <Routes>
        {/* Routes without Sidebar */}
        <Route path='/' element={<Login />} />

        {/* Routes with Sidebar */}
        <Route
          path="*"
          element={
            <Sidebar>
              <Routes>
                <Route path='/departments/:degreename/intakes/semesters' element={<Semesters />} />
                <Route path='/departments/:degreename/intakes/semesters/modules' element={<Modules />} />
                <Route path='/createModule' element={<ModuleCreation />} />
                <Route path='/module/:id' element={<ModuleDetail />} />
                <Route path='/departments' element={<Departments />} />
                <Route path='/studentDepartments' element={<StudentDepartment />} />
                <Route path='/departments/:degreename/intakes' element={<Intakes />} />
                <Route path='/students' element={<AddStudents />} />
                <Route path='/students/addStudents' element={<AddStudents />} />
                <Route path='/semesters' element={<Semesters />} />
                <Route path='/departments/:degreename/intakes/semesters' element={<Semesters />} />

              </Routes>
            </Sidebar>
          }
        />
      </Routes>
    </BrowserRouter>
    </UserRoleProvider>
  )
}

export default App

// Lets begin with dev branch