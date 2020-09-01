import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { AngleRight, AngleBottom, MapIcon, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import NocPlotInfo from '../../containers/plot/noc-plotinfo'

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;

import ContextApi from '../../context'

const SignInSchema = Yup.object().shape({
  plotNo: Yup.string().required('This field is required'),
  // streetName: Yup.string().required('This field is required'),
  localityName: Yup.string().required('This field is required'),
  surveyName: Yup.string().required('This field is required'),
  villageName: Yup.string().required('This field is required'),
  plotAreaDoc: Yup.number().min(1, 'This field is required').required('This field is required'),
  plotAreaGrnd: Yup.number().min(1, 'This field is required')
  // .max(Yup.ref('plotAreaDoc'), "Plot area as on Ground should not be more than Plot area as per Document")
  .required('This field is required'),
  // plotAddress: Yup.string().required('This field is required'),
  // geoLocation: Yup.string().required('This field is required'),
  // frontPhoto: Yup.string().required('This field is required'),
  // backPhoto: Yup.string().required('This field is required'),
  // sidePhoto: Yup.string().required('This field is required'),
  // sideTwoPhoto: Yup.string().required('This field is required'),

  // additionalPhoto: Yup.string().required('This field is required'),
});

const NocPlot = ({
  currentStep,
  changeStep
}) => {

  const [houseType, setHouseType] = useState([])
  const [localityType, setLocalityType] = useState([])
  const [surveyType, setSurveyType] = useState([])
  const [questions, setQuestions] = useState([]);
  const ContextValue = useContext(ContextApi);

  useEffect(() => {
    const authToken = localStorage.getItem('auth-token');

    if(authToken && currentStep === 2){
        axios.get(apiURL + apiConstants.PLOT_ENUMS.URL, {
          headers: {
            Authorization: 'Bearer ' + authToken
          }
        })
        .then(function (response) {
          setHouseType(response.data.data.house_no_type);
          setLocalityType(response.data.data.locality_type);
          setSurveyType(response.data.data.plot_land_type);
        })
        .catch(function (error) {
          console.log(error);
        });

        axios.get(apiURL + apiConstants.QUESTIONS.URL, {
          params: {
            category: 'plot'
          },
          headers: {
            'Authorization': 'Bearer ' + authToken,
            'Accept' : '*/*'
          }
        })
        .then(function (response) {
          // Set results state
          setQuestions(response.data.data.questions)
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [currentStep])

  const formik = useFormik({
    initialValues:{ 
      plotType: 'Plot_no',
      plotNo: "",
      streetType: 'Street_no',
      streetName: "",
      colonyType: 'Locality',
      localityName: "",
      surveyType: 'Survey_no',
      surveyName: "",
      locationId: 0, 
      villageName: "",
      plotAddress: "",
      geoLocation: "",
      plotAreaType: "Sq. Yards",
      plotArea: 0,
      plotAreaGround: 0,
      plotAreaDoc: 0,
      plotAreaGrnd: 0,
      frontPhoto: "",
      backPhoto:"",
      sidePhoto:"",
      sideTwoPhoto:"",
      additionalPhoto:"",
      slumID: null,
      slumOther: null,
      questionAnswers: [],
      tslrDocument: ""
    },
    validationSchema:SignInSchema,
    onSubmit:async (values, { setSubmitting }) => {

      const authToken = localStorage.getItem('auth-token');
      const applicationId = localStorage.getItem('application-id');
      // if (values.surveyType === 'Town Survey No' && !values.tslrDocument) {
      //   toast.error('Please upload TSLR Document', {
      //     position: "top-right",
      //     autoClose: 5000,
      //     hideProgressBar: false,
      //   });
      //   return;
      // }

        if(ContextValue.applicationType !== 'REG'){
          if(values.northRoadwidth === 0 && values.southRoadWidth === 0 && values.eastRoadWidth === 0 && values.westRoadWidth === 0){
            toast.error('Please enter at least one road with in Schedule of Boundaries', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
            });
            return ;
          }
        }
        if(authToken && applicationId ){
          const data = {
            "completed_steps": 2,
            "application_id": applicationId,
            "location_id": values.locationId,
            "house_no_type": values.plotType,
            "house_no_value": values.plotNo,
            "street": values.streetName,
            "locality_type": values.colonyType,
            "locality_value": values.localityName,
            "plot_address": `${values.plotNo}, ${values.streetName}, ${values.localityName}, ${values.surveyName}, ${values.villageName}${values.villageName.includes('Circle')? `` : `(V)`}, ${values.circle? `${values.circle},` : ``} ${values.zone? `${values.zone},` : ``} ${values.mandalZone}${values.villageName.includes('Circle')? `` : `(M)`},  ${values.municiPality},  ${values.district}${values.villageName.includes('Circle')? `` : `(Dist)`}.`,
            "geo_coordinates": values.geoLocation.toString(),
            "plot_land_type": values.surveyType,
            "plot_land_value": values.surveyName,
            "plot_area_type": values.plotAreaType,
            "plot_area_as_per_document": values.plotArea,
            "plot_area_as_per_ground": values.plotAreaGround,
            "actual_plot_area": values.plotArea > values.plotAreaGround?values.plotAreaGround : values.plotArea,
            "slum_areas_id": values.slumID === 'Other'? null : values.slumID,
            "slum_areas_name": values.slumOther,
            "building_type": "NEW",
            "application_answers": values.questionAnswers,
            "tslr_document": values.tslrDocument,
          }
          
          const config = {
            headers: {
              'Authorization': 'Bearer ' + authToken,
              'Accept' : '*/*'
            }
          };
            if(window.confirm('Details once saved cannot be edited. Do you want to continue?')){
              await axios.post(apiURL + apiConstants.PLOT_POST.URL, data, config)
              .then(function (response) {
                // console.log('response', response);
                if(response.data.success){
                  localStorage.setItem('property-id', response.data.data.property.id)
                    changeStep(3);
                }else{
                  toast.error(response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                  });
                }
              })
              .catch(function (error) {
                toast.error(error.response.data.message, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                });
              });
            }
          }else{
            toast.error('Something went wrong', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
            });
          }
          setTimeout(() => {
            // alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
      
        // changeStep(3);
    }
  });

  const customHandleChange = (name, value) => {
    formik.setFieldValue(name, value);
  }

  // console.log('formdata', this.state.values)
  return  (
    <ContextApi.Consumer>
      {value =>
      <>
      <div className={`personal-details-from ${currentStep === 2 ? `` : `hide-form`}`}>
        <div className="main-title">
          <h3>{getTranslatedText('heading.plot_info')}</h3>
        </div>
          <Form className="login-form-type" onSubmit={formik.handleSubmit} autoComplete="off">
            
            <NocPlotInfo 
                values={formik.values}
                errors={formik.errors}
                touched={formik.touched}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur} 
                customHandleChange={customHandleChange}
                houseType={houseType}
                localityType={localityType}
                surveyType={surveyType}
              />

            {/* <div className="personal-deatails-buttons">
              <div className="back-btn" onClick={() => changeStep(1)}>
                <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleLeft }} />
                <span>{getTranslatedText('button.back')}</span>
              </div> */}
                <Button type="submit" disabled={formik.isSubmitting || value.disablePlotSubmit}>
                  <span>{getTranslatedText('button.save_continue')} </span>
                  {formik.isSubmitting?
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  :
                  <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleRight }} /> }
                </Button>
            {/* </div> */}
          </Form>
      </div>
    </>
  } 
  </ContextApi.Consumer>
  )
}


export default NocPlot;