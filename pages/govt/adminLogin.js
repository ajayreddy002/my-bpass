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
import { alterParamsForUrl, getURL } from '../../utils/urlUtils';

import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import ReCAPTCHA from 'react-google-recaptcha';
import { Router } from '../../routes';
import apiConstants from '../../constants/apiConstants';
import colorConstants from '../../constants/colorConstants';
import { getLocalizationBundleForLanguage } from '../../utils/translationUtils';
import { isEmpty } from 'lodash';

export default class AdminLogin extends React.Component {
  static getInitialProps = ({ query = {} }) => {
    return query;
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      username: null,
      password: null,
      message: null,
      recaptchaResponse: null,
      r_username: null, //Reset tpassword
      isResetPasswordClick: false,
      r_isLoading: false
    };
    this.handleCaptchaResponseChange = this.handleCaptchaResponseChange.bind(
      this
    );
  }

  submitLogin = async event => {
    event.preventDefault();
    const { username, password, recaptchaResponse } = this.state;
    const url = getURL(apiConstants.ADMIN_LOGIN.USECASE);
    const data = {
      username,
      password,
      recaptchaResponse
    };
    this.setState({ isLoading: true });
    let res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    if (res && res.status === 200) {
      this.setState({ message: 'Login Successful ! ', error: false });
      Router.replaceRoute('admin-redirect', { route: this.props.route });
    } else {
      res = await res.json();
      this.setState({
        message: res.message,
        error: true,
        isLoading: false
      });
      this.recaptcha.reset();
    }
  };

  handleCaptchaResponseChange(response) {
    this.setState({
      recaptchaResponse: response
    });
  }

  setLoading = param => {
    this.setState({
      isLoading: param
    });
  };

  resetPasswordForUser = async event => {
    event.preventDefault();
    this.setState({ r_isLoading: true });
    let url = getURL(apiConstants.RESET_ADMIN_PASSWORD.USECASE);
    const data = {
      user_id: this.state.r_username
    };
    let response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (response) {
      response = await response.json();
      if (response.isSuccess) {
        this.setState({
          r_username: null,
          isResetPasswordClick: false
        });
      }
      this.setState({ r_isLoading: false });
      alert(response.message);
      return;
    }
    this.setState({ r_isLoading: false });
    alert("Couldn't reset password, please try again later");
  };

  render() {
    const {
      username,
      password,
      recaptchaResponse,
      isLoading,
      message,
      isResetPasswordClick,
      r_isLoading,
      r_username
    } = this.state;
    const localizationProvider = getLocalizationBundleForLanguage('en');
    return (
      <LocalizationProvider messages={localizationProvider}>
        <Fragment>
          <Header route='citizen-search' params='en' />
          <LoadingOverlay
            active={isLoading}
            spinner
            text={'Submitting...'}
            styles={{
              overlay: base => ({
                ...base,
                background: colorConstants.overlayBackground
              })
            }}
          >
            <Fragment>
              <Modal
                open={isResetPasswordClick}
                toggle={() => {}}
                className='modal-dialog col-12 modal-dialog-centered'
              >
                <ModalHeader>Reset Password</ModalHeader>
                <ModalBody>
                  <Fragment>
                    <Row className='align-items-center'>
                      <Col xs='12'>
                        <FormGroup>
                          <label htmlFor='username'>
                            <strong>USERNAME</strong>
                          </label>
                          <FormInput
                            id='#username'
                            placeholder='Username'
                            onChange={event =>
                              this.setState({
                                r_username: event.target.value
                              })
                            }
                            value={r_username ? r_username : ''}
                            name='r_username'
                            valid={!isEmpty(r_username)}
                            invalid={r_username === ''}
                          />
                        </FormGroup>
                      </Col>

                      <Col xs='12' className='text-right'>
                        {' '}
                        <Button
                          theme='success'
                          disabled={isEmpty(r_username) || r_isLoading}
                          onClick={event => {
                            this.resetPasswordForUser(event);
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
                          style={{ marginLeft: 10 }}
                          onClick={event => {
                            this.setState({
                              isResetPasswordClick: false,
                              r_username: null
                            });
                          }}
                          disabled={r_isLoading}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                  </Fragment>
                </ModalBody>
              </Modal>

              <Card style={{ maxWidth: 350, margin: 'auto', top: 100 }}>
                <CardHeader>Officer's Login</CardHeader>
                <CardBody className='center-block'>
                  <Form>
                    <Row>
                      <Col xs='12'>
                        <FormGroup className={this.props.textAlign}>
                          <label htmlFor='username'>
                            <strong>USERNAME</strong>
                          </label>
                          <FormInput
                            id='#username'
                            placeholder='Enter your username'
                            onChange={event =>
                              this.setState({ username: event.target.value })
                            }
                            value={username ? username : ''}
                            name='username'
                            valid={!isEmpty(username)}
                            invalid={username === ''}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <FormGroup>
                          <label htmlFor='password'>
                            <strong>PASSWORD</strong>
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
                            className='input-group'
                          />
                        </FormGroup>
                      </Col>
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
                      {/* Captcha */}
                      <Col xs='12' style={{ marginTop: '20px' }}>
                        <ReCAPTCHA
                          ref={el => {
                            this.recaptcha = el;
                          }}
                          sitekey='6LeT6s4UAAAAAMp-Qj55q2VFUGUS6J8Ubj2MnEWt'
                          onChange={this.handleCaptchaResponseChange}
                        />
                      </Col>
                      <Col xs='12' className='text-center'>
                        <Button
                          theme='success'
                          style={{ marginTop: '30px' }}
                          disabled={
                            isEmpty(password) ||
                            isEmpty(username) ||
                            isEmpty(recaptchaResponse) ||
                            isLoading
                          }
                          onClick={event => {
                            this.submitLogin(event);
                          }}
                          type='submit'
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
                          {isLoading ? 'Logging you in...' : 'Login'}
                        </Button>
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
          </LoadingOverlay>
        </Fragment>
      </LocalizationProvider>
    );
  }
}
