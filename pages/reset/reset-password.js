import React, { useState } from 'react';
import Link from 'next/link';
import { Container, Form, Button } from 'react-bootstrap';
import { AngleRight, HideIcon, EyesShow } from '../../utils/icons';

import { getTranslatedText } from '../../utils/translationUtils';

import Header from '../../components/common/Header'

import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/front.css';


function ResetPAssword(props) {
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {
      setPasswordShown(passwordShown ? false : true);
    };

  return (
      <>
        <Header />
        <section className="verification-details-wrapper">
          <Container>
            <div className="verification-details-block p-65">
                <div className="reset-password-from text-center p-98">
                    <div className="main-title">
                    <h3>Create new password</h3>
                    </div>
                    <div className="mobile-verification">
                    <div className="otp-title">
                        <h6>Enter your new password then your </h6>
                        <p>password change! Don’t forget again.</p>
                    </div>
                    <div className="reset-password mobile-new-password">
                        <Form>
                          <Form.Group controlId="Password" className="mb-0 text-left">
                              <Form.Label>Set Password</Form.Label>
                              <div className="password-text">
                              <Form.Control type={passwordShown ? "text" : "password"} placeholder="Your Password" />
                              {passwordShown ?
                                  <svg className="hide-show-icon" onClick={togglePasswordVisiblity} dangerouslySetInnerHTML={{ __html: HideIcon }} />
                                  :
                                  <svg className="hide-show-icon" onClick={togglePasswordVisiblity} dangerouslySetInnerHTML={{ __html: HideIcon }} />
                              }
                              </div>
                          </Form.Group>
                          <Form.Group controlId="Password" className="mb-0 text-left">
                              <Form.Label>Confirm Password</Form.Label>
                              <div className="password-text">
                              <Form.Control type="password" placeholder="Your Password" />
                              {/* {passwordShown ?
                                  <svg className="hide-show-icon" onClick={togglePasswordVisiblity} dangerouslySetInnerHTML={{ __html: HideIcon }} />
                                  :
                                  <svg className="hide-show-icon" onClick={togglePasswordVisiblity} dangerouslySetInnerHTML={{ __html: HideIcon }} />
                              } */}
                              </div>
                          </Form.Group>
                          <Button>
                              <span>Set Password</span>
                              <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleRight }} />
                          </Button>
                        </Form>
                    </div>
                    </div>
                </div>
            </div>
          </Container>
        </section>
      </>
  );
}

export default ResetPAssword;