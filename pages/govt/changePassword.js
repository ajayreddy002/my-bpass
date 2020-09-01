import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormInput,
  Row
} from 'shards-react';
import React, { Fragment } from 'react';

import AdminSubHeader from '../../components/AdminSubHeaderComponent';
import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import { Spinner } from 'react-bootstrap';
import apiConstants from '../../constants/apiConstants';
import colorConstants from '../../constants/colorConstants';
import { getLocalizationBundleForLanguage } from '../../utils/translationUtils';
import { getURL } from '../../utils/urlUtils';
import { isEmpty } from 'lodash';
import withValidation from './withValidation';

class AdminChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      old_password: null,
      new_password: null,
      confirm_new_password: null,
      errorMessage: null,
      successMessage: null
    };
  }

  setLoading = param => {
    this.setState({
      isLoading: param
    });
  };

  updatePasswordForAdmin = async event => {
    event.preventDefault();
    this.setLoading(true);

    const { old_password, new_password, confirm_new_password } = this.state;
    if (new_password != confirm_new_password) {
      this.setState({
        errorMessage: 'New passwords do not match',
        confirm_new_password: '',
        isLoading: false
      });
      return;
    }

    const data = {
      old_password,
      new_password
    };
    const url = getURL(apiConstants.ADMIN_CHANGE_PASSWORD.USECASE);
    try {
      let response = await fetch(url.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response) {
        response = await response.json();
        if (response.isSuccess) {
          this.setState({
            successMessage: 'Password changed suceessfully',
            errorMessage: null,
            isLoading: false
          });
          this.resetPasswordDetails();
        } else {
          this.setState({
            errorMessage: response.message,
            successMessage: null,
            isLoading: false
          });
        }
      }
    } catch (e) {
      this.setState({
        errorMessage: 'Could not update password, please try after sometime'
      });
    }
    this.setLoading(false);
  };

  resetPasswordDetails = () => {
    this.setState({
      old_password: null,
      new_password: null,
      confirm_new_password: null
    });
  };

  render() {
    const {
      isLoading,
      old_password,
      new_password,
      confirm_new_password,
      errorMessage,
      successMessage
    } = this.state;
    const localizationBundle = getLocalizationBundleForLanguage('en');
    return (
      <LocalizationProvider messages={localizationBundle}>
        <Header route='admin-change-password' params={'en'} />
        <AdminSubHeader hideChangePassword={true} />
        <LoadingOverlay
          active={isLoading}
          spinner
          text={'Loading...'}
          styles={{
            overlay: base => ({
              ...base,
              background: colorConstants.overlayBackground
            })
          }}
        >
          <div className='application-container'>
            <Card style={{ maxWidth: 350, margin: 'auto' }}>
              <CardHeader>Change Password</CardHeader>
              <CardBody className='center-block'>
                {errorMessage && (
                  <Alert
                    theme='danger'
                    dismissible={() => {
                      this.setState({ errorMessage: null });
                    }}
                  >
                    {errorMessage}
                  </Alert>
                )}
                {successMessage && (
                  <Alert
                    theme='success'
                    dismissible={() => {
                      this.setState({ successMessage: null });
                    }}
                  >
                    {successMessage}
                  </Alert>
                )}
                <Form>
                  <Row>
                    <Col xs='12'>
                      <FormGroup className={this.props.textAlign}>
                        <label htmlFor='old_password'>
                          <strong>Current Password</strong>
                        </label>
                        <FormInput
                          id='#old_password'
                          type='password'
                          placeholder='Old Password'
                          onChange={event =>
                            this.setState({
                              old_password: event.target.value
                            })
                          }
                          value={old_password ? old_password : ''}
                          name='old_password'
                          valid={!isEmpty(old_password)}
                          invalid={old_password === ''}
                        />
                      </FormGroup>
                    </Col>
                    <Col xs='12'>
                      <FormGroup className={this.props.textAlign}>
                        <label htmlFor='new_password'>
                          <strong>New Password</strong>
                        </label>
                        <FormInput
                          id='#new_password'
                          type='password'
                          placeholder='New Password'
                          onChange={event =>
                            this.setState({
                              new_password: event.target.value
                            })
                          }
                          value={new_password ? new_password : ''}
                          name='new_password'
                          valid={!isEmpty(new_password)}
                          invalid={new_password === ''}
                        />
                      </FormGroup>
                    </Col>
                    {/* Applicant Phone number */}
                    <Col xs='12'>
                      <FormGroup className={this.props.textAlign}>
                        <label htmlFor='confirm_new_password'>
                          <strong>Confirm New Password</strong>
                        </label>
                        <FormInput
                          id='#confirm_new_password'
                          type='password'
                          placeholder='Confirm password'
                          onChange={event =>
                            this.setState({
                              confirm_new_password: event.target.value
                            })
                          }
                          value={
                            confirm_new_password ? confirm_new_password : ''
                          }
                          name='confirm_new_password'
                          valid={!isEmpty(confirm_new_password)}
                          invalid={confirm_new_password === ''}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs='12' className='text-center'>
                      <Button
                        theme='success'
                        style={{ marginTop: '30px' }}
                        disabled={
                          isEmpty(old_password) ||
                          isEmpty(new_password) ||
                          isEmpty(confirm_new_password) ||
                          isLoading
                        }
                        onClick={event => {
                          this.updatePasswordForAdmin(event);
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
                        {isLoading ? 'Updating...' : 'Update password'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </div>
        </LoadingOverlay>
      </LocalizationProvider>
    );
  }
}

export default withValidation(AdminChangePassword);
