import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import '../../styles/index.css';

import { Button, Card, CardBody, CardHeader, FormCheckbox } from 'shards-react';
import { Col, Container, ListGroup, Row, Spinner } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import React from 'react';
import ReviewApplication from '../../components/ReviewApplication';
import { Router } from '../../routes';
import applicationStatusConstants from '../../constants/applicationStatusConstants';
import colorConstants from '../../constants/colorConstants';
import { getSelfDeclaration } from '../../constants/data/selfDeclaration';
import { getTranslatedText } from '../../utils/translationUtils';
import { getTranslationLocale } from '../../utils/routeUtils';
import { markSelfDeclarationAccepted } from '../../apiHelpers/applicationDetails';

@inject('applicationForm')
@inject('localization')
@observer
class ReviewAndDeclareComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      application_identifier: null,
      applicationData: null,
      applicationType: null,
      selfDeclaration: null,
      error: false,
      localizationBundle: {},
      language: ''
    };
    this.applicationForm = this.props.applicationForm;
    this.localizationStore = this.props.localization;
  }

  static getInitialProps = async ({ query, mobxStore }) => {
    const { language, applicationId } = query;
    const translationLocale = getTranslationLocale(
      language,
      mobxStore.localization
    );

    if (applicationId) {
      const applicationData = mobxStore.applicationForm.getApplicationData();
      const redirect =
        !applicationData.applicationId ||
        applicationData.applicationId != applicationId;
      return {
        error: false,
        redirect,
        applicationId: applicationId,
        applicationData,
        ...translationLocale
      };
    } else {
      return { error: true };
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.language != this.props.language) {
      const { localizationBundle, language, textAlign } = this.props;
      this.localizationStore.setLocalizationData({
        localizationBundle: JSON.stringify(localizationBundle),
        language,
        textAlignment: textAlign
      });
    }
  }

  componentDidMount = () => {
    const {
      redirect,
      applicationId,
      error,
      applicationData,
      localizationBundle,
      language,
      textAlign
    } = this.props;
    if (redirect) Router.replaceRoute('redirect', { applicationId, language });
    if (error) {
      this.setState({ error });
      return;
    }

    let selfDeclaration = getSelfDeclaration(applicationData);
    selfDeclaration.map((val, index) => {
      this.state[['checked_' + index]] = false;
    });
    this.localizationStore.setLocalizationData({
      localizationBundle: JSON.stringify(localizationBundle),
      language,
      textAlignment: textAlign
    });
    this.setState({
      applicationData,
      application_identifier: applicationId,
      selfDeclaration
    });
  };

  markSelfDeclarationAccept = async () => {
    const { application_identifier } = this.state;
    const { language } = this.props;
    this.setState({ isLoading: true });
    const { paymentDetails, error } = await markSelfDeclarationAccepted(
      application_identifier
    );
    if (!error) {
      if (paymentDetails.amount) {
        this.applicationForm.setApplicationPayment(paymentDetails);
        this.applicationForm.setStatus(
          applicationStatusConstants.SELF_DECLARATION_ACCEPTED
        );
        Router.replaceRoute('payment', {
          language: language,
          applicationId: application_identifier
        });
      } else {
        Router.replaceRoute('redirect', {
          language: language,
          applicationId: application_identifier
        });
      }
    } else {
      this.setState({ isLoading: false });
      alert('Unable to proceed, please try after sometime');
    }
  };

  getLabelTextAlignment = () => {
    if (this.props.textAlign) {
      return this.props.textAlign;
    }
  };

  render() {
    const {
      application_identifier,
      error,
      isLoading,
      applicationData
    } = this.state;

    const localizationBundle = this.localizationStore.getLocalizationBundle()
      ? this.localizationStore.getLocalizationBundle()
      : {};
    const { language } = this.props;

    if (!applicationData || !applicationData.applicationId) {
      return null;
    }

    return error ? (
      <LocalizationProvider messages={localizationBundle}>
        <React.Fragment>
          <Header
            route='review'
            params={{ applicationId: application_identifier, language }}
          />
          <Container className='mt-5'>
            <Card>
              <CardHeader>Failed</CardHeader>
              <CardBody className='text-center'>
                Unable to fetch the details of this application
              </CardBody>
            </Card>
          </Container>
        </React.Fragment>
      </LocalizationProvider>
    ) : (
      <LocalizationProvider messages={localizationBundle}>
        <React.Fragment>
          <Header
            route='review'
            params={{ applicationId: application_identifier, language }}
            meseva_request={applicationData.meseva_request}
          />
          <LoadingOverlay
            active={isLoading}
            spinner
            text='Loading...'
            styles={{
              overlay: base => ({
                ...base,
                background: colorConstants.overlayBackground
              })
            }}
          >
            <div className='mt-5'>
              <ReviewApplication
                applicationData={applicationData}
                textAlign={this.props.textAlign}
              />
            </div>
            <Container className='mt-2 mb-5'>
              <Row>
                <Card style={{ marginTop: 50 }}>
                  <CardHeader className={this.getLabelTextAlignment()}>
                    {getTranslatedText('heading.self_declaration')}
                  </CardHeader>
                  <CardBody className='text-black'>
                    {this.state.selfDeclaration &&
                      this.state.selfDeclaration.map((text, index) => {
                        return (
                          <Row key={index}>
                            <ListGroup
                              variant='flush'
                              style={{ width: '100%' }}
                            >
                              <ListGroup.Item>
                                <Row className='align-items-center justify-content-between'>
                                  <Col xs='10' md='11'>
                                    <span
                                      dangerouslySetInnerHTML={{ __html: text }}
                                    ></span>
                                  </Col>
                                  <Col xs='2' md='1'>
                                    <FormCheckbox
                                      checked={this.state['checked_' + index]}
                                      onChange={() =>
                                        this.setState({
                                          ['checked_' + index]: !this.state[
                                            'checked_' + index
                                          ]
                                        })
                                      }
                                    ></FormCheckbox>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            </ListGroup>
                          </Row>
                        );
                      })}
                    <Row>
                      <Col
                        xs='auto'
                        className='mt-5 align-items-center justify-content-center'
                      >
                        <p className={this.getLabelTextAlignment()}>
                          {getTranslatedText('label.self_dec_text')}
                        </p>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Row>
              <Row className='align-items-center justify-content-center mt-5'>
                <Col xs='auto'>
                  <Button
                    theme='danger'
                    onClick={() =>
                      Router.replaceRoute('documents', {
                        language: language,
                        applicationId: application_identifier
                      })
                    }
                    disabled={isLoading}
                  >
                    {getTranslatedText('button.goBack')}
                  </Button>
                </Col>
                <Col xs='auto'>
                  <Button
                    theme='success'
                    type='submit'
                    disabled={
                      Object.keys(this.state).some(stateItem => {
                        if (stateItem.includes('checked_')) {
                          return !this.state[stateItem];
                        } else return false;
                      }) || isLoading
                    }
                    onClick={() => {
                      this.setState({ isLoading: true });
                      this.markSelfDeclarationAccept();
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
                    {isLoading
                      ? getTranslatedText('button.submitting')
                      : getTranslatedText('button.agree_continue')}
                  </Button>
                </Col>
              </Row>
            </Container>
          </LoadingOverlay>
        </React.Fragment>
      </LocalizationProvider>
    );
  }
}

export default ReviewAndDeclareComponent;
