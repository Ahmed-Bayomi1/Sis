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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
