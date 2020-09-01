import React, { useState } from 'react';
import Link from 'next/link';
import { Row, Col, Navbar, Nav, Form, FormControl, Button, Container, Modal } from 'react-bootstrap';
import { Language, LanguageMinus, LanguageList, LanguagePlus, AngleBottom } from '../../utils/icons';
import ApplyModal from './ApplyModal';
import LanguageModal from './LanguageModal';
function Header1(props) {
   const [modalShow, setModalShow] = React.useState(false);
   const [languagemodalShow, setLanguageModalShow] = React.useState(true);

   return (
      <Navbar className="header2" expand="lg">
         <div className="first-block">
            <Container className="header-container">
               <Row>
                  <Col md={6}>
                     <div className="left-content">
                        <p>May 29, 2020 10:24 pM</p>
                     </div>
                  </Col>
                  <Col md={6}>
                     <div className="right-content">
                        <ul>
                           <li><Link href="/">040-2331 4622</Link></li>
                           <li><Link href="/">FAQs</Link></li>
                           <li><Link href="/">Support</Link></li>
                           <li className="language-block" onClick={() => setLanguageModalShow(true)}>
                              <span>language</span>
                              <svg className="Language" dangerouslySetInnerHTML={{ __html: Language }} />
                           </li>
                           <li className="language-plus">
                              <Link href="/"><svg className="Language12" dangerouslySetInnerHTML={{ __html: LanguageMinus }} /></Link>
                              <Link href="/"><svg className="Language3" dangerouslySetInnerHTML={{ __html: LanguageList }} /></Link>
                              <Link href="/"><svg className="Language4" dangerouslySetInnerHTML={{ __html: LanguagePlus }} /></Link>
                           </li>
                        </ul>
                     </div>
                  </Col>
               </Row>
            </Container>
         </div>
         <div className="second-block">
            <Container className="header-container">
               <div className="menu-block">
                  <Navbar.Brand href="#home" className="logo-wrapper"><img src="html/images/header/logo.png" className="image1" alt="" /></Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav" className="menu-link-block">
                     <Nav className="ml-auto">
                        <Nav.Link className="active">Home</Nav.Link>
                        <Nav.Link>About TS-bPASS</Nav.Link>
                        <Nav.Link>Resources  <svg dangerouslySetInnerHTML={{ __html: AngleBottom }} /></Nav.Link>
                        <Nav.Link>Departments  <svg dangerouslySetInnerHTML={{ __html: AngleBottom }} /></Nav.Link>
                        <Nav.Link>Citizen Login</Nav.Link>
                        <Nav.Link className="apply-now" onClick={() => setModalShow(true)}>
                           Apply Now <svg dangerouslySetInnerHTML={{ __html: AngleBottom }} />
                        </Nav.Link>
                     </Nav>
                  </Navbar.Collapse>
               </div>
            </Container>
         </div>
         <ApplyModal
            show={modalShow}
            onHide={() => setModalShow(false)}
         />
         <LanguageModal
            show={languagemodalShow}
            onHide={() => setLanguageModalShow(false)}
         />
      </Navbar >
   )
}
export default Header1;