import logo from '../../Images/logo.jpeg';
import luxorUniversity from '../../Images/luxorUniversity.png';
    
    import './athentication.css';
    import './login.css'

    export default function StudentLogin(){
        return(
        <div className='studentRegister row justify-content-center align-items-center p-0 m-0'>
                    <div className='row form-login rounded-3 row-cols-1'>
                        <div className='col logos'>
                            <h3 className='text-center' style={{color:"#0a3f8e"}}>Student Registration Form</h3>
                            <div className='row justify-content-evenly align-items-center text-center gap-1 p-2'>
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
                                <div className='col bg-white row justify-content-center w-100'>
                                        <div className='col padding'>
                                                
                                        <div className='col'>
                                            <div>
                                                <label>Email </label>
                                            </div>
                                            <div>
                                                <input  className='input form-control' type="email" placeholder='....@gmail.com' required/>
                                            </div>
                                        </div>
                                        <div className='col'>
                                            <div>
                                                <label> Password</label>
                                            </div>
                                            <input className='input form-control' type="password" placeholder='*******' required/>
                                        </div>
                                        
                                    </div>
                                    <div className='row  justify-content-center align-items-end  p-2'>
                                        <button  className='col  text- border-0 p-2 rounded-2 m-1 register'>Login</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        );
    }