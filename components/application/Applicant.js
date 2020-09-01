import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link';
import { Container, Form, Col, FormControl, Button, InputGroup, Spinner } from 'react-bootstrap';
import { AngleRight, AngleBottom, HideIcon } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;



const Applicant = ({
  currentStep,
  changeStep
}) => {
  const [relationTypes, setRelationTypes] = useState([]);
  const [applicantTypes, setApplicantTypes] = useState([]);
  const [panCardShow, setPanCardShow] = useState(false)
  const [passwordShown, setPasswordShown] = useState(false);
  const router = useRouter()
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const [authToken, setAuthToken] = useState(null);
  
const SignInSchema = Yup.object().shape({
  applicantName: Yup.string().required('Applicant Name is required'),
  relationType: Yup.string().required('Type is required'),
  relationName: Yup.string().required('Relation Name is required'),
  panNumber: Yup.string().min(6, 'Too Short!').max(10, 'Too Long!'),
  aadhaarNumber: Yup.string()
    .min(12, 'Aadhaar number min 12 digits')
    .max(12, 'Aadhaar number min 12 digits')
    .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, 'not valid format (0000 0000 0000)')
    .required('Aadhaar Number is Required'),
  mobileNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, {message: "Please enter valid number.", excludeEmptyString: false})
    .required('Mobile Number is required'),
  email: Yup.string().email(),
  password: !authToken && Yup.string().min(6, 'Too Short!').required('Password is required'),
  passwordConfirmation: !authToken && Yup.string()
   .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  contactAddress: Yup.string().required('Contact Address is required'),
});

  useEffect(() => {
    if(currentStep === 1){
      // localStorage.removeItem("auth-token")
      // localStorage.removeItem("application-id")
      // localStorage.removeItem("property-id")
      // localStorage.removeItem("plot-area")  
      setAuthToken(localStorage.getItem('auth-token'))
      axios.get(apiURL + apiConstants.RELATIONSHIP_TYPE.URL)
        .then(function (response) {
          console.log(response);
          // Set results state
          setRelationTypes(response.data.data.relationship_types);
          setApplicantTypes(response.data.data.application_type);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [currentStep])

  const relationTypeChange = (type) => {
    if(type === 'Represented by'){
      setPanCardShow(true)
    }else{
      setPanCardShow(false)
    }
    
  }

  return (
    <div className={`personal-details-from ${currentStep === 1 ? `` : `hide-form`}`}>
      <div className="main-title">
        <h3>{getTranslatedText('heading.personal_info')}</h3>
      </div>
        <Formik
          initialValues={{ 
            applicantType: '',
            applicantName: '',
            relationType: '',
            relationName: '',
            panNumber: '',
            aadhaarNumber: '',
            mobileNumber: '',
            email: '',
            password: '',
            contactAddress: ''
          }}
          validationSchema={SignInSchema}
          onSubmit={async (values, { setSubmitting }) => {
              
              const data = {
                "completed_steps": 1,
                "applicant_type": values.applicantType,
                "first_name": values.applicantName,
                "mobile": "91"+values.mobileNumber,
                "email": values.email,
                "password": values.password,
                "pan_number": values.panNumber,
                "aadhaar_number": values.aadhaarNumber,
                "relationship_type": values.relationType,
                "relationship_name": values.relationName,
                "contact_address": values.contactAddress
              }

              if(window.confirm('Details once saved cannot be edited. Do you want to continue?')){
                if(authToken){
                  const config = {
                    headers: {
                      'Authorization': 'Bearer ' + authToken,
                      'Accept' : '*/*'
                    }
                  };
                  await axios.post(apiURL + apiConstants.CITIZEN_APPLICATION.URL, data, config)
                  .then(function (response) {
                      console.log('fsfsd', response)
                    if(response.data.success){
                      localStorage.setItem('application-id', response.data.data.application.id)
                      // changeStep(2);
                      router.push(`/application/${response.data.data.application.id}`)
                    }else{
                      toast.error(response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                      });
                    }
                    setTimeout(() => {
                      setSubmitting(false);
                    }, 5000)
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                }else{
                  await axios.post(apiURL + apiConstants.APPLICATION.URL, data)
                  .then(function (response) {
                    if(response.data.success){
                      localStorage.setItem('auth-token', response.data.data.token)
                      localStorage.setItem('application-id', response.data.data.application.id)
                      // changeStep(2);
                      router.push(`/application/${response.data.data.application.id}`)
                    }else{
                      toast.error(response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                      });
                    }
                    setTimeout(() => {
                      setSubmitting(false);
                    }, 2000)
                  })
                  .catch(function (error) {
                    console.log(error);
                    setSubmitting(false);
                  });
                }
              }else{
                setSubmitting(false);
              }
              
          }}
        >
          {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              /* and other goodies */
          }) => (
            <Form className="login-form-type" onSubmit={handleSubmit} autoComplete="off">
              <Form.Group  className="document-box" >
                  <Form.Label htmlFor="inlineFormInputGroupUsername2">{getTranslatedText('label.applicant_name')}</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <div className="selected-box">
                        <Form.Control as="select"
                          name="applicantType" 
                          onChange={e => {
                            handleChange(e);
                            if (e.target.value.toLowerCase() === 'm/s') {
                              relationTypeChange('Represented by');
                              setFieldValue("relationType", 'Represented by');
                            } else {
                              relationTypeChange('');
                              setFieldValue("relationType", '');
                            }
                          }} 
                          onBlur={handleBlur}
                          value={values.applicantType}>
                          <option>{Object.entries(applicantTypes).length > 0 ? 'Select Type': 'Loading...'}</option>
                          {Object.entries(applicantTypes).length > 0 &&
                            Object.entries(applicantTypes).map(([key, value], index) => 
                            <option key={`applicant-types-${index}`} value={key} >{value}</option>
                           )
                          }
                        </Form.Control>
                        <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
                      </div>
                    </InputGroup.Prepend>
                    <Form.Control 
                      type="text"
                      name="applicantName" 
                      className={errors.applicantName && touched.applicantName && 'has-error'}
                      placeholder="First Name" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.applicantName} />
                  </InputGroup>
                      {errors.applicantName && touched.applicantName && <p>{errors.applicantName}</p>}
              </Form.Group>
              <Form.Group className="document-box">
                  <Form.Label htmlFor="inlineFormInputGroupUsername2">{getTranslatedText('label.relationship')}</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <div className="selected-box">
                        <Form.Control as="select"
                          name="relationType" 
                          onChange={(e) => {handleChange(e), relationTypeChange(e.target.value)}} 
                          onBlur={handleBlur}
                          value={values.relationType}>
                          <option>{Object.entries(relationTypes).length > 0 ? 'Select Type': 'Loading...'}</option>
                          {Object.entries(relationTypes).length > 0 &&
                          Object.entries(relationTypes).map(([key, value], index) => 
                          <option key={`relation-types-${index}`} value={key} >{value}</option>
                            )
                          }
                        </Form.Control>
                        <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleBottom }} />
                      </div>
                    </InputGroup.Prepend>
                    <FormControl 
                      type="text" 
                      name="relationName"
                      className={errors.relationName && touched.relationName && 'has-error'}
                      placeholder="Name" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.relationName} />
                  </InputGroup>
                  {errors.relationName && touched.relationName && <p>{errors.relationName}</p>}
                </Form.Group>
              {panCardShow &&
              <Form.Group controlId="pannumber">
                <Form.Label>{getTranslatedText('label.pan_number')}</Form.Label>
                <Form.Control 
                  type="text" 
                  name="panNumber" 
                  maxLength="10" 
                  className={errors.panNumber && touched.panNumber && 'has-error'}
                  placeholder="Enter Pancard Number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.panNumber} />
                  {errors.panNumber && touched.panNumber && <p>{errors.panNumber}</p>}
              </Form.Group> }
              <Form.Group controlId="aadharnumber">
                <Form.Label>{getTranslatedText('label.aadhaar_number')}</Form.Label>
                <Form.Control 
                  type="type" 
                  maxLength="12" 
                  name="aadhaarNumber" 
                  className={errors.aadhaarNumber && touched.aadhaarNumber && 'has-error'}
                  placeholder="0000 0000 0000"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.aadhaarNumber} />
                  {errors.aadhaarNumber && touched.aadhaarNumber && <p>{errors.aadhaarNumber}</p>}
              </Form.Group>
              <Form.Group controlId="phonenumber">
                <Form.Label>{getTranslatedText('label.mobile_number')}</Form.Label>
                <div className="mobile-number-block">
                  <span>+91</span>
                  <Form.Control
                    type="type"
                    maxLength="10" 
                    name="mobileNumber"
                    className={errors.mobileNumber && touched.mobileNumber && 'has-error'} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.mobileNumber} />
                </div>
                {errors.mobileNumber && touched.mobileNumber && <p>{errors.mobileNumber}</p>}
              </Form.Group>
              <Form.Group controlId="Email">
                <Form.Label>{getTranslatedText('label.email_id')} <span> (optional) </span></Form.Label>
                <Form.Control 
                  type="email" 
                  name="email"
                  className={errors.email && touched.email && 'has-error'} 
                  placeholder="Your email id" 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email} />
                  {errors.email && touched.email && <p>{errors.email}</p>}
              </Form.Group>
              {!authToken &&
              <>
                <Form.Group controlId="setpassword">
                    <Form.Label>{getTranslatedText('label.set_password')}</Form.Label>
                    <div className="password-text">
                      <Form.Control 
                        type={passwordShown ? "text" : "password"} 
                        name="password"
                        className={errors.password && touched.password && 'has-error'} 
                        placeholder="Your Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password} />
                        {errors.password && touched.password && <p>{errors.password}</p>}
                      <svg className="hide-show-icon" onClick={togglePasswordVisiblity} dangerouslySetInnerHTML={{ __html: HideIcon }} />
                    </div>
                </Form.Group>
                <Form.Group controlId="confirmpassword">
                    <Form.Label>{getTranslatedText('label.confirm_password')}</Form.Label>
                    <div className="password-text">
                      <Form.Control 
                        type={"password"} 
                        name="passwordConfirmation"
                        className={errors.passwordConfirmation && touched.passwordConfirmation && 'has-error'} 
                        placeholder="Your Confirm Password" 
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.passwordConfirmation} />
                        {errors.passwordConfirmation && touched.passwordConfirmation && <p>{errors.passwordConfirmation}</p>}
                    </div>
                </Form.Group>
              </> }
              <Form.Group controlId="Contact">
                <Form.Label>{getTranslatedText('label.contact_address')}</Form.Label>
                <Form.Control 
                      as="textarea" 
                      rows="3" 
                      name="contactAddress"
                      placeholder="Type your address" 
                      className={errors.contactAddress && touched.contactAddress && 'has-error'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.contactAddress} />
                      {errors.contactAddress && touched.contactAddress && <p>{errors.contactAddress}</p>}
              </Form.Group>
              <Button type="submit" disabled={isSubmitting}>
                <span>{getTranslatedText('button.save_continue')} </span>
                {isSubmitting?
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
            </Form>
          )}
      </Formik>
    </div>
  )
}


export default Applicant;
