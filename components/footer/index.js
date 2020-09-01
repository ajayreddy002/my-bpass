import React, { useState } from 'react';
import Link from 'next/link';
import { Row, Col } from 'react-bootstrap';

function Footer(props) {
   return (
      <footer>
         <div className="footer-block">
            <div className="footer-first-block">
               <Row>
                  <Col md={3}>
                     <div  style={{ marginTop:-20 }} className="footer-about-block">
                        <h4 style={{ fontWeight: 'bold',fontSize:15 }}>Departments</h4>
                        <ul style={{  margin: 1, padding: 1}}>
                        <li style={{  margin: 1, padding: 1 }}><a target="_blank" href='https://www.telangana.gov.in/about/state-profile'>Telangana State Portal</a></li>
                        <li style={{  margin: 1, padding: 1 }}><a target="_blank" href='https://www.ghmc.gov.in/'> GHMC</a></li>
                        <li style={{  margin: 1, padding: 1 }}><a target="_blank" href='http://dpms.dtcp.telangana.gov.in/'>DTCP</a></li>
                        <li style={{  margin: 1, padding: 1 }}><a target="_blank" href='https://www.hmda.gov.in/'>HMDA</a></li>
                        </ul>
                     </div>
                  </Col>
                  <Col md={3} >
                     <div style={{ marginTop:-20 }} className="footer-support-block">
                        <h4 style={{ fontWeight: 'bold',fontSize:15 }}>Support</h4>
                        <ul style={{  margin: 1, padding: 1}}>
                           <li style={{  margin: 1, padding: 1}}><a href="#">Help</a></li>
                           <li style={{  margin: 1, padding: 1}}><a href="#">FAQs</a></li>
                           <li style={{  margin: 1, padding: 1}}><a href="#">Contact Us</a></li>
                           <li style={{  margin: 1, padding: 1}}><a href="#">Terms of Service</a></li>
                           <li style={{  margin: 1, padding: 1}}><a href="#"> Privacy Policy</a></li>
                        </ul>
                     </div>
                  </Col>
                  <Col md={2}>
                     <div className="footer-support-block">
                        
                        <ul>
                        <li ><a target="_blank" href='https://play.google.com/store/apps/details?id=com.cloudfrontfactory.tsbpass'>
                <img style={{ height: '80px', width: '200px',marginLeft:-30, marginTop:-40 }} src='/html/images/playstore.png' alt='pci' /></a></li>
            <li class="col-12 col-lg-6"><a target="_blank" href='https://web.whatsapp.com/send?phone=14155238886?text=join%20believed%2Dbread'>
                <img src='/html/images/whatsapp.png' alt='pci' /></a></li>
                        </ul>
                     </div>
                  </Col>
                  <Col md={4}>
                     <div className="footer-logo-wrapper">
                     
                        <div className="footer-logo-block">
                           
                           <ul>
                           <li><a href='./index.html' className='opacity-1'>
                    <img style={{  width: '150px',marginLeft:0, marginTop:-40 }} src='/html/images/logo-text.png' alt='logo' />
                </a></li>
                            <li style={{  margin: 1, padding: 1}}><a style={{ fontSize:12}} href="#">Directorate of Town and Country Planning</a></li>
                              <li style={{  margin: 1, padding: 1}}><a style={{ fontSize:12}} href="#">Governament of Telangana</a></li>
                              <li style={{  margin: 1, padding: 1}}><a style={{ fontSize:12}} href="#">3rd to 5th Floor</a></li>
                              <li style={{  margin: 1, padding: 1}}><a style={{ fontSize:12}} href="#">640,AC Guards Opp: PTI Building</a></li>
                              <li style={{  margin: 1, padding: 1}}><a style={{ fontSize:12}} href="#">Hyderabad - 500004</a></li>
                           </ul>
                            <div style={{  marginTop: 2, paddingTop: 2}}className="footer-bottom-logo">
                              <img style={{  margin: 1, padding: 1}} src="/html/images/footer/01.png" className="image1" alt="hi" />
                              <img style={{  margin: 1, padding: 1}}src="/html/images/footer/02.png" className="image2" alt="hi" />
                              <img style={{  margin: 1, padding: 1}} src="/html/images/footer/03.png" className="image3" alt="hi" />
                           </div> 
                        </div>
                     </div>
                  </Col>
               </Row>
            </div>
            
            <div className="footer-third-block">
               <span>Copyright ©2020 Telangana State Building Permission Approval and Self Certification System. All Rights Reserved.</span>
            </div>
         </div>
      </footer>
   )
}
export default Footer;