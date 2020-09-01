import React, { useState } from 'react';


const MainFooter = (props) => {
    
    return (
        <footer className="site-footer footer">
            <div class='container'>
                <div className="row align-items-start justify-content-between mb-3">
                    <ul className="col-6 col-lg-3">
                        <li class='footer-title'>Departments</li>
                        <li><a href='./index.html'>ContinuingEducation.com</a></li>
                        <li><a href='./index.html'>Leadership Team</a></li>
                        <li><a href='./index.html'>Accreditation</a></li>
                        <li><a href='./index.html'>Write for Us</a></li>
                    </ul>
                    <ul className="col-6 col-lg-3">
                        <li class='footer-title'>Resources</li>
                        <li><a href='./index.html'>LRS</a></li>
                        <li><a href='./index.html'> HMDA</a></li>
                        <li><a href='./index.html'>Evidence-Based Practice</a></li>
                        <li><a href='./index.html'>Free CE Alerts</a></li>
                        <li><a href='./index.html'>CE-PRO Membership</a></li>
                        <li><a href='./index.html'>First Course Free</a></li>
                    </ul>
                    <ul className="col-6 col-md-4 col-lg-3">
                        <li class='footer-title'>Support</li>
                        <li><a href='./index.html'>Help</a></li>
                        <li><a href='../faq/en/index.html'>FAQs</a></li>
                        <li><a href='#contact-us'>Contact Us</a></li>
                        <li><a href='./index.html'>Terms of Service</a></li>
                        <li><a href='./index.html'>Privacy Policy</a></li>
                    </ul>
                    <ul className="col-6 col-lg-3">
                        <li><a href='./index.html' class='opacity-1'>
                            <img src='/html/images/logo-text.png' alt='logo' />
                        </a></li>
                        <li className="address">
                            <span>Directorate of Town and Country Planning</span><br />
                            <span>Governament of Telangana,</span><br />
                            <span>3rd to 5th Floor</span><br />
                            <span>640,AC Guards Opp: PTI Building</span><br />
                            <span>Hyderabad - 500004</span>
                        </li>
                        <li>
                            <img src='/html/images/iso.png' alt='iso' />
                            <img src='/html/images/ssl.png' alt='ssl' />
                            <img src='/html/images/pci.png' alt='pci' />
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container">
                <div className="row text-center">
                    <div className="col-md-12">
                        <div className="border-top">
                            <ul class='row align-items-center justify-content-center footer-bottom-list'>
                                <li class='col-12 col-lg-4'><a href='./index.html'>Terms and Conditions.</a></li>
                                <li className="col-12 col-lg-4"><a href='./index.html'>Privacy Statement</a></li>
                            </ul>
                            <ul class='row align-items-center justify-content-center footer-bottom-list'>
                                <li className="col-12"><a href='./index.html'>Copyright ©2020 Telangana State Building Permission Approval and Self Certification System. All Rights Reserved.</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default MainFooter