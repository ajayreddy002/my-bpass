import React, { useState } from 'react';
import Link from 'next/link';
import { Container, Form, Button } from 'react-bootstrap';
import { AngleRight, HideIcon, EyesShow } from '../../utils/icons';

import { LocalizationProvider } from 'react-localize';
import Header from '../../components/common/Header'
import { getLocalizationBundleForLanguage } from '../../utils/translationUtils';

import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/front.css';


function Verification(props) {

  const localizationProvider = getLocalizationBundleForLanguage('en');
  return (
    <LocalizationProvider messages={localizationProvider}>
      <>
        <Header />
        <section className="verification-details-wrapper">
          <Container>
            <div className="verification-details-block p-65">
            <div className="verification-details-from text-center p-98">
                <div className="main-title">
                  <h3>Mobile number Verification</h3>
                </div>
                <div className="mobile-verification">
                  <div className="otp-title">
                    <h6>Please enter the OTP received on </h6>
                    <p>+91 <span> 9014267607</span> </p>
                  </div>
                  <div className="one-time-password mobile-new-password">
                    <p>One time password</p>
                    <Form>
                      <div className="otp-number">
                        <Form.Control type="text" maxLength="1" id="digit-1" />
                        <Form.Control type="text" maxLength="1" id="digit-2" />
                        <Form.Control type="text" maxLength="1" id="digit-3" />
                        <Form.Control type="text" maxLength="1" id="digit-4" />
                      </div>
                      <Button>
                        <span>Verify</span>
                        <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleRight }} />
                      </Button>
                      <div className="bottom-link">
                        <span>Didn’t receive Code</span>
                        <Link href="/">
                          <a>Resend</a>
                        </Link>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </>
    </LocalizationProvider>
  );
}

export default Verification;