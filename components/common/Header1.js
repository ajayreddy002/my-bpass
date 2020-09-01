import React, { useState, useEffect } from 'react';
import Router , {useRouter}  from 'next/router';
import Link from 'next/link';
import { Row, Col, Form, Button,Dropdown, DropdownButton, ButtonGroup} from 'react-bootstrap';
import { AngleRight, Bell, upload, arrow, Logout, Lock, UserProfile } from '../../utils/icons';

import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;

import { getTranslatedText } from '../../utils/translationUtils';
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/front.css';


const Header = () => {
   const [modalShown, setModalShown] = useState(false);
	const [isLoading, setIsLoading] = useState(true)
	const [userDetails, setUserDetails] = useState(false)
   const toggleModalVisiblity = () => {
       setModalShown(modalShown ? false : true);
   };
	const router = useRouter()

   useEffect(() => {
      const authToken = localStorage.getItem('auth-token')
   
      if(authToken){
         setIsLoading(true)
         
         axios.get(apiURL + apiConstants.USER_DETAILS.URL, {
               headers: {
                  'Authorization': 'Bearer ' + authToken,
                  'Accept' : '*/*'
               }
         })
         .then(response => {
            console.log('fsdfs', response)
            if(response.data.success){
               setUserDetails(response.data.data.user)
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

   const handleLogout = () => {
      localStorage.removeItem('auth-token');
      setTimeout(() => {
         router.push('/login')
      }, 1000)
   }
   
  return (
    <header style={{ borderBottom: "1px solid #ccc", }}>
      <div class="container" style={{ maxWidth: '1500px', padding: 0, }}>
        <div class="row">
          <div class="col">
            <Link href="/" style={{ cursor: 'pointer', }}>
              <img src="/html/images/register/logo.png" alt="" />
            </Link>
          </div>
          {/* <div class="col-md-auto m-auto">
              <div className="d-flex align-items-center">
                <svg style={{ margin: 10 }} className="arrow-right" dangerouslySetInnerHTML={{ __html: Bell }} />
                <Button variant="outline-dark">Update Contact Details</Button>{' '}
              </div>
            </div> */}
          <div class="col col-lg-2 m-auto">
            <Dropdown className="user-dropdown">
              <Dropdown.Toggle style={{ background: 'white', border: 'unset' }} id="dropdown-basic">
                {/* <img style={{ width: '18%', marginRight: 13 }} src="/html/images/register/circle-cropped.png" /> */}
                <span style={{ color: 'black', marginRight: 10, }}>{userDetails ? userDetails.first_name : "Loading... "}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-dropdown-menu">
                <Dropdown.Item href="#/action-1">
                  <svg style={{ height: 13, width: 12, }} dangerouslySetInnerHTML={{ __html: UserProfile }} />
                  <span style={{ margin: '10px 0 0 15px' }}>View Profile</span>
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2">
                  <svg style={{ height: 13, width: 12, }} dangerouslySetInnerHTML={{ __html: Lock }} />
                  <span style={{ margin: '10px 0 0 15px' }}>Change Password</span>
                </Dropdown.Item>
                <Dropdown.Item href="#!" onClick={handleLogout}>
                  <svg style={{ height: 13, width: 12, }} dangerouslySetInnerHTML={{ __html: Logout }}></svg>
                  <span style={{ margin: '10px 0 0 15px' }}>Logout</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
}


export default Header;