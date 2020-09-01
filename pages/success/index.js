import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { AngleRight } from '../../utils/icons';
import Header from '../../components/Header';
import Footer from "../../components/footer";
import ApplicationProvider from '../../context/application-provider';
import { getTranslatedText } from '../../utils/translationUtils';

import LandUseApplicant from '../../components/application/LandUseApplicant';
import CluPlot from '../../components/application/CluPlot';
import BuildingDetails from '../../components/application/Building';
import VicinityDetails from '../../components/application/Vicinity';
import ReviewSubmit from '../../components/application/Review';
import { convertToSqMeters } from '../../utils/convertionUtils'

import { useRouter } from 'next/router'

import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;
import { toast } from 'react-toastify';

import ContextApi from '../../context'

import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/front.css';
import ApplicationHeader from '../../components/common/ApplicationHeader';

function Success() {
  return (
    <>
      <ApplicationHeader />
      
      <h4 style={{marginLeft: '300px', marginTop: '100px', marginBottom: '200px'}}>Your Request has been succesfully recorded.</h4>
      <Footer />
    </>
  );
}

export default Success;
