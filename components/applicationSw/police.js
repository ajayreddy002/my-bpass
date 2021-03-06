import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form, Button, Spinner, FormControl } from 'react-bootstrap';
import { AngleRight, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;

import QuestionsInput from "../../components/common/question-input"
import ContextApi from '../../context'

const SignInSchema = Yup.object().shape({
    plotNo: Yup.string(),
})

const PoliceSection = ({
  currentStep,
  changeStep
}) => {

    const formik = useFormik({
        initialValues:{ 
          plotType: 'Plot_no',
        },
        validationSchema:SignInSchema,
        onSubmit:async (values, {setSubmitting}) => {
            changeStep(1)
            console.log('submit')
        }
    });

    const customHandleChange = (name, value) => {
    formik.setFieldValue(name, value);
    }

  return (
    <ContextApi.Consumer>
      {value =>
      <>
        <div className={`vicinity-information personal-details-from ${currentStep === 4 ? `` : `hide-form`}`}>
            <div className="main-title">
                <h3>Police Section</h3>
            </div>
            <Form className="login-form-type" onSubmit={formik.handleSubmit} autoComplete="off">
                <Form.Group>
                    <Form.Label>Dummy 1</Form.Label>
                    <Form.Control type="text"  />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Dummy 2</Form.Label>
                    <Form.Control type="text"  />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Dummy 3</Form.Label>
                    <Form.Control type="text"  />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Dummy 4</Form.Label>
                    <Form.Control type="text"  />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Dummy 5</Form.Label>
                    <Form.Control type="text"  />
                </Form.Group>
            
                <Button type="submit" disabled={formik.isSubmitting || value.disablePlotSubmit}>
                  <span>{getTranslatedText('button.save_continue')} </span>
                  {formik.isSubmitting?
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
        </div>
      </>
    }
    </ContextApi.Consumer>
  )
}


export default PoliceSection;