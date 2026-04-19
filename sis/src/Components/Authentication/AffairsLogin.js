import logo from '../../Images/logo.jpeg';
import luxorUniversity from '../../Images/luxorUniversity.png';

import { useState } from 'react';

import './athentication.css';
import './login.css';

export default function AffairsLogin(){
    let [data,setData] = useState({
                email:"",
                password:"",
            });
            return(
            <div className='studentRegister row justify-content-center align-items-center p-4 m-0'>
                        <div className=' row form-login  rounded-3 row-cols-md-2 row-cols-sm-1 row-cols-1 p-2'>
                            <div className='col logos1 row justify-content-center align-items-center '>
                                <div className='row '>
                                    <div className='col '>
                                        <h3 className='text-center' style={{color:"#0a3f8e"}}>Student Affairs Login Form</h3>
                                        <div className='row justify-content-evenly align-items-center text-center gap-1 p-2'>
                                            <div className='col'>
                                                <img className='photoStyler rounded-2' src={logo} alt="this logo"/>
                                            </div>
                                            <div className='col'>
                                                <img className='photoStyler rounded-2' src={luxorUniversity} alt="this logo for luxor university"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='bottom-login col  row align-items-center justify-content-center'>
                                <form>
                                    <div className='row row-cols-lg-1 row-cols-md-1 row-cols-sm-2 row-cols-1 align-items-center'>
                                    <div className='col ps-5'>
                                        <div className='col'>
                                            <div>
                                                <label>Email </label>
                                            </div>
                                            <div>
                                                <input value={data.email} onChange={(event)=>{setData({...data,email:event.target.value})}} className='input form-control' type="email" placeholder='....@gmail.com' required/>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div>
                                                <label> Password</label>
                                            </div>
                                            <input vlaue={data.password} onChange={(event)=>{setData({...data,password:event.target.value})}} className='input form-control' type="password" placeholder='*******' required/>
                                        </div>
                                    </div>
                                    <div className='col text-center'>
                                        <div className='row  justify-content-center align-items-end  p-2'>
                                            <button  className='col w-50 text- border-0 p-2 rounded-2 m-1 register login12'>login</button>
                                        </div>
                                        <a className='text-primary forgetPassword'>Forget Password??</a>
                                    </div>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
            );
}