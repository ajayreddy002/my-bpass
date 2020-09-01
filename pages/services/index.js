import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

function Service(props) {
   return (
      <section className="service-wrapper">
         <Container className="container1">
            <div className="main-title-wrapper">
               <h3>Stand out features</h3>
            </div>
            <Row>
               <Col md={4}>
                  <div className="service-box">
                     <div className="service-content-image">
                        <div className="service-images">
                           <img src="html/images/services/01.svg" alt="" />
                        </div>
                        <div className="service-content">
                           <h5>ONLINE APPLICATION</h5>
                           <p>Citizens can fill and submit the application online with required documents.
                           </p>
                        </div>
                     </div>
                  </div>
               </Col>
               <Col md={4}>
                  <div className="service-box">
                     <div className="service-content-image">
                        <div className="service-images">
                           <img src="html/images/services/02.svg" alt="" />
                        </div>
                        <div className="service-content">
                           <h5>SIMPLIFIED PROCESS</h5>
                           <p>Citizens can obtain NOC from all the line departments using single Common Application Form.</p>
                        </div>
                     </div>
                  </div>
               </Col>
               <Col md={4}>
                  <div className="service-box">
                     <div className="service-content-image">
                        <div className="service-images">
                           <img src="html/images/services/03.svg" alt="" />
                        </div>
                        <div className="service-content">
                           <h5>SAFE & SECURE</h5>
                           <p>All transactions made on the website are encrypted and hence secure.</p>
                        </div>
                     </div>
                  </div>
               </Col>
               <Col md={4}>
                  <div className="service-box">
                     <div className="service-content-image">
                        <div className="service-images">
                           <img src="html/images/services/04.svg" alt="" />
                        </div>
                        <div className="service-content">
                           <h5>3-STEP PROCESS</h5>
                           <p>Citizens can obtain permissions in 3 easy steps - applying, uploading and paying.</p>
                        </div>
                     </div>
                  </div>
               </Col>
               <Col md={4}>
                  <div className="service-box">
                     <div className="service-content-image">
                        <div className="service-images">
                           <img src="html/images/services/05.svg" alt="" />
                        </div>
                        <div className="service-content">
                           <h5>FIRST OF ITS KIND</h5>
                           <p>First government in the country to provide complete online services with no touchpoint.</p>
                        </div>
                     </div>
                  </div>
               </Col>
               <Col md={4}>
                  <div className="service-box">
                     <div className="service-content-image">
                        <div className="service-images">
                           <img src="html/images/services/06.svg" alt="" />
                        </div>
                        <div className="service-content">
                           <h5>MOBILE RESPONSIVE</h5>
                           <p>
                              Citizens can access services through desktop, tablet and mobile by having active internet connection.</p>
                        </div>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      </section>
   )
}
export default Service;