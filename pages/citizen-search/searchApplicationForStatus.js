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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'shards-react';
import React, { Fragment } from 'react';

import ApplicationMiniDetailsComponents from '../../components/citizen/ApplicationMiniDetailsComponent';
import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import { Spinner } from 'react-bootstrap';
import apiConstants from '../../constants/apiConstants';
import colorConstants from '../../constants/colorConstants';
import { getTranslatedText } from '../../utils/translationUtils';
import { getTranslationLocale } from '../../utils/routeUtils';
import { getURL } from '../../utils/urlUtils';
import { isEmpty } from 'lodash';

export default class SearchApplicationForStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: '',
      localizationBundle: {},
      textAlign: '',
      isLoading: false,
      application_id: null,
      applicant_name: null,
      applicant_ph_no: null,
      errorMessage: null,
      application_details: null
    };
  }

  static getInitialProps = async ({ mobxStore, query }) => {
    const { language } = query;
    const translationLocale = getTranslationLocale(
      language,
      mobxStore.localization
    );
    return { ...translationLocale };
  };

  componentDidUpdate(prevProps) {
    if (prevProps.language != this.props.language) {
      const { localizationBundle, language, textAlign } = this.props;
      this.setState({ language, localizationBundle, textAlign });
    }
  }

  componentDidMount = () => {
    const { language, localizationBundle, textAlign } = this.props;
    this.setState({ language, localizationBundle, textAlign });
  };

  setLoading = param => {
    this.setState({
      isLoading: param
    });
  };

  searchForApplication = async event => {
    event.preventDefault();
    this.setLoading(true);

    const { application_id, applicant_name, applicant_ph_no } = this.state;
    const data = {
      identifier: application_id,
      applicant_name,
      phone_number: applicant_ph_no
    };
    const url = getURL(apiConstants.OPEN_APPLICATION_SEARCH.USECASE);
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
        this.setState({ application_details: response });
      } else {
        this.setState({
          errorMessage: getTranslatedText('error.application_not_found')
        });
      }
    } catch (e) {
      this.setState({
        errorMessage: getTranslatedText('error.application_not_found')
      });
    }
    this.setLoading(false);
  };

  resetSearchDetails = () => {
    this.setState({
      isLoading: false,
      application_id: null,
      applicant_name: null,
      applicant_ph_no: null,
      errorMessage: null,
      application_details: null
    });
  };

  render() {
    const {
      localizationBundle,
      isLoading,
      language,
      application_id,
      applicant_name,
      applicant_ph_no,
      errorMessage,
      application_details
    } = this.state;
    return (
      <LocalizationProvider messages={localizationBundle}>
        <Header route='citizen-search' params={{ language }} />
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
            {application_details ? (
              <div>
                <ApplicationMiniDetailsComponents
                  applicationDetails={application_details}
                />
                <Row>
                  <Col xs='12' className='text-center'>
                    <Button
                      theme='success'
                      style={{ marginTop: '30px' }}
                      onClick={this.resetSearchDetails}
                      type='submit'
                    >
                      {getTranslatedText('button.search_another_application')}
                    </Button>
                  </Col>
                </Row>
              </div>
            ) : (
              <Card style={{ maxWidth: 350, margin: 'auto', top: 100 }}>
                <CardHeader>
                  {getTranslatedText('heading.search_application')}
                </CardHeader>
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
                  <Form>
                    <Row>
                      {/* Application ID */}
                      <Col xs='12'>
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
                              this.setState({
                                application_id: event.target.value
                              })
                            }
                            value={application_id ? application_id : ''}
                            name='application_id'
                            valid={!isEmpty(application_id)}
                            invalid={application_id === ''}
                          />
                        </FormGroup>
                      </Col>
                      {/* Applicant Name */}
                      <Col xs='12'>
                        <FormGroup className={this.props.textAlign}>
                          <label htmlFor='applicant_name'>
                            <strong>
                              {getTranslatedText('label.applicant_name')}
                            </strong>
                          </label>
                          <FormInput
                            id='#applicant_name'
                            placeholder='Enter applicant name'
                            onChange={event =>
                              this.setState({
                                applicant_name: event.target.value
                              })
                            }
                            value={applicant_name ? applicant_name : ''}
                            name='applicant_name'
                            valid={!isEmpty(applicant_name)}
                            invalid={applicant_name === ''}
                          />
                        </FormGroup>
                      </Col>
                      {/* Applicant Phone number */}
                      <Col xs='12'>
                        <FormGroup className={this.props.textAlign}>
                          <label htmlFor='applicant_ph_no'>
                            <strong>
                              {getTranslatedText('label.mobile_number')}
                            </strong>
                          </label>
                          <InputGroup className='mb-2'>
                            <InputGroupAddon type='prepend'>
                              <InputGroupText>+91</InputGroupText>
                            </InputGroupAddon>
                            <FormInput
                              id='#applicant_ph_no'
                              type='number'
                              placeholder='Enter applicant mobile number'
                              onChange={event =>
                                this.setState({
                                  applicant_ph_no: event.target.value
                                })
                              }
                              value={applicant_ph_no ? applicant_ph_no : ''}
                              name='applicant_ph_no'
                              valid={!isEmpty(applicant_ph_no)}
                              invalid={applicant_ph_no === ''}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12' className='text-center'>
                        <Button
                          theme='success'
                          style={{ marginTop: '30px' }}
                          disabled={
                            isEmpty(application_id) ||
                            isEmpty(applicant_name) ||
                            isEmpty(applicant_ph_no) ||
                            isLoading
                          }
                          onClick={event => {
                            this.searchForApplication(event);
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
                          {isLoading ? 'Searching...' : 'Search Application'}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            )}
          </div>
        </LoadingOverlay>
      </LocalizationProvider>
    );
  }
}
