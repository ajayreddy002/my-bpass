import React, { useState, useEffect } from 'react';
import Router , {useRouter}  from 'next/router';
import { Component } from 'react';
import Link from 'next/link';
import { Container, Form, Button, Spinner} from 'react-bootstrap';
import { AngleRight } from '../../utils/icons';
import Footer from '../../components/Footers/index';
import ApplicationProvider from '../../context/application-provider'
import { getTranslatedText } from '../../utils/translationUtils';

import Cards from '../../components/application/Card'

import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;

import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/front.css';
import ApplicationHeader from '../../components/common/ApplicationHeader';


const Dashboard = ({
    currentStep,
  changeStep
}) => {
	const router = useRouter()
  	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
	const authToken = localStorage.getItem('auth-token')

	if(authToken){
		setIsLoading(true)
		
		axios.get(apiURL + apiConstants.CITIZEN_DASHBOARD.URL, {
            headers: {
               'Authorization': 'Bearer ' + authToken,
               'Accept' : '*/*'
            }
		})
		.then(response => {
			if(response.data.success){
				setItems(response.data.data.applications);
			}
			setIsLoading(false)
		})
		.catch(function (error) {
			setIsLoading(false)
			if(error.response){
				toast.error(error.response.data.message, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
				});
			}
		}); 	
	}else{
		router.push('/login')
	}
  }, [])
	return (
		<div>
			<ApplicationHeader />
			<Container style={{ margin: '30px auto 0', maxWidth: '1500px', }}>
			<div className="citizen-dashboard-header-container">
				<div>
					<h4 style={{ fontSize: '20px' }}><strong>Applications</strong></h4>
					<h6 style={{ marginTop: 30, marginBottom: 10, fontSize: '14px', color: '#9EABB5' }}>Applied Recent</h6>
				</div>
				<Button className="apply-btn" type="submit" onClick={() => router.push('/application/new')} >
					<span style={{ fontWeight: 500, }}>{getTranslatedText('button.apply_new')}</span>
				</Button>
			</div>
			{isLoading?
				<div className="login-form-type">
					<div className="review-submit-loading">
						<Spinner animation="border" size="xlg" />
					</div>
				</div>
			:
				items.length > 0? items.map(item => 
					<Cards key={item.id} item={item} />
				): <h4>No Applicaitons Found</h4>
			}
			</Container>
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<Footer />
		</div>
	)
}
export default Dashboard;