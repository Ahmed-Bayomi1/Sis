import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import './footer.css';

export default function Footer(){
    return(
        <div className="footer text-white">
            <div className="row">
                <div className='col p-5'>
                    <h4>Luxor University</h4>
                </div>
            <div className='container col'>
                <div className='row'>
                <div className='col'>
                    <p>Product</p>
                    <ul className='list-unstyled'>
                        <li>Overview</li>
                        <li>Features</li>
                        <li>Solutions</li>
                        <li>Tutorials</li>
                        <li>Pricing</li>
                        <li>Releases</li>
                    </ul>
                </div>
                <div className='col'>
                    <p>Company</p>
                    <ul className='list-unstyled'>
                        <li>About Us</li>
                        <li>Careers</li>
                        <li>Press</li>
                        <li>News</li>
                        <li>Medis Kit</li>
                        <li>Contact</li>
                    </ul>
                </div>
                <div className='col'>
                    <p>Resources</p>
                    <ul className='list-unstyled'>
                        <li>Blog</li>
                        <li>Newseltter</li>
                        <li>Events</li>
                        <li>helep Center</li>
                        <li>Tutorials</li>
                        <li>Support</li>
                    </ul>
                </div>
            </div>
            </div>
            </div>
            <div className='row'>
                <hr></hr>
                <div className='col'>
                    <h5>Student Information System</h5>
                    <p>A Smart Information System that Automate Most OF Students Affaris</p>
                </div>
                <div className='col text-end'>
                    <p>@2026 . All Right Reserved</p>
                </div>
            </div>
        </div>
    );
}