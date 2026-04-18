import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

import {BrowserRouter} from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';

import IntoductionPage from './Components/IntroPage/IntroPage.js';
import Student from './Components/Authentication/StudentsRsgister.js';
import Doctor from './Components/Authentication/DoctorRegister.js';
import StudentAffair from './Components/Authentication/AffairsRegister.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntoductionPage/>}></Route>
        <Route path="/StudentsRsgister" element={<Student/>}></Route>
        <Route path="/DoctorRegister" element={<Doctor/>}></Route>
        <Route path="/AffairsRegister" element={<StudentAffair/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
