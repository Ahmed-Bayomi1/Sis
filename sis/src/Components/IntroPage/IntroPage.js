
import logo from '../../Images/logo.jpeg';
import luxorUniversity from '../../Images/luxorUniversity.png';
import student from '../../Images/s.jpg';
import doctor from '../../Images/l.jpg';
import studentAffairs from '../../Images/a.jpg';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styleOfIntroPage.css';

import { useNavigate } from 'react-router-dom';

import Footer from '../Footer/footer.js';


export default function IntoductionPage(){ 
    let navigate = useNavigate();
    return(
        <div className="intoductionPage row justify-content-center align-content-center p-0 m-0">
            <div className="selectYourRole rounded-3 py-5 m-3 wrapper ">
                <div className="row row-cols-lg-2 row-cols-md-2 row-cols-sm-1 row-cols-1 header p-2 container justify-content-center align-content-center">
                    <div  className='col'>
                        <div className='row text-center flex gap-2 justify-content-center'>
                            <img className='photoStyle' src={logo} alt="This is a Logo??"/>
                            <img className='photoStyle' src={luxorUniversity} alt="Luxor University??"/>
                        </div>
                    </div>
                    <div className='col text-center p-4'>
                        <h5 style={{color:"#0a3f8e"}}>Student Information System</h5>
                    </div>
                </div>

                {/*  */}

                <div className='my-4 row row-cols-lg-4 row-cols-md-1 row-cols-sm-1 row-cols-1 flex justify-content-evenly gap-3'>
                    <div className='boxwidth col border border-2 border-primary p-2 rounded-4 text-center'>
                        <div className='my-3'>
                            <img className='RoleStyle rounded-2' src={student} alt="This is a Student??"/>
                        </div>
                        <div>
                            <button className='border-0 text-bg-success p-1 rounded' onClick={()=>{navigate("/StudentsRsgister")}}>As a Student</button>
                        </div>
                    </div>
                    <div className='boxwidth col border border-2 border-primary p-2 rounded-4 text-center'>
                        <div className='my-3'>
                            <img className='RoleStyle rounded-2' src={doctor} alt="This is a Student??"/>
                        </div>
                        <div>
                            <button className='border-0 text-bg-success p-1 rounded' onClick={()=>{navigate("/DoctorRegister")}}>As a Doctor</button>
                        </div>
                    </div>
                    <div className='boxwidth col border border-2 border-primary p-2 rounded-4 text-center'>
                        <div className='my-3'>
                            <img className='RoleStyle rounded-2' src={studentAffairs} alt="This is a Student??"/>
                        </div>
                        <div>
                            <button className='border-0 text-bg-success p-1 rounded' onClick={()=>{navigate("/AffairsRegister")}}>Student Affairs</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}