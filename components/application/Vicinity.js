import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form, Button, Spinner, FormControl } from 'react-bootstrap';
import { AngleRight, AngleLeft, UploadFile } from '../../utils/icons';
import { getTranslatedText } from '../../utils/translationUtils';

import { toast } from 'react-toastify';
import axios from 'axios';
import apiConstants from '../../constants/apiConstants';
const apiURL = require('../../config/url-front').API_SERVER;

import QuestionsInput from "../../components/common/question-input"
import ContextApi from '../../context'

const VicinityDetails = ({
  currentStep,
  changeStep
}) => {
  const [questions, setQuestions] = useState([]);
  const [questionAnswers, setQuestionAnswers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const authToken = localStorage.getItem('auth-token');
    if(authToken && currentStep === 4) {
      axios.get(apiURL + apiConstants.QUESTIONS.URL, {
        params: {
          category: 'vicinity'
        },
        headers: {
          'Authorization': 'Bearer ' + authToken,
          'Accept' : '*/*'
        }
      })
      .then(function (response) {
        // Set results state
        setQuestions(response.data.data.questions)
        setIsLoading(false)
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }, [currentStep])

  const handleSubmit = async () => {
    if(questionAnswers.length > 0) {
      setIsSubmitting(true)
      const authToken = localStorage.getItem('auth-token');
      const applicationId = localStorage.getItem('property-id');
      const config = {
        headers: {
          'Authorization': 'Bearer ' + authToken,
          'Accept' : '*/*'
        }
      };

      const data = {
        "completed_steps": 4,
        "application_answers": questionAnswers
      }

      await axios.put(apiURL + apiConstants.PLOT_POST.URL + `/${applicationId}`, data, config)
      .then(function (response) {
        console.log('response', response);
        if(response.data.success){
          changeStep(5);
        }else{
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
          });
        }
        setIsSubmitting(false);
      })
      .catch(function (error) {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
        });
        setIsSubmitting(false);
      });
    }else{
      toast.error('Please Answer following questions', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });
    }
  }

  const handleQuestionAns = (id, value) => {
    const data = questionAnswers;
    var index = 0;
    data.some(function(question, i) {
        if (question.question_id === id) {
            index = i + 1;
            return true;
        }
    });
    
    if(index === 0){
      data.push({
        "question_id": id,
        "answer": value
      })
    }else{
      data[index - 1].answer = value 
    }
    setQuestionAnswers(data)
    
    // customHandleChange('questionAnswers', data)
  }

  return (
    <ContextApi.Consumer>
      {value =>
      <>
        <div className={`vicinity-information personal-details-from ${currentStep === 4 ? `` : `hide-form`}`}>
          <div className="main-title">
            <h3>{getTranslatedText('heading.vicinity_information')}</h3>
          </div>
          {isLoading?
            <div className="login-form-type">
               <div className="review-submit-loading">
                  <Spinner animation="border" size="xlg" />
               </div>
            </div>
         :
          <Form className="login-form-type">

            { questions.length > 0 &&
                questions.map((item, index) => {
                  if(item.application_type.includes(value.applicationType === 'SCMOR' ? 'SC' : value.applicationType)){
                    return (<QuestionsInput 
                        key={`questions-${index}`} 
                        item={item}
                        customHandleChange={(id, ans) => handleQuestionAns(id, ans)}
                      />
                    )
                  }
                })
            }

            {/* <div className="uploade-document-file">
              <Form.Group className="application-checkbox">
                <Form.Check
                  name="terms"
                  label="Continue my application with single window"
                />
              </Form.Group>
            </div> */}
            {/* <div className="personal-deatails-buttons">
              <div className="back-btn" onClick={() => changeStep(3)}>
                <svg className="arrow-right" dangerouslySetInnerHTML={{ __html: AngleLeft }} />
                <span>{getTranslatedText('button.back')}</span>
              </div> */}
              <Button type="button" disabled={isSubmitting}  onClick={() => handleSubmit()} >
                <span>{getTranslatedText('button.save_continue')} </span>
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
            {/* </div> */}
          </Form>
          }
        </div>
      </>
    }
    </ContextApi.Consumer>
  )
}


export default VicinityDetails;