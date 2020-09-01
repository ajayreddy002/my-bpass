import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

function Leaders(props) {
   return (
      <section className="leaders-wrapper">
         <Container className="container1">
            <div className="main-title-wrapper">
               <h3>Our Leaders</h3>
               <p>The great minds behind the invention and promotion of TS-bPASS.</p>
            </div>
            <Row>
               <Col md={4}>
                  <div className="leaders-box">
                     <div className="leaders-content-image">
                        <div className="leaders-images">
                           <img src="html/images/leaders/01.png" alt="" />
                        </div>
                        <div className="leaders-content">
                           <h5>Shri. K. Chandrashekar Rao</h5>
                           <p>Honourable Chief Minister of Telangana</p>
                        </div>
                     </div>
                  </div>
               </Col>
               <Col md={4}>
                  <div className="leaders-box">
                     <div className="leaders-content-image">
                        <div className="leaders-images">
                           <img src="html/images/leaders/02.png" alt="" />
                        </div>
                        <div className="leaders-content">
                           <h5>Shri. K. T. Rama Rao</h5>
                           <p>Honourable Minister of Muncipal Administration & UrbanDevelopment</p>
                        </div>
                     </div>
                  </div>
               </Col>
               <Col md={4}>
                  <div className="leaders-box">
                     <div className="leaders-content-image">
                        <div className="leaders-images">
                           <img src="html/images/leaders/03.png" alt="" />
                        </div>
                        <div className="leaders-content">
                           <h5>Shri. Arvind Kumar, IAS</h5>
                           <p>Principal Secretary, Municipal  Administration & Urban Development</p>
                        </div>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      </section>
   )
}
export default Leaders;