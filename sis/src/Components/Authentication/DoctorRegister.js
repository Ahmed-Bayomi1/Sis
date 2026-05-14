import logo from '../../Images/logo.jpeg';
import luxorUniversity from '../../Images/luxorUniversity.png';

import './athentication.css';
import Success from '../Modals/Success';
import Fail from '../Modals/Fail';

import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from "axios";

export default function DoctorRegisterationForm(){
    let navigate = useNavigate("");
    const [data,setData] = useState({
        fullName:"",
        email:"",
        password:"",
        confirmedPassword:"",
        phone:"",
        title:"",
        specialization:"",
        idImage:null,
        cv:null,
        unniversityDegree:null,
        terms:false
    });
    function setFullName(event){
        setData({...data,fullName:event.target.value});
    }
    function setEmail(event){
        setData({...data,email:event.target.value});
    }
    function setPassword(event){
        setData({...data,password:event.target.value});
    }
    function setConfirmedPassword(event){
        setData({...data,confirmedPassword:event.target.value});
    }
    function setPhone(event){
        setData({...data,phone:event.target.value});
    }
    function setTerms(event){
        setData({...data,terms:event.target.checked});
    }
    function setIdImage(event){
        setData({...data,idImage:event.target.files[0]});
    }
    function setSecondaryCert(event){
        setData({...data,cv:event.target.files[0]})
    }
    function setuniversityDegree(event){
        setData({...data,unniversityDegree:event.target.files[0]});
    }
    function setTitle(event){
        setData({...data,title:event.target.value});
    }
    function setSpecialization(event){
        setData({...data,specialization:event.target.value});
    }
    // enbale or disable the register button

    const [button,setButton] = useState(false);
    useEffect(()=>{
        if(data.fullName!=="" && data.email!=="" && data.password!=="" && data.confirmedPassword!=="" && data.phone!=="" && data.idImage!==null && data.secodaryCert!==null && data.terms!==false){
            setButton(true);
        }else{
            setButton(false);
        }
    },[data]);

    // show success modal
    const [successModal,setSuccessModal] = useState(false);  
    const [failModal,selFailmodal] = useState(false); 
    const [message,setMessage] = useState("");

    // function ShowSuccessModal(event){
    //     event.preventDefault();
    //     if((data.password.length >= 8) && (data.password === data.confirmedPassword) && (data.fullName.length >= 7) && (data.phone.length ===11)){
    //         setSuccessModal(true);
    //         selFailmodal(false);
    //     }else{
    //         if(data.password !== data.confirmedPassword){
    //             setMessage("Check The Password");
    //         }else if(data.password.length < 8 ){
    //             setMessage("Password Must Be At Least 8 Characters");
    //         }else if(data.phone.length !==11){
    //             setMessage("Enter A Valid  Phone Number");
    //         }else if(data.fullName.length < 7){
    //             setMessage("Enter A Valid Name");
    //         }
    //         setSuccessModal(false);
    //         selFailmodal(true);
    //     }
    // }
    
    //API request
    let x = 0;
    function CheckPassword(){
        for(let i = 0;i<data.password.length ; i++){
            if((data.password[i] >= 0 && data.password[i]<=9) || (data.password[i]>='a' && data.password[i]<='z') ||(data.password[i]>='A' && data.password[i]<="Z"))
            {
                ++x;
            }
        }
    }
    CheckPassword();
    const sendData = async(event)=>{
        event.preventDefault();
        if((data.password.length >= 8) && (data.password === data.confirmedPassword) && (data.fullName.length >= 7) && (data.phone.length ===11) && (x!==data.password.length)){
            try{
                setSuccessModal(true);
                selFailmodal(false);
                const formData =new FormData();
                formData.append("FullName",data.fullName);
                formData.append("Email",data.email);
                formData.append("PhoneNumber",data.phone);
                formData.append("Password",data.password);
                formData.append("ConfirmPassword",data.confirmedPassword);
                formData.append("NationalIdImage",data.idImage);
                formData.append("Title",data.title);
                formData.append("Specialization",data.specialization);
                formData.append("UniversityDegree",data.unniversityDegree);
                formData.append("Cv",data.cv);
                formData.append("AgreeToTerms",data.terms);
                formData.append("Role", 2);
                const res = await axios.post("https://ssis.runasp.net/api/Auth/register",formData);
            }
            catch (error) {
    console.log("FULL ERROR:", error);

    let errorMessage = "Registration failed";

    if (error.response) {
        // ✅ لو السيرفر بيرجع رسالة واحدة
        if (typeof error.response.data === "string") {
            errorMessage = error.response.data;
        }

        // ✅ لو السيرفر بيرجع object فيه message
        else if (error.response.data.message) {
            errorMessage = error.response.data.message;
        }

        // ✅ لو بيرجع validation errors (زي ASP.NET)
        else if (error.response.data.errors) {
            const errors = error.response.data.errors;

            // جمع كل الأخطاء في string واحد
            errorMessage = Object.values(errors)
                .flat()
                .join(" | ");
        }
    }

    setSuccessModal(false);
    selFailmodal(true);
    setMessage(errorMessage);
}
        }else{
                if(x === data.password.length){
                    setMessage("Password Must Have Special Character");
                }
                else if(data.password !== data.confirmedPassword){
                    setMessage("Check The Password");
                }else if(data.password.length < 8 ){
                    setMessage("Password Must Be At Least 8 Characters");
                }else if(data.phone.length !==11){
                    setMessage("Enter A Valid  Phone Number");
                }else if(data.fullName.length < 7){
                    setMessage("Enter A Valid Name");
                }
                setSuccessModal(false);
                selFailmodal(true);
        }
}
    
    // prevent success or fail Modals
    function PreventModal(){
        if( successModal === true){
            setSuccessModal(false);
        }
        if(failModal === true){
            selFailmodal(false);
        }
    }

    return(
        <div onClick={PreventModal} className='studentRegister row justify-content-center align-items-center p-0 m-0'>
                    <div className='row registerForm rounded-3 row-cols-1'>
                        <div className='col logos'>
                            <h3 className='text-center' style={{color:"#0a3f8e"}}>Doctor Registration Form</h3>
                            <div className='row justify-content-evenly align-items-center text-center gap-3 p-2'>
                                <div className='col'>
                                    <img className='photoStyler rounded-2' src={logo} alt="this logo"/>
                                </div>
                                <div className='col'>
                                    <img className='photoStyler rounded-2' src={luxorUniversity} alt="this logo for luxor university"/>
                                </div>
                            </div>
                        </div>
                        <div className='col  row justify-content-center p-0 m-0 width'>
                            <form className='form_container  row row-cols-lg-2 row-cols-md-2 row-cols-sm-1 row-cols-1 p-2  m-2 rounded-2 justify-content-center'>
                                <div className='col bg-white row justify-content-center'>
                                        <div className='col padding'>
                                                <div >
                                                    <label>Full Name </label>
                                                </div>
                                                <div >
                                                    <input value={data.fullName} onChange={setFullName} className='input form-control' type="text" placeholder='Your Name' required/>
                                                </div>
                                        <div className='col'>
                                            <div>
                                                <label>Email </label>
                                            </div>
                                            <div>
                                                <input value={data.email} onChange={setEmail} className='input form-control' type="email" placeholder='....@gmail.com' required/>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div>
                                                <label> Password</label>
                                            </div>
                                            <input value={data.password} onChange={setPassword} className='input form-control' type="password" placeholder='*******' required/>
                                        </div>
                                        <div className='col'>
                                            <div>
                                                <label>Confirm Password</label>
                                            </div>
                                                <input value={data.confirmedPassword} onChange={setConfirmedPassword} className='input form-control' type="password" placeholder='*******' required/>
                                        </div>
                                        <div className='col'>
                                            <div>
                                                <label>Phone</label>
                                            </div>
                                            <input value={data.phone} onChange={setPhone} className='input form-control' type="tel" placeholder='0100.....' required/>
                                        </div>
                                    </div>
                                </div>
                                <div className='col bg-white left'>
                                    <div className='row row-cols-1'>
                                        <div className='col'>
                                            <div className='col'>
                                                <label>Title</label>
                                            <select style={{maxWidth:"200px"}} className='form-control' value={data.title} onChange={setTitle}>
                                                <option value="Professor">Professor</option>
                                                <option value="Teaching Assistant">Teaching Assistant</option>
                                                <option value="Assistant Lecturer">Assistant Lecturer</option>
                                                <option value="Lecturer">Lecturer</option>
                                                <option value="Professor Emeritus">Professor Emeritus</option>
                                            </select>
                                        </div>
                                        <div className='col'>
                                                <label>Specialization</label>
                                            <select style={{maxWidth:"200px"}} className='form-control' value={data.specialization} onChange={setSpecialization}>
                                                <option value="Computer Science">Computer Science</option>
                                                <option value="Information Technology">Information Technology</option>
                                                <option value="Information System">Information System</option>
                                            </select>
                                        </div>
                                            <div className='col'>
                                            <div>
                                                <label>National ID Image</label>
                                            </div>
                                            <input  onChange={setIdImage} className='input form-control' type="file" accept="image/*" required/>
                                        </div>
                                        <div className='col'>
                                            <div>
                                                <label>CV</label>
                                            </div>
                                            <input onChange={setSecondaryCert} className='input form-control' type="file" accept="image/*" required/>
                                        </div>
                                        <div className='col'>
                                            <div>
                                                <label>University Degree</label>
                                            </div>
                                            <input onChange={setuniversityDegree} className='input form-control' type="file" accept="image/*" required/>
                                        </div>
                                        <div className='col'>
                                                <input checked={data.terms} onChange={setTerms} type="checkbox"/>
                                                <label>Accept Our Terms</label>
                                        </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className='row  justify-content-center align-items-end  p-2'>
                                    <button disabled={!button} onClick={sendData} className='col w-auto text- border-0 p-2 rounded-2 m-1 register'>Register</button>
                                    <button onClick={()=>{navigate("/DoctorLogin")}} className='col w-auto text-bg-danger border-0 p-2 rounded-2 m-1 account'>Have An Account</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <Success visible={successModal}/> 
                    <Fail visible={failModal} Message={message}/>
                </div>
    );
}
