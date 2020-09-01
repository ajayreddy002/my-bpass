import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Container, Form, Button, Table, Spinner } from 'react-bootstrap';
import TableView from 'react-table-view'
import Header from '../../components/Header';
import Footer from "../../components/footer";
import { convertDateToDMY } from "../../utils/convertionUtils"
import { useRouter } from 'next/router'
import { alterParamsForUrl, getURL } from '../../utils/urlUtils';

import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;
import { toast } from 'react-toastify';

import ContextApi from '../../context'

import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/front.css';


function ApplicationForm(props) {
  const [isLoading, setIsLoading] = useState(false)
  const [municipalityData, setMunicipalityData] = useState([])
  const router = useRouter()
  const { ulb_name, status } = router.query

   useEffect(() => {
    
    
    
    // setIsLoading(true)

//         let url = getURL(apiConstants.GET_CHASING_STATS.USECASE);
        
//         url = alterParamsForUrl(url, {
//           ulb_name: 'Achampeta',
//           status: 'ACCEPTED'
//         });

//         let response =  fetch(url);
// console.log(response);
           let url = getURL(apiConstants.GET_CHASING_STATS.USECASE);
   
   console.log(url)
        axios.get(url.href, {
            headers: {
            'Accept' : '*/*'
            },
            params: {
                ulb_name:ulb_name,
                status: status
            }
        })
        .then(function (response) {
            console.log('completed steps', response);
            if(response.status === 200){
              
               setMunicipalityData(response.data)
        //  Set results state
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
            console.log('erroreee', error);
            
            if(error.response){
                toast.error(error.response.data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                });
            }
        })
  }, [])
  
  return (
    <>
      <Header />
      <section className="personal-details-wrapper">
        <Container>
          <div className="chasing-stats" >
                <h2>Chasing Stats</h2>
            {isLoading?
                <div className="review-submit-loading">
                <Spinner animation="border" size="xlg" />
                </div>
            :
                <div className="municipality-table">
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Identifier</th>
                                <th>App Status</th>
                                <th>Email</th>
                                <th>Expire</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Name</th>
                                <th>No Of Floors</th>
                                <th>Phone</th>
                                <th>Plot Area</th>
                                <th>Status</th>
                                <th>ULB Name</th>
                            </tr>
                        </thead>
                        <tbody className="municiple-tbody">
                            {municipalityData.length > 0 &&
                                municipalityData.map((item, i) =>
                                <tr>
                                    <td>{item.application_identifier}</td>
                                    <td>{item.application_status}</td>
                                    <td>{item.email_id}</td>
                                    <td>{convertDateToDMY(item.expires_on)}</td>
                                    <td>{item.first_name}</td>
                                    <td>{item.last_name}</td>
                                    <td>{item.name}</td>
                                    <td>{item.no_of_floors}</td>
                                    <td>{item.phone_number}</td>
                                    <td>{item.plot_area}</td>
                                    <td>{item.status}</td>
                                    <td>{item.ulb_name}</td>
                                </tr>
                            )}
                        </tbody>
                        </Table>
                </div>
            }
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
}

export default ApplicationForm;
