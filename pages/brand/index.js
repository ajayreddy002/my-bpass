import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

function Brand(props) {
   return (
      <section className="brand-wrapper">
         <Container className="container1">
            <div className="main-title-wrapper">
               <h3>Organograms </h3>
            </div>
            <Row>
               <Col md={3}>
                  <div className="brand-box">
                     <div className="brand-image">
                        <img src="html/images/brand/01.png" alt="" className="brand1" />
                     </div>
                  </div>
               </Col>
               <Col md={3}>
                  <div className="brand-box">
                     <div className="brand-image">
                        <img src="html/images/brand/02.png" alt="" className="brand2" />
                     </div>
                  </div>
               </Col>
               <Col md={3}>
                  <div className="brand-box">
                     <div className="brand-image">
                        <img src="html/images/brand/03.png" alt="" className="brand3" />
                     </div>
                  </div>
               </Col>
               <Col md={3}>
                  <div className="brand-box">
                     <div className="brand-image">
                        <img src="html/images/brand/04.png" alt="" className="brand4" />
                     </div>
                  </div>
               </Col>

            </Row>
         </Container>
      </section>
   )
}
export default Brand;