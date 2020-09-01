import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { AngleRight } from '../../utils/icons';
import Footer from "../../components/footer";
import { useRouter } from 'next/router'

import FireSection from '../../components/applicationSw/fire'
import AirPortSection from '../../components/applicationSw/airport'
import TDRSection from '../../components/applicationSw/tdr'
import PoliceSection from '../../components/applicationSw/police'

import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/front.css';
import ApplicationHeader from '../../components/common/ApplicationHeader';

function ApplicationForm(props) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { aid } = router.query

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep])

  const tabs = ['Fire', 'Airport', 'TDR', 'Police'];

  return (
    <>
      <ApplicationHeader />
      <section className="personal-details-wrapper">
        <Container>
          <div className="personal-details-block p-65">

            <div className="details-tabs-wrapper for-sw">
              <ul>
                {tabs.map((tabName, index) => 
                    <li className={currentStep > index ? `completed`: 'active'}><span>{tabName}</span><p></p></li>
                )}
              </ul>
            </div>

        {isLoading?
            <div className="review-submit-loading">
              <Spinner animation="border" size="xlg" />
            </div>
         :
         <>
            <FireSection 
              currentStep={currentStep} 
              changeStep={(value) => setCurrentStep(value)}
            />
            <AirPortSection 
              currentStep={currentStep} 
              changeStep={(value) => setCurrentStep(value)}
            />
            <TDRSection
              currentStep={currentStep} 
              changeStep={(value) => setCurrentStep(value)}
            />
            <PoliceSection
              currentStep={currentStep} 
              changeStep={(value) => setCurrentStep(value)}
            />
          </> }
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
}

export default ApplicationForm;
