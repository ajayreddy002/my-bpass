import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Router , {useRouter}  from 'next/router';
import Link from 'next/link';
import { Container, Button, Table, Spinner } from 'react-bootstrap';
import ApplicationHeader from '../../components/common/ApplicationHeader';
import Footer from "../../components/footer";
import { ArrowLeft, AngleRight, Check, Print } from "../../utils/icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/front.css';

import {
   PAYNIMO_MERCHANT_ID,
   PAYNIMO_SCHEME
 } from '../../config/url';
import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;


function Payment(props) {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [feeDetails, setFeeDetails] = useState(false);
   const [appID, setAppID] = useState(0)
   const [AppIdentifier, setAppIdentifier] = useState(0)

  useEffect(() => {
   window.scrollTo(0, 0);
   const authToken = localStorage.getItem('auth-token');
   const ApplicationId = localStorage.getItem('application-id');
   setAppID(ApplicationId);
   const Identifier = localStorage.getItem('app-identifier');
   setAppIdentifier(Identifier);

     if(authToken && ApplicationId ){
         setIsLoading(true)
         axios.get(apiURL + apiConstants.FEE_DETAILS.URL, {
            headers: {
               'Authorization': 'Bearer ' + authToken,
               'Accept' : '*/*'
            },
            params:{
               'application_id': ApplicationId
            }
         })
         .then(function (response) {
            if(response.status === 200){ 
               setFeeDetails(response.data)
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
      }
  }, [])

  const handlePayment = async () => {
     console.log('handle payment')
   const data = {
     application_id: appID,
     payment_method: "online",
     amount: 10000,
     is_advance_payment: true
   }

   const authToken = localStorage.getItem('auth-token')
   const config = {
      headers: {
        'Authorization': 'Bearer ' + authToken,
        'Accept' : '*/*'
      }
    };
    await axios.post(apiURL + apiConstants.PAYNIMO_NEW_PAYMENT.URL, data, config)
    .then(async function (response) {
        console.log('fsfsd', response)
      if (response && response.status === 200) {
         const { transactionId, status, amount, hash } = await response.data.data;
         if(status === 'initiated') {
            console.log('statusss', status)
            const configJson = {
               'tarCall': false,
               'features': {
                   'showPGResponseMsg': true,
                   'enableAbortResponse': true,
                   'enableExpressPay': true,
                   'enableNewWindowFlow': true
               },
               'consumerData': {
                   'deviceId': 'WEBSH1',
                   'token': 'bddfbd8c2288d0f4a1b7652f0d516e9cef3c61879c5c6804f9be0d31cce06d66',
                   'returnUrl': '/payment/response',
                   'paymentMode': 'all',
                   'merchantId': 'T516938',
                   'consumerId': 'c964634',
                   'merchantLogoUrl': '/html/images/logo.png',
                   'currency': 'INR',
                   'consumerMobileNo': '9912225944',
                   'txnId': '2_1',
                   'items': [{
                       'itemId': PAYNIMO_SCHEME,
                       'amount': 150,
                       'comAmt': '0'
                   }],
                   'customStyle': {
                       'PRIMARY_COLOR_CODE': '#FF0084',
                       'SECONDARY_COLOR_CODE': '#FFFFFF',
                       'BUTTON_COLOR_CODE_1': '#FF0084',
                       'BUTTON_COLOR_CODE_2': '#FFFFFF'
                   }
                }
             };
             $.pnCheckout(configJson);
            
         }else{
            toast.error(response.data.message, {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
            });
         }
      }
    })
    .catch(function (error) {
      console.log(error);
    });

 }

//   const handlePayment = async () => {
//    setIsPaymentLoading(true);
//    const authToken = localStorage.getItem('auth-token');
//    const applicationId = localStorage.getItem('application-id');
//    if(authToken && applicationId){
//       const config = {
//       headers: {
//          'Authorization': 'Bearer ' + authToken,
//          'Accept' : '*/*'
//       }
//       };

//       const data = {
//       "id": applicationId,
//       "status": 'verification_under_progress'
//       }
//       await axios.put(apiURL + apiConstants.APPLICATION_STATUS_UPDATE.URL + `/${applicationId}`, data, config)
//       .then(function (response) {
//          setIsPaymentLoading(false);
//          setPaid(true)
//       })
//       .catch(function (error) {
//          console.log('erroreee', error);
//          setIsLoading(false)
//          if(error.response){
//             toast.error(error.response.data.message, {
//             position: "top-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             });
//          }
//       })
//    }else{
//       toast.error('Application ID OR Auth Token Missing', {
//          position: "top-right",
//          autoClose: 5000,
//          hideProgressBar: false,
//       });
//    }
//    // router.push('/self-certification-application/paynimoPayment')
//   }
   
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

  
  const LabelContent = {
   betterment_and_external_betterment_charges: 'Betterment & External Betterment Charges ( On built up area)',
   betterment_charges: 'Betterment Charges',
   building_permit_fee: 'Building Permit Fee',
   built_up_area_charges: 'Development Charges on built up area(As per   G.O. Ms. No.225, dt: 30.08.2016 , G.O. Ms No. 226 and dt: 30.08.2016 ,G.O. Ms No. 223, dt: 30.08.2016)',
   compound_wall_fee: 'Compound wall',
   debris_charges: 'Debris Charges',
   development_charges_on_built_up_area: 'Development Charges on built up area(As per   G.O. Ms. No.225, dt: 30.08.2016 , G.O. Ms No. 226 and dt: 30.08.2016 ,G.O. Ms No. 223, dt: 30.08.2016)',
   external_betterment_charges: 'External Betterment Charges',
   postage_advertisement_charges: 'Postage/Advertisement Charges',
   processing_fee: 'Processing Fee',
   rain_water_harvesting_charges: 'Rain Water Harvesting Charges',
   site_approval: 'Site Approval Charges',
   vacant_land_tax: 'Vacant Land tax (VLT)'
  }

   return (
      <div className="payment-methods">
         <Head>
            <script src="https://www.paynimo.com/paynimocheckout/client/lib/jquery.min.js"></script>
            <script src="https://www.paynimo.com/Paynimocheckout/server/lib/checkout.js"></script>
            <link rel="stylesheet" href="https://www.paynimo.com/Paynimocheckout/server/css/paynimo-icons.css" type="text/css"></link>
            <link rel="stylesheet" href="https://www.paynimo.com/Paynimocheckout/server/css/checkout.css" type="text/css"></link>
            <script type="text/javascript" src="https://www.paynimo.com/Paynimocheckout/server/lib/checkout-ui.js"></script>
        </Head>
         <ApplicationHeader />
         {!paid?
         <div className="payment-wrapper p-98">
            <Container>
               <div className="payment-box">
                  <div className="payment-title">
                     <div className="main-title">
                        <h3>Payment</h3>
                        <h6>
                           <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: ArrowLeft }} />
                           Back To Application</h6>
                     </div>
                     <h5>Application ID : <span>{AppIdentifier}</span></h5>
                  </div>
                  {isLoading?
                  <div className="payment-content-block">
                     <div className="review-submit-loading">
                        <Spinner animation="border" size="xlg" />
                     </div>
                  </div>:
                  <div className="payment-content-block">
                     {feeDetails ?
                     <>
                     <div className="payment-table mb-0">
                        <div className="payment-first-block">
                           <tr>
                              <th>Fee Description</th>
                              <th>Amount</th>
                           </tr>
                        </div>
                        <div className="payment-second-block">
                           {Object.entries(LabelContent).length > 0 &&
                              Object.entries(LabelContent).map(([key, value], index) => {
                                 if(feeDetails[key] !== 0){
                                    return ( 
                                       <tr>
                                          <td>{value}</td>
                                          <td>₹ {feeDetails[key]}</td>
                                       </tr> 
                                    )
                                 }
                              })
                           }
                           
                        </div>
                     </div>
                     <div className="payment-third-block">
                        <h5>Total Amount to be paid :<span>₹ {feeDetails.total_fee}</span></h5>
                        <Button onClick={() => handlePayment() } >
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
                           <>
                              <span>Proceed to Pay</span>
                              <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleRight }} />
                           </> }
                        </Button>
                     </div>
                     </>:
                     <h4>Fee Details not available </h4> }
                  </div> }
               </div>
            </Container>
         </div>
         :
         <div className="payment-successful-wrapper p-65 p-98">
            
            <div className="payment-successful-box">
               <div className="payment-successful-icon">
                  <svg className="check-icon" dangerouslySetInnerHTML={{ __html: Check }} />
                  <h5>Your Application Under Processing.</h5>
                  <h6>Application ID : <span>{AppIdentifier}</span></h6>
                <div className="peoceed-content">
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
            </div>
            {/* <div className="payment-print-btn">
               <Button>
                  <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: Print }} />
                  <span>Print</span>
               </Button>
            </div>
            <div className="payment-successful-box">
               <div className="payment-successful-icon">
                  <svg className="check-icon" dangerouslySetInnerHTML={{ __html: Check }} />
                  <h5>Payment Successful</h5>
                  <h6>Transaction Id: <span>TSB154896456485 </span></h6>
               </div>
               <div className="payment-successful-content">
                  <Table>
                     <tbody>
                        <tr>
                           <td>Paid to :</td>
                           <td>Application ID : 2699/ADIL/0146/2020 <span>Saikiran K</span></td>
                        </tr>
                        <tr>
                           <td>Amount :</td>
                           <td className="payment">₹ 25,250.00</td>
                        </tr>
                        <tr className="card-details">
                           <td>Payment Mode :</td>
                           <td><img
                              src='/html/images/payment/visa.png'
                           />
                              <p className="card-number">
                                 <span>Credit Card </span>xxxx xxxx xxxx x970</p>
                           </td>
                        </tr>
                     </tbody>
                  </Table>
               </div>
               <Button>
                  <span>Done</span>
                  <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleRight }} />
               </Button>
            </div> */}
         </div>
        }
        {/* <Footer /> */}
      </div>
   );
}

export default Payment;