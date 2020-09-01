import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Dropdown, Navbar, Nav, NavDropdown, } from 'react-bootstrap';
import { Logout, Lock, UserProfile } from '../../utils/icons';
import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;
import '../../styles/front.css';
import Head from 'next/head';

const ApplicationHeader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('auth-token')

    if (authToken) {
      setIsLoading(true)

      axios.get(apiURL + apiConstants.USER_DETAILS.URL, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
          'Accept': '*/*'
        }
      }).then(response => {
        if (response.data.success) {
          setUserDetails(response.data.data.user)
        }
        setIsLoading(false)
      }).catch(function (error) {
        setIsLoading(false)
        if (error.response) {
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
          });
        }
      });
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }

  return (
    <Navbar expand="lg" className="border-bottom flex-lg-column" style={{ fontFamily: 'Work Sans', }}>
      <Head>
        <link rel="stylesheet" href="/html/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/html/css/style.css" />
      </Head>
      <Navbar.Brand href="/html/en/index.html#home-section" className="d-flex align-items-center mr-auto" style={{ color: '#1d9a5b', }}>
        <img src="/html/images/logo.png" style={{ height: '80px', width: '80px' }} />
        <span className="d-block d-sm-none ml-2" style={{ fontSize: '20px', }}>TS-bPASS</span>
        <div className='d-none d-sm-block ml-2' style={{ fontSize: '20px', }}>
          <p className="m-0 ml-2" style={{ lineHeight: 1.1}}>Telangana State Building Permission Approval
                 <br />& Self Certification System (TS-bPASS)</p>
          <span className="ml-2" style={{ lineHeight: 1.5}}>GOVERNMENT OF TELANGANA</span>
        </div>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="w-100 application-header-navbar">
        <Nav className="ml-auto">
          <Nav.Link href="/html/en/index.html#home-section">HOME</Nav.Link>
          <Nav.Link target="_blank" href="#why-us-section">ABOUT TS-bPASS</Nav.Link>
          <NavDropdown title="INFORMATION">
            <NavDropdown.Item target="_blank" href="#">Flow Chart</NavDropdown.Item>
            <NavDropdown.Item target="_blank" href="/html/en/checklist.html">Checklist</NavDropdown.Item>
            <NavDropdown.Item target="_blank" href="/html/en/timelines.html">Timelines</NavDropdown.Item>
            <NavDropdown.Item target="_blank" href="/html/en/charges.html">User charges</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="RESOURCES">
            <NavDropdown.Item target="_blank" href="/html/en/rules.html">GO's and Acts</NavDropdown.Item>
            <NavDropdown.Item target="_blank" href="/html/en/department.html">Departments</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link target="_blank" href="#link">DCR PORTAL</Nav.Link>
          <Nav.Link target="_blank" href="/login">TRACK YOUR APPLICATION</Nav.Link>
          <Nav.Link target="_blank" href="http://hyno-officers-frontend-1490428480.ap-southeast-1.elb.amazonaws.com">OFFICER LOGIN</Nav.Link>
        </Nav>
        {
          userDetails ? (
            <div class="col col-lg-1 applicant-header-dropdown-menu">
              <Dropdown className="user-dropdown">
                <Dropdown.Toggle style={{ background: 'white', border: 'unset' }} id="dropdown-basic">
                  <span style={{ fontSize: 16, fontWeight: 500, color: '#222', marginRight: 10, }}>{userDetails.first_name}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="user-dropdown-menu">
                  <Dropdown.Item href="#">
                    <svg style={{ height: 13, width: 12, }} dangerouslySetInnerHTML={{ __html: UserProfile }} />
                    <span style={{ margin: '10px 0 0 15px' }}>View Profile</span>
                  </Dropdown.Item>
                  <Dropdown.Item href="#">
                    <svg style={{ height: 13, width: 12, }} dangerouslySetInnerHTML={{ __html: Lock }} />
                    <span style={{ margin: '10px 0 0 15px' }}>Change Password</span>
                  </Dropdown.Item>
                  <Dropdown.Item href="#!" onClick={handleLogout}>
                    <svg style={{ height: 13, width: 12, }} dangerouslySetInnerHTML={{ __html: Logout }}></svg>
                    <span style={{ margin: '10px 0 0 15px' }}>Logout</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>)
            :
            <Button onClick={() => router.push('/login')} className="btn btn-primary text-white px-4">LOGIN</Button>
        }
      </Navbar.Collapse>
    </Navbar>
  );
}

export default ApplicationHeader;
