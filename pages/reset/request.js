import React, { useState } from 'react';
import Link from 'next/link';
import { Container, Form, Button } from 'react-bootstrap';
import { AngleRight, HideIcon, EyesShow } from '../../utils/icons';

import { getTranslatedText } from '../../utils/translationUtils';

import Header from '../../components/common/Header'

import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/front.css';


function Request(props) {
  return (
    <>
      <Header />
      <section className="verification-details-wrapper">
        <Container>
          <div className="verification-details-block p-65">
            <div className="reset-password-from text-center p-98">
              <div className="main-title">
                <h3>{getTranslatedText('heading.reset_your_password')}</h3>
              </div>
              <div className="mobile-verification">
                <div className="otp-title">
                  <h6>{getTranslatedText('heading.reset_your_password_info')} </h6>
                  {/* <p>mobile number</p> */}
                </div>
                <div className="reset-password mobile-new-password">
                  <Form>
                    <Form.Group controlId="phonenumber" className="mb-0 text-left">
                      <Form.Label>{getTranslatedText('label.login_mobile_number')}</Form.Label>
                      <div className="mobile-number-block">
                        <span>+91</span>
                        <Form.Control
                          type="number"
                          name="mobile"
                          maxLength={10} />
                      </div>
                    </Form.Group>
                    <Button>
                      <span>{getTranslatedText('label.send_otp')}</span>
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

export default Request;