import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Form, Spinner } from 'react-bootstrap';
import Header from '../../components/common/Header';
import Footer from "../../components/footer";
import { ArrowLeft, AngleRight, Check, Print } from "../../utils/icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/front.css';

import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;


function PaymentProceed(props) {

  const [paid, setPaid] = useState(false);
  const [agree, setAgree] = useState(false)
  const [appID, setAppID] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
      window.scrollTo(0, 0);
        setAppID(localStorage.getItem('application-id'))
    }, [])
  
   const downloadAcknowledgement = () => {
      const authToken = localStorage.getItem('auth-token');
      if(authToken){
         setIsLoading(true)
         axios.post(apiURL + apiConstants.APPROVAL_LETTER_DTCP.URL + '?application_id=' + appID, {'application_id': appID}, {
            headers: {
               'Authorization': 'Bearer ' + authToken,
               'Accept' : '*/*'
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
         <Header />
         <div className="payment-peoceed-wrapper">
         {paid?
            <div className="payment-peoceed-successfully">
                <div className="peoceed-content">
                <h4>Congratulations, You have been sucessfully registered under TS-bPASS, Please download your Certificate of Registration</h4>
                <h4>Rs. 10,000 will be added in next property tax assessment</h4>
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
                     <span>Download Acknowledgement </span> }
                  </Button>
                </div>
            </div>
         :
            <div className="payment-peoceed">
               <div className="payment-peoceed-box">
                  <h5 className="peoceed-title">Payment</h5>
                  <div className="peoceed-content">
                     <h4>Application ID : {appID && appID}</h4>
                     <h4>Total Amount to be paid : <span>Rs.10,000.OO</span></h4>
                  </div>

               </div>
               <Button onClick={() => setPaid(true)} disabled={!agree}>
                  <span>Proceed</span>
               </Button>
            </div>
        }
        </div>
        <Footer />
      </>
   );
}

export default PaymentProceed;