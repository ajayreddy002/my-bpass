import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

function Features(props) {
   return (
      <section className="features-wrapper">
         <Container className="container1">
            <div className="main-title-wrapper">
               <h3>Salient features</h3>
            </div>
            <Row>
               <Col md={6}>
                  <div className="Features-dec">
                     <ul>
                        <li>There will be <span>District Level bPASS committee</span> headed by District Collector to examine the proposals and conduct post verification of the proposal and to take up enforcement action on Unauthorized development/violations.</li>
                        <li>For plot sizes up to <span>75 square yards,</span> no permission is required and the applicant is required to register online.</li>
                        <li>Instant building approval for plot area up to <span>500 sq.mts and height up to 10mts</span> based on self-certification by the applicant.</li>
                        <li>Single window approval for all buildings having height above 10 mtr and all non-residential building permissions will be sanctioned in 21 days.</li>
                     </ul>
                  </div>
               </Col>
               <Col md={6}>
                  <div className="Features-dec">
                     <ul>
                        <li>No mortgage for plots <span>up to 200 sq.mtr</span>  and height up to 7 mtr.</li>
                        <li>Post verification of the Building permissions by District Level Committee.</li>
                        <li>Applicant will be liable for punishment for misrepresentation of facts.</li>
                        <li>Violation shall be removed without issuing any notice.</li>
                        <li>Occupancy Certificate will be issued online based on Self-Certification.</li>
                     </ul>
                  </div>
               </Col>

            </Row>

         </Container>
      </section>
   )
}
export default Features;