import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { AngleRight } from '../../utils/icons';
import Header from '../../components/Header';
import Footer from "../../components/footer";
import ApplicationProvider from '../../context/application-provider';
import { getTranslatedText } from '../../utils/translationUtils';

import Applicant from '../../components/application/Applicant';
import PlotDetails from '../../components/application/Plot';
import BuildingDetails from '../../components/application/Building';
import VicinityDetails from '../../components/application/Vicinity';
import ReviewSubmit from '../../components/application/Review';
import { convertToSqMeters } from '../../utils/convertionUtils'

import { useRouter } from 'next/router'

import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;
import { toast } from 'react-toastify';

import ContextApi from '../../context'

import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/front.css';
import ApplicationHeader from '../../components/common/ApplicationHeader';

function ApplicationForm(props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [plotArea, setPlotArea] = useState(0)
  const ContextValue = useContext(ContextApi);
  const router = useRouter()
  const { aid } = router.query


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep])

  useEffect(() => {
    setIsLoading(true)
    setPlotArea(localStorage.getItem('plot-area'))
    const authToken = localStorage.getItem('auth-token')
      // if(aid){
        if(aid === 'new'){
            setCurrentStep(1)
            setIsLoading(false)
        }else{
            axios.get(apiURL + apiConstants.APPLICATION.URL + `/${aid}`, {
                headers: {
                'Authorization': 'Bearer ' + authToken,
                'Accept' : '*/*'
                }
            })
            .then(async function (response) {
                if(response.data.success){
                    const resData = response.data.data;
                    localStorage.setItem('application-id', aid)
                    if(resData.completed_steps === 5){
                      // router.push('/dashboard')
                      setCurrentStep(5)
                    }else if(resData.completed_steps === 4){
                      // Review & Submit Section
                      // localStorage.setItem('property-id', resData.property_id)
                        setCurrentStep(5)
                    }else if(resData.completed_steps === 3){
                      // Vicinity Section
                      ContextValue.updateHeight(resData.height_in_meters)
                      ContextValue.updatePlotArea(parseInt(resData.actual_plot_area))
                      ContextValue.handlePlotAreaAsDoc(parseInt(resData.plot_area_as_per_document))
                      // localStorage.setItem('plot-area', parseInt(resData.actual_plot_area))
                      localStorage.setItem('property-id', resData.property_id)
                        setCurrentStep(4)
                    }else if(resData.completed_steps === 2){
                        // Building Details Section
                        await ContextValue.updatePlotArea(parseInt(resData.actual_plot_area))
                        await ContextValue.handlePlotAreaAsDoc(parseInt(resData.plot_area_as_per_document))
                        await ContextValue.handleDistMandal(resData.dist_code, resData.mandal_code)
                        await ContextValue.handlePlotAreaType(resData.plot_area_type)
                        console.log('fsfsdfsdfsdfsd', resData.actual_plot_area)
                        // localStorage.setItem('plot-area', parseInt(resData.actual_plot_area))
                        localStorage.setItem('property-id', resData.property_id)
                        setCurrentStep(3)
                    }else{
                        // Plot Details Section
                        setCurrentStep(2)
                        localStorage.setItem('application-id', aid)
                    }
                    // Set results state
                    setIsLoading(false)
                }else{
                    toast.error(response.data.message, {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                    });
                }
            })
            .catch(function (error) {
              // if(error.response){
              //   toast.error(error.response.data.message, {
              //     position: "top-right",
              //     autoClose: 5000,
              //     hideProgressBar: false,
              //   });
              // }
            })
        }
      // }
  }, [aid])

  return (
    <>
      <ApplicationHeader />
      <section className="personal-details-wrapper">
        <Container>
          <div className="personal-details-block p-65">

            <div className="details-tabs-wrapper">
              <ul>
                <li className={currentStep > 1 ? `completed`: 'active'}><span>{getTranslatedText('heading.applicant_details')}</span><p></p></li>
                <li className={currentStep === 2 ? `active`: currentStep > 2 ? `completed`: ''}><span>{getTranslatedText('heading.plot')}</span><p></p></li>
                <li className={currentStep === 3 ? `active`: currentStep > 3 ? `completed`: ''}><span>{getTranslatedText('heading.building')}</span><p></p></li>
                {/* {plotArea >= 63 && */}
                <li className={currentStep === 4 ? `active`: currentStep > 4 ? `completed`: ''}><span>{getTranslatedText('heading.vicinity')}</span><p></p></li> 
                {/*  } */}
                <li className={currentStep === 5 ? `active`: currentStep > 5 ? `completed`: ''}><span>{getTranslatedText('heading.review')}</span><p></p></li>
              </ul>
            </div>

        {isLoading?
            <div className="review-submit-loading">
              <Spinner animation="border" size="xlg" />
            </div>
         :
         <>
            <Applicant 
              currentStep={currentStep} 
              changeStep={(value) => setCurrentStep(value)}
            />

            <PlotDetails 
              currentStep={currentStep} 
              changeStep={(value) => setCurrentStep(value)}
            />

            <BuildingDetails 
              currentStep={currentStep} 
              changeStep={(value) => setCurrentStep(value)}
            />

            <VicinityDetails 
              currentStep={currentStep} 
              changeStep={(value) => setCurrentStep(value)}
            />

            <ReviewSubmit 
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
