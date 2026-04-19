import logo from '../../Images/logo.jpeg';
import luxorUniversity from '../../Images/luxorUniversity.png';

import './athentication.css';
import Success from '../Modals/Success';
import Fail from '../Modals/Fail';

import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from "axios";



export default function AffairRegisterationForm(){
    let navigate = useNavigate("");
    const [data,setData] = useState({
        fullName:"",
        email:"",
        password:"",
        confirmedPassword:"",
        phone:"",
        adminCode:"",
        idImage:null,
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
    function setAdminCode(event){
        setData({...data,adminCode:event.target.value});
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
    let y =0;
    function CheckPassword(){
        for(let i = 0;i<data.password.length ; i++){
            if((data.password[i] >= 0 && data.password[i]<=9) || (data.password[i]>='a' && data.password[i]<='z') ||(data.password[i]>='A' && data.password[i]<="Z"))
            {
                ++x;
            }
        }
        for(let i = 0;i<data.password.length ; i++){
            if( (data.password[i]>='a' && data.password[i]<='z'))
            {
                ++y;
            }
        }
    }

    CheckPassword();
    const sendData = async(event)=>{
        event.preventDefault();
        if((data.password.length >= 8) && (data.password === data.confirmedPassword) && (data.fullName.length >= 7) && (data.phone.length ===11) && (x!==data.password.length) && (data.adminCode ==="ADMIN_SECRET_2024") && (y>0) ){
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
                formData.append("AdminCode",data.adminCode);
                formData.append("AgreeToTerms",data.terms);
                formData.append("Role", 1);
                const res = await axios.post("https://ssis.runasp.net/api/Auth/register",formData);
            }
            catch(error){
                console.log("ERROR DATA:", error.response?.data);
                console.log("STATUS:", error.response?.status);
                }
        }else{
                if(y === 0){
                    setMessage("password must have at least one character")
                }
                else if(data.adminCode !== "ADMIN_SECRET_2024"){
                    setMessage("Wrong Admin Code");
                }
                else if(x === data.password.length){
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
                        <h3 className='text-center' style={{color:"#0a3f8e"}}>Student Affairs Registration Form</h3>
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
                        <form className='form_container  row row-cols-lg-2 row-cols-md-2 row-cols-sm-1 row-cols-1 p-2 w-75 m-2 rounded-2 justify-content-center'>
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
                                        <div>
                                            <label>Admin Code</label>
                                        </div>
                                        <input value={data.adminCode} onChange={setAdminCode} className='input form-control' type="text" required/>
                                    </div>
                                    <div className='col'>
                                        <div className='col'>
                                        <div>
                                            <label>National ID Image</label>
                                        </div>
                                        <input  onChange={setIdImage} className='input form-control' type="file" accept="image/*" required/>
                                    </div>
                                    <div className='col'>
                                            <input checked={data.terms} onChange={setTerms} type="checkbox"/>
                                            <label>Accept Our Terms</label>
                                    </div>
                                    </div>
                                    <div className='col'>
                                        
                                    </div>
                                </div>
                            </div>
                            <div className='row  justify-content-center align-items-end  p-2'>
                                <button disabled={!button} onClick={sendData} className='col w-auto text- border-0 p-2 rounded-2 m-1 register'>Register</button>
                                <button onClick={()=>{navigate("/AffairsLogin")}} className='col w-auto text-bg-danger border-0 p-2 rounded-2 m-1 account'>Have An Account</button>
                            </div>
                        </form>
                    </div>
                </div>
                <Success visible={successModal}/> 
                <Fail visible={failModal} Message={message}/>
            </div>
        );
}