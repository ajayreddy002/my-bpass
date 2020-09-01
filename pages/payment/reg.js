import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Form, Spinner } from 'react-bootstrap';
import Header from '../../components/Header';
import Footer from "../../components/footer";
import { ArrowLeft, AngleRight, Check, Print } from "../../utils/icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/front.css';

import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;
import ApplicationHeader from '../../components/common/ApplicationHeader';

function PaymentProceed(props) {

  const [paid, setPaid] = useState(true);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [agree, setAgree] = useState(false)
  const [appID, setAppID] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [AppIdentifier, setAppIdentifier] = useState(0)

    useEffect(() => {
      window.scrollTo(0, 0);
        setAppID(localStorage.getItem('application-id'))
         setAppIdentifier(localStorage.getItem('app-identifier'))
    }, [])

   const handlePayment = async () => {
      setIsPaymentLoading(true);
      const authToken = localStorage.getItem('auth-token');
      const applicationId = localStorage.getItem('application-id');

      if(authToken && applicationId){
         const config = {
            headers: {
               'Authorization': 'Bearer ' + authToken,
               'Accept' : '*/*'
            }
         };
   
         const data = {
         "id": applicationId,
         "status": {
            "status":"verification_under_progress"
          }
         }
         await axios.put(apiURL + apiConstants.APPLICATION_STATUS_UPDATE.URL + `/${applicationId}`, data, config)
         .then(function (response) {
               setIsPaymentLoading(false);
               setPaid(true)
         })
         .catch(function (error) {
            console.log('erroreee', error);
            setIsLoading(false)
            if(error.response){
               toast.error(error.response.data.message, {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               });
            }
         })
      }else{
         toast.error('Application ID OR Auth Token Missing', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
         });
      }
      // router.push('/self-certification-application/paynimoPayment')
   }
  
   const downloadAcknowledgement = () => {
      const authToken = localStorage.getItem('auth-token');
      if(authToken){
         setIsLoading(true)
         axios.get(apiURL + apiConstants.ACKOWLEDGEMENT_LETER.URL, {
            headers: {
               'Authorization': 'Bearer ' + authToken,   
               'Accept' : '*/*'
            },
            params: {
               application_id: appID
            }
         })
         .then(function (response) {
            if(response.data.data.status === 'success'){
               const fileURL = String(response.data.data.data.file_url);
               window.open(fileURL, "_blank");
            }else{
               toast.error(response.data.message, {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               });
            }
            setIsLoading(false)
         })
         .catch(function (error) {
            if(error.response){
               toast.error(error.response.data.message, {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               });
            }
            setIsLoading(false)
         })
      }
   }

   return (
      <>
         <ApplicationHeader />
         <div className="payment-peoceed-wrapper">
         {paid?
            <div className="payment-peoceed-successfully">
                <div className="peoceed-content">
                <h4>Congratulations, You have been sucessfully registered under TS-bPASS, Please download your Certificate of Registration</h4>
                {/* <h4>Rs. 1 will be added in next property tax assessment</h4> */}
                  <Button type="submit" onClick={downloadAcknowledgement} disabled={isLoading}>
                     {isLoading ?
                     <>
                        <span>Downloading  </span>
                        <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                     </>:
                     <span>Download Certificate of Registration </span> }
                  </Button>
                </div>
            </div>
         :
            <div className="payment-peoceed">
               <div className="payment-peoceed-box">
                  <h5 className="peoceed-title">Payment</h5>
                  <div className="peoceed-content">
                     <h4>Application ID : {AppIdentifier && AppIdentifier}</h4>
                     <h4>Total Amount to be paid : <span>Rs.1.OO</span></h4>

                     <Form.Check
                        type='checkbox'
                        id="Agreeto"
                        label='l/We Agree to include the registration fee of ONE RUPEE in my/our first property tax assessment'
                        defaultChecked={agree}
                        onChange={() => setAgree(!agree)}
                     />
                  </div>

               </div>
               <Button onClick={handlePayment} disabled={!agree}>
                  {isPaymentLoading ?
                     <>
                        <span>Procesing...  </span>
                        <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />
                     </>:
                  <span>Proceed </span> }
               </Button>
            </div>
        }
        </div>
        <Footer />
      </>
   );
}

export default PaymentProceed;