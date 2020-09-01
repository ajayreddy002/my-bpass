import React, { useState, useEffect } from 'react';
import Router , {useRouter}  from 'next/router';
import Link from 'next/link';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { HideIcon, AngleRight } from '../../utils/icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { toast } from 'react-toastify';

import { getURL } from '../../utils/urlUtils';
import { getTranslatedText } from '../../utils/translationUtils';

import apiConstants from '../../constants/apiConstants';
import Header from '../../components/common/Header'
const apiURL = require('../../config/url-front').API_SERVER;

import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/front.css';

const backimg = `url('/html/images/register/bg.png')`;

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const SignInSchema = Yup.object().shape({
   mobile: Yup.string()
      .min(10, 'Phone number is not valid')
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Required'),
   password: Yup.string()
      .min(6, 'Too Short!')
      .max(20, 'Too Long!')
      .required('Required'),
});

function Login(props) {
   const router = useRouter()
   const [passwordShown, setPasswordShown] = useState(false);
   const togglePasswordVisiblity = () => {
      setPasswordShown(passwordShown ? false : true);
   };
   useEffect(() => {
      const authToken = localStorage.getItem('auth-token')
   
      if(authToken){
         router.push('/dashboard')
      }
     }, [])

   return (
         <div className="login-register-box">
            <Header />
            <section className="login-register-wrapper">
               <div className="login-register-block">
                  <Row>
                     <Col md={6} className="login-register-content">
                        <div className="left-content">
                           <div className="login-register-form">
                              <div className="login-register-tabs">
                                 <div className="main-title">
                                    {/* <h3>{getTranslatedText('heading.login_heading')}</h3>
                                    <p>{getTranslatedText('heading.login_info')}</p> */}
                                 </div>
                                 {/* <div className="main-title">
                              <h3>Register to TS-bPass</h3>
                              <p>Register to TS-bPass and keep track of your Application update and progress.</p>
                           </div> */}
                                 <Tabs>
                                    <TabList>
                                       <Tab>{getTranslatedText('label.login')}</Tab>
                                       {/* <Tab>{getTranslatedText('label.register')}</Tab> */}
                                    </TabList>

                                    <TabPanel>
                                       <Formik
                                          initialValues={{ mobile: '', password: '' }}
                                          validationSchema={SignInSchema}
                                          onSubmit={async (values, { setSubmitting }) => {

                                             const data = {
                                                "mobile": "91" + values.mobile,
                                                "password": values.password,
                                                "grant_type": "password"
                                             };
                                             
                                             await axios.post(apiURL + apiConstants.USER_LOGIN.URL, data)
                                              .then(function (response) {
                                                if(response.data.success){
                                                   localStorage.setItem('auth-token', response.data.data.token)
                                                   router.push('/dashboard')
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
                                              
                                             setTimeout(() => {
                                                // alert(JSON.stringify(values, null, 2));
                                                setSubmitting(false);
                                             }, 400);
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
                                             /* and other goodies */
                                          }) => (
                                                <Form className="login-form-type" onSubmit={handleSubmit}>
                                                   <Form.Group controlId="phonenumber">
                                                      <Form.Label>{getTranslatedText('label.login_mobile_number')}</Form.Label>
                                                      <div className="mobile-number-block">
                                                         <span>+91</span>
                                                         <Form.Control
                                                            type="number"
                                                            name="mobile"
                                                            className={errors.mobile && touched.mobile && 'has-error'}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.mobile} />
                                                            {errors.mobile && touched.mobile && <p>{errors.mobile}</p>}
                                                      </div>
                                                   </Form.Group>
                                                   <Form.Group controlId="Password">
                                                      <Form.Label>{getTranslatedText('label.password')}</Form.Label>
                                                      <div className="password-text">
                                                         <Form.Control
                                                            type={passwordShown ? "text" : "password"}
                                                            placeholder="Your Password"
                                                            name="password"
                                                            className={errors.password && touched.password && 'has-error'}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.password} />

                                                         {passwordShown ?
                                                            <svg className="hide-show-icon" onClick={togglePasswordVisiblity} dangerouslySetInnerHTML={{ __html: HideIcon }} />
                                                            :
                                                            <svg className="hide-show-icon" onClick={togglePasswordVisiblity} dangerouslySetInnerHTML={{ __html: HideIcon }} />
                                                         }
                                                      </div>
                                                      {errors.password && touched.password && <p>{errors.password}</p>}
                                                   </Form.Group>
                                                   <Button type="submit" disabled={isSubmitting}>
                                                      <span> {getTranslatedText('label.login')} </span>
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
                                       <div className="bottom-link">
                                          <span>{getTranslatedText('label.forgot_password')}?</span>
                                          <Link href="/reset/request">
                                             <a>{getTranslatedText('label.reset')}</a>
                                          </Link>
                                       </div>
                                    </TabPanel>
                                    {/* <TabPanel>
                                       <Form className="login-form-type">
                                          <div className="register-name-type">
                                             <Form.Group controlId="firstname">
                                                <Form.Label>{getTranslatedText('label.firstname')}</Form.Label>
                                                <Form.Control type="text" placeholder="First name" />
                                             </Form.Group>
                                             <Form.Group controlId="lastname">
                                                <Form.Label>{getTranslatedText('label.lastname')}</Form.Label>
                                                <Form.Control type="type" placeholder="Last name" />
                                             </Form.Group>
                                          </div>
                                          <Form.Group controlId="phonenumber">
                                             <Form.Label>{getTranslatedText('label.mobile_number')}</Form.Label>
                                             <div className="mobile-number-block">
                                                <span>+91</span>
                                                <Form.Control
                                                   type="number"
                                                   name="mobile" />
                                             </div>
                                          </Form.Group>
                                          <Form.Group controlId="Email">
                                             <Form.Label>{getTranslatedText('label.email_address')} <span> (optional) </span></Form.Label>
                                             <Form.Control type="email" placeholder="email" />
                                          </Form.Group>

                                          <Form.Group controlId="setpassword">
                                             <Form.Label>{getTranslatedText('label.set_password')}</Form.Label>
                                             <div className="password-text">
                                                <Form.Control type={passwordShown ? "text" : "password"} placeholder="Your Password" />
                                                <svg className="hide-show-icon" onClick={togglePasswordVisiblity} dangerouslySetInnerHTML={{ __html: HideIcon }} />
                                             </div>
                                          </Form.Group>
                                          <Button>
                                             <span> {getTranslatedText('label.register')}</span>
                                             <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleRight }} />
                                          </Button>
                                       </Form>
                                    </TabPanel> */}
                                 </Tabs>
                              </div>
                           </div>
                        </div>
                     </Col>
                     <Col md={6} className="login-register-image">
                        <div className="right-img" style={{ backgroundImage: backimg }}>
                        </div>
                     </Col>
                  </Row>
               </div>
            </section>
         </div>
   );
}

export default Login;