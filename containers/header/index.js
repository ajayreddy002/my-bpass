import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'shards-ui/dist/css/shards.min.css';
import '../../styles/html/css/bootstrap.min.css';
import '../../styles/html/css/jquery.fancybox.min.css';
// import '../../styles/html/css/owl.carousel.min.css';
// import '../../styles/html/css/owl.theme.default.min.css';
// import '../../styles/html/fonts/flaticon/font/flaticon.css';
import '../../styles/html/css/aos.css';
import '../../styles/html/css/style.css';
// import '../../styles/style.css';

const MainHeader = (props) => {
    
    return (
        <header
            className="site-navbar js-sticky-header site-navbar-target"
            role="banner"
            id="header-tsbpass"
            style={{ width: `1519.2px`}}
        >
        <div className="container-fluid">
            <div className="row align-items-center position-relative" style={{ minHeight: `76px` }}>
                <div className="site-logo">
                    <a href="/" className="text-black">
                        <img src="/html/images/logo.png"
                             className="img img-fluid"
                             id="tsbpass-logo" />
                        <span className="text-primary ml-2">TS-bPASS</span></a>
                </div>
                <div className="col-12">
                    <nav
                            className="site-navigation text-right ml-auto "
                            role="navigation">
                        <ul
                                className="site-menu main-menu js-clone-nav ml-auto d-none d-lg-block">
                            <li >
                                <a href="#home-section" className="nav-link text-uppercase">Home</a>
                            </li>
                            <li >
                                <a href="#why-us-section"
                                   target="_blank"
                                   className="nav-link text-uppercase external">About TS-bPASS</a>
                            </li>
                            <li className="dropdown" >
                                <a className="dropdown-toggle internal text-uppercase"
                                   data-toggle="dropdown"
                                   href="#">Resources</a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a href="#contact-section" className="nav-link"> GO's and Acts</a>
                                    </li>
                                    <li>
                                        <a href="http://tsbpass.com/support"
                                           className="external"
                                           target="_blank">Rules and Regulations</a
                                        >
                                    </li>
                                    <li>
                                        <a href="http://tsbpass.com/support"
                                           className="external"
                                           target="_blank">Help Manuals</a
                                        >
                                    </li>
                                    <li>
                                        <a href="http://tsbpass.com/support"
                                           className="external"
                                           target="_blank">Training Videos</a
                                        >
                                    </li>
                                </ul>
                            </li>
                            <li className="dropdown" >
                                <a className="dropdown-toggle internal text-uppercase"
                                   data-toggle="dropdown"
                                   href="#">Departments</a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a href="http://dcrportal.telangana.gov.in/" className="nav-link">DCR Portal</a>
                                    </li>
                                    <li>
                                        <a href="http://tsbpass.com/support"
                                           className="external"
                                           target="_blank">Fire Department</a
                                        >
                                    </li>
                                    <li>
                                        <a href="http://tsbpass.com/support"
                                           className="external"
                                           target="_blank">Fire Department</a
                                        >
                                    </li>
                                    <li>
                                        <a href="http://tsbpass.com/support"
                                           className="external"
                                           target="_blank">Police Department</a
                                        >
                                    </li>
                                    <li>
                                        <a href="http://tsbpass.com/support"
                                           className="external"
                                           target="_blank">Revenue Department</a
                                        >
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a className="nav-link text-uppercase" href="/login">
                                    Citizen Login
                                </a>
                            </li>
                            <a className="btn btn-primary text-white px-4"
                               data-toggle="modal"
                               data-target="#applyNowModal">
                                <span className='apply'>Apply Now</span>
                            </a>
                            <li className='only-mobile'>
                                <a data-toggle="modal"
                                   data-target="#languageSelectionModal"
                                   >
                                    <i className="language-selector icon-g_translate"></i>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="toggle-button d-inline-block d-lg-none" style={{ zIndex: 10}} >
                    <a href="#" className="site-menu-toggle js-menu-toggle text-black">
                        <span className="icon-menu h3"></span>
                    </a>
                </div>
                <div className="row support">
                    <p className='font-size-12' style={{color: `#ffffff`}}>May 31, 2020 6:47 pm</p>
                    <div className='support-inner'>
                        <a href="tel:040-23314622" className='font-size-12'>040-2331 4622</a>
                        <a href="../../faq/en/index.html" className='text-uppercase font-size-12'>FAQ</a>
                        <a href="http://tsbpass.com/support" target="_blank"
                           className='text-uppercase font-size-12 external'>Support</a>
                        <a className='language-wrapper' data-toggle="modal" data-target="#languageSelectionModal">
                            <span className='text-uppercase font-size-12'>Language</span>
                            <img src='/html/images/language.svg' className='language' alt='language' />
                        </a>
                        <button id="btn-decrease">A-</button>
                        <button id="btn-orig">A</button>
                        <button id="btn-increase">A+</button>
                    </div>
                </div>
            </div>
        </div>
    </header>
    )
}

export default MainHeader