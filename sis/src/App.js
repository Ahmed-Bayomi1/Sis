import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

import {BrowserRouter} from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';

import IntoductionPage from './Components/IntroPage/IntroPage.js';
import StudentRegister from './Components/Authentication/StudentsRsgister.js';
import DoctorRegister from './Components/Authentication/DoctorRegister.js';
import StudentAffairRegister from './Components/Authentication/AffairsRegister.js';
import StudentLogin from './Components/Authentication/StudentLogin.js';
import DoctorLogin from './Components/Authentication/DoctorLogin.js';
import AffairsLogin from './Components/Authentication/AffairsLogin.js';
import HomeStudent from './Components/Student/HomeStudent.js';
import HomeDoctor from './Components/Doctor/HomeDoctor.js';
import HomeAffaris from './Components/Affairs/HomeAffaris.js';
import StudentReview from './Components/Affairs/StudentReview.js';
import Teacher from './Components/Affairs/Teacher.js';
import AffairsCourses from './Components/Affairs/AffairsCourses.js';
import Courses from './Components/Student/Courses.js';
import Grades from './Components/Student/Grades.js';
import Payment from './Components/Student/Payment.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntoductionPage/>}></Route>
        <Route path="/StudentsRsgister" element={<StudentRegister/>}></Route>
        <Route path="/DoctorRegister" element={<DoctorRegister/>}></Route>
        <Route path="/AffairsRegister" element={<StudentAffairRegister/>}></Route>
        <Route path="/StudentLogin" element={<StudentLogin/>}></Route>
        <Route path="/DoctorLogin" element={<DoctorLogin/>}></Route>
        <Route path="/AffairsLogin" element={<AffairsLogin/>}></Route>
        <Route path="/HomeStudent" element={<HomeStudent/>}></Route>
        <Route path="/HomeDoctor" element={<HomeDoctor/>}></Route>
        <Route path="/HomeAffaris" element={<HomeAffaris/>}></Route>
        <Route path="/StudentReview" element={<StudentReview/>}></Route>
        <Route path="/Teacher" element={<Teacher/>}></Route>
        <Route path="/AffairsCourses" element={<AffairsCourses/>}></Route>
        <Route path="/Courses" element={<Courses/>}></Route>
        <Route path="/Grades" element={<Grades/>}></Route>
        <Route path="/Payment" element={<Payment/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
