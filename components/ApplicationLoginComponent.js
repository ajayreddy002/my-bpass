import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  FormInput,
  Modal,
  ModalBody,
  ModalHeader
} from 'shards-react';
import { Col, Row, Spinner } from 'react-bootstrap';
import React, { Fragment } from 'react';
import { alterParamsForUrl, getURL } from '../utils/urlUtils';

import LoadingOverlay from 'react-loading-overlay';
import { Router } from '../routes';
import apiConstants from '../constants/apiConstants';
import colorConstants from '../constants/colorConstants';
import { default as fetch } from 'isomorphic-unfetch';
import { getTranslatedText } from '../utils/translationUtils';
import { isEmpty } from 'lodash';

export default class ApplicationLoginComponent extends React.Component {
  constructor(params) {
    super(params);
    this.state = {
      applicationId: null,
      password: null,
      language: params.language,
      message: null,
      error: false,
      isLoading: false,
      r_applicationId: null, //Reset tpassword
      isResetPasswordClick: false,
      r_isLoading: false
    };
  }

  setLoading = loadingState => {
    this.setState({ isLoading: loadingState });
    this.props.setLoading(loadingState);
  };

  submitRetrieveAppln = async event => {
    event.preventDefault();
    this.setLoading(true);
    const { applicationId, password } = this.state;
    const data = {
      application_identifier: applicationId,
      password: password
    };
    const url = getURL(apiConstants.GET_AUTHN_APPLICATION_DETAILS.USECASE);
    try {
      let response = await fetch(url.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response && response.status === 200) {
        response = await response.json();
        if (response) {
          this.setState({
            error: false,
            message: getTranslatedText('success.application_redirect')
          });
          Router.replaceRoute('redirect', {
            language: this.state.language,
            applicationId: data.application_identifier
          });
        }
      } else {
        this.setLoading(false);
        this.setState({
          error: true,
          message: getTranslatedText('error.invalid_input')
        });
      }
    } catch (e) {
      this.setLoading(false);
      this.setState({
        error: true,
        message: getTranslatedText('error.try_later')
      });
    }
  };

  resetPasswordForApplication = async event => {
    event.preventDefault();
    this.setState({ r_isLoading: true });
    let url = getURL(apiConstants.RESET_APPLICATION_PASSWORD.USECASE);
    url = alterParamsForUrl(url, { identifier: this.state.r_applicationId });
    let response = await fetch(url);
    if (response && response.status == 200) {
      response = await response.json();
      if (response.isSuccess) {
        this.setState({
          r_applicationId: null,
          isResetPasswordClick: false,
          r_isLoading: false
        });
        alert(response.message);
      } else {
        alert(response.message);
      }
      return;
    }
    this.setState({ r_isLoading: false });
    alert("Couldn't reset password, please try again later");
  };

  render() {
    const {
      isLoading,
      applicationId,
      password,
      message,
      isResetPasswordClick,
      r_applicationId,
      r_isLoading
    } = this.state;
    return (
      <Fragment>
        <Modal
          open={isResetPasswordClick}
          toggle={() => {
            // this.setState({
            // isResetPasswordClick: false,
            // r_applicationId: null
            // });
          }}
          className='modal-dialog col-12 modal-dialog-centered'
        >
          <ModalHeader>Reset Application Password</ModalHeader>
          <ModalBody>
            <Fragment>
              <Row className='align-items-center text-right'>
                <Col xs='12' className='mb-2'>
                  <FormGroup className={this.props.textAlign}>
                    <label htmlFor='application_id'>
                      <strong>
                        {getTranslatedText('label.application_id')}
                      </strong>
                    </label>
                    <FormInput
                      id='#application_id'
                      placeholder='Application ID'
                      onChange={event =>
                        this.setState({ r_applicationId: event.target.value })
                      }
                      value={r_applicationId ? r_applicationId : ''}
                      name='r_application_id'
                      valid={!isEmpty(r_applicationId)}
                      invalid={r_applicationId === ''}
                    />
                  </FormGroup>
                </Col>

                <Col xs='12' className='text-right'>
                  <Button
                    theme='primary'
                    disabled={isEmpty(r_applicationId) || r_isLoading}
                    onClick={event => {
                      this.resetPasswordForApplication(event);
                    }}
                  >
                    {r_isLoading ? (
                      <Spinner
                        as='span'
                        animation='grow'
                        size='sm'
                        role='status'
                        aria-hidden='true'
                      />
                    ) : null}
                    {r_isLoading ? 'Submitting' : 'Reset Password'}
                  </Button>
                  <Button
                    theme='danger'
                    disabled={r_isLoading}
                    style={{ marginLeft: 10 }}
                    onClick={event => {
                      this.setState({
                        isResetPasswordClick: false,
                        r_applicationId: null
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Fragment>
          </ModalBody>
        </Modal>
        <Card>
          <CardHeader>
            {getTranslatedText('heading.retrieve_your_application')}
          </CardHeader>
          <CardBody>
            <Form>
              <Row>
                <Col xs='12' md='5'>
                  <FormGroup className={this.props.textAlign}>
                    <label htmlFor='application_id'>
                      <strong>
                        {getTranslatedText('label.application_id')}
                      </strong>
                    </label>
                    <FormInput
                      id='#application_id'
                      placeholder='Application ID'
                      onChange={event =>
                        this.setState({ applicationId: event.target.value })
                      }
                      value={applicationId ? applicationId : ''}
                      name='application_id'
                      valid={!isEmpty(applicationId)}
                      invalid={applicationId === ''}
                    />
                  </FormGroup>
                </Col>
                <Col xs='12' md='5'>
                  <FormGroup className={this.props.textAlign}>
                    <label htmlFor='password'>
                      <strong>{getTranslatedText('label.password')}</strong>
                    </label>
                    <FormInput
                      type='password'
                      id='#password'
                      placeholder='Password'
                      name='password'
                      value={password ? password : ''}
                      onChange={event =>
                        this.setState({ password: event.target.value })
                      }
                      valid={!isEmpty(password)}
                      invalid={password === ''}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <Button
                    theme='primary'
                    style={{ marginTop: '30px', padding: 10 }}
                    disabled={
                      isEmpty(password) || isEmpty(applicationId) || isLoading
                    }
                    onClick={event => {
                      this.submitRetrieveAppln(event);
                    }}
                  >
                    {isLoading ? (
                      <Spinner
                        as='span'
                        animation='grow'
                        size='sm'
                        role='status'
                        aria-hidden='true'
                      />
                    ) : null}
                    {isLoading ? 'Retrieving' : 'Retrieve Application'}
                  </Button>
                </Col>{' '}
              </Row>
              <Row>
                <Col xs='12'>
                  <Fragment>
                    <a
                      href='#'
                      onClick={() =>
                        this.setState({ isResetPasswordClick: true })
                      }
                    >
                      Reset Password
                    </a>
                  </Fragment>
                </Col>
              </Row>
            </Form>
            {message !== null ? (
              <>
                <p
                  style={{
                    marginTop: 20
                  }}
                  className={
                    'text-center ' +
                    (this.state.error ? 'text-danger' : 'text-success')
                  }
                >
                  <strong>{message}</strong>
                </p>
              </>
            ) : null}
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}
