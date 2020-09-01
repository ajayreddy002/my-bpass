import React from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import Link from 'next/link';

function Contact(props) {
   return (
      <section className="contact-wrapper">
         <Container className="container1">
            <div className="contact-block">
               <Row>
                  <Col md={7}>
                     <div className="contact-form">
                        <h5>Contact Us</h5>
                        <Form className="login-form-type">
                           <div className="contact-details-form">
                              <Form.Group>
                                 <Form.Label>First Name</Form.Label>
                                 <Form.Control type="text" placeholder="Enter First Name" />
                              </Form.Group>
                              <Form.Group>
                                 <Form.Label>Last Name</Form.Label>
                                 <Form.Control type="text" placeholder="Enter Last Name" />
                              </Form.Group>
                           </div>
                           <Form.Group controlId="formBasicEmail">
                              <Form.Label>Email Address</Form.Label>
                              <Form.Control type="email" placeholder="Enter your email address" />
                           </Form.Group>
                           <Form.Group controlId="phone">
                              <Form.Label>Phone Number</Form.Label>
                              <Form.Control type="text" placeholder="Enter your Phone Number" />
                           </Form.Group>
                           <Form.Group controlId="exampleForm.ControlTextarea1">
                              <Form.Label>Message</Form.Label>
                              <Form.Control as="textarea" rows="6" placeholder="Type your message here.." />
                           </Form.Group>
                           <Button variant="primary" type="submit">
                              Submit
                           </Button>
                        </Form>
                     </div>
                  </Col>
                  <Col md={5}>
                     <div className="contact-us-form contact-form">
                        <ul>
                           <li className="phone">
                              <span className="contact-us-sub">Phone:</span>
                              <span className="contact-dec">
                                 <Link href="#">
                                    <a>040-22 66 66 66</a>
                                 </Link>
                              </span>
                           </li>
                           <li className="email">
                              <span className="contact-us-sub">Email:</span>
                              <span className="contact-dec">
                                 <Link href="#" ><a>ts-bpass-support@telangana.gov.in</a></Link>
                              </span>
                           </li>
                           <li className="address">
                              <span className="contact-us-sub">Address</span>
                              <span className="contact-dec">
                                 <span>Directorate of Town and Country Planning</span>
                                 <span>Governament of Telangana,</span>
                                 <span>3rd to 5th Floor</span>
                                 <span>640,AC Guards Opp: PTI Building</span>
                                 <span>Hyderabad - 500004</span>
                              </span>
                           </li>
                           <li className="hours">
                              <span className="contact-us-sub">Hours of Operations</span>
                              <span className="contact-dec">
                                 10:00am to 6:00pm IST
                              </span>
                           </li>
                        </ul>
                     </div>
                  </Col>
               </Row>
            </div>
         </Container>
      </section>
   )
}
export default Contact;