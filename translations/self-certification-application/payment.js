import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import '../../styles/index.css';

import { Button, Card, CardBody, CardHeader, FormRadio } from 'shards-react';
import { CardImg, Col, Container, Row, Spinner } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

import ErrorCard from '../../components/Error';
import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import PaymentSummary from '../../components/PaymentSummary';
import React from 'react';
import { Router } from '../../routes';
import applicationStatusConstants from '../../constants/applicationStatusConstants';
import colorConstants from '../../constants/colorConstants';
import { formatFixed } from 'indian-number-format';
import { getTranslatedText } from '../../utils/translationUtils';
import { getTranslationLocale } from '../../utils/routeUtils';
import paymentTypeConstants from '../../constants/data/paymentType';
import { toJS } from 'mobx';

@inject('applicationForm')
@inject('localization')
@observer
class PaymentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      application_identifier: null,
      applicationPayment: {},
      error: false,
      option: paymentTypeConstants.ONLINE,
      language: '',
      isLoading: true
    };
    this.applicationForm = this.props.applicationForm;
    this.localizationStore = this.props.localization;
  }

  static getInitialProps = async ({ mobxStore, query }) => {
    const { language, applicationId } = query;
    let redirect = false;
    const translationLocale = getTranslationLocale(
      language,
      mobxStore.localization
    );
    if (applicationId) {
      const { applicationForm } = mobxStore;
      const applicationDetails = applicationForm.getApplicationData(),
        applicationType = applicationForm.getApplicationType(),
        applicationPayment = applicationForm.getApplicationPayment();
      redirect =
        !applicationDetails.applicationId ||
        applicationDetails.applicationId != applicationId;
      if (
        applicationPayment &&
        (applicationDetails.status ==
          applicationStatusConstants.SELF_DECLARATION_ACCEPTED ||
          applicationDetails.status ==
            applicationStatusConstants.PAYMENT_INITIATED)
      ) {
        return {
          error: false,
          redirect,
          applicationId: applicationId,
          applicationData: applicationDetails,
          applicationType: applicationType,
          applicationPayment: applicationPayment,
          propertyTax: applicationPayment && applicationPayment.amount === 1,
          ...translationLocale
        };
      } else {
        redirect = true;
      }
    }
    return { error: true, redirect, language, applicationId };
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
      applicationData,
      applicationType,
      applicationPayment,
      language,
      localizationBundle,
      textAlign
    } = this.props;
    if (redirect) {
      Router.replaceRoute('redirect', { applicationId, language });
    }
    if (this.props.error) {
      this.setState({ error: this.props.error, isLoading: true });
      return;
    }

    this.localizationStore.setLocalizationData({
      localizationBundle: JSON.stringify(localizationBundle),
      language,
      textAlignment: textAlign
    });
    this.setState({
      applicationPayment: toJS(applicationPayment),
      application_identifier: applicationId,
      isLoading: false
    });

    /** Auto pay as property tax if plot area is <63 */
    if (this.props.propertyTax) {
      this.setState({ option: paymentTypeConstants.PROPERTY_TAX }, () => {
        // this.pay();
      });
    }
  };

  getLabelTextAlignment = () => {
    if (this.props.textAlign) {
      return this.props.textAlign;
    }
  };

  pay = () => {
    this.setState({ isLoading: true });
    const { option, application_identifier } = this.state;
    const { language } = this.props;
    if (option !== paymentTypeConstants.ONLINE) {
      Router.replaceRoute('offline-payment', {
        language: language,
        applicationId: application_identifier,
        type: option
      });
    } else {
      Router.replaceRoute('initiate-payment', {
        language: language,
        applicationId: application_identifier,
        type: option
      });
    }
  };

  render() {
    const {
      error,
      application_identifier,
      applicationPayment,
      isLoading
    } = this.state;
    const { language } = this.props;
    const localizationBundle = this.localizationStore.getLocalizationBundle()
      ? this.localizationStore.getLocalizationBundle()
      : {};
    return error ? (
      <ErrorCard
        route='payment'
        params={{ applicationId: application_identifier, language }}
      />
    ) : (
      <LocalizationProvider messages={localizationBundle}>
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
          <React.Fragment>
            <Header
              route='payment'
              params={{ applicationId: application_identifier, language }}
              meseva_request={this.applicationForm.meseva_request}
            />
            <Container className='mb-5'>
              <Row className='align-items-center justify-content-center'>
                <Card style={{ marginTop: 50 }}>
                  <CardHeader className={this.getLabelTextAlignment()}>
                    {getTranslatedText('heading.payment')}
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col>
                        <p>
                          {getTranslatedText('label.application_id')} :{' '}
                          {application_identifier}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='12'>
                        <PaymentSummary
                          summary={applicationPayment.summary}
                          total={applicationPayment.amount}
                          paymentPage={true}
                        />
                      </Col>
                    </Row>
                    <Row className='mt-5'>
                      <Col>
                        <p>
                          Total Amount to be paid :{' '}
                          <strong>
                            Rs.
                            {applicationPayment &&
                              formatFixed(applicationPayment.amount, 2)}
                          </strong>
                        </p>
                      </Col>
                    </Row>
                    <Row className='align-items-start justify-content-center'>
                      {this.props.propertyTax && (
                        <Col xs='12'>
                          <FormRadio
                            key={paymentTypeConstants.PROPERTY_TAX}
                            checked={
                              this.state.option ===
                              paymentTypeConstants.PROPERTY_TAX
                            }
                            onChange={() =>
                              this.setState({
                                option: paymentTypeConstants.PROPERTY_TAX
                              })
                            }
                          >
                            <span
                              style={{
                                fontWeight:
                                  this.state.option ===
                                  paymentTypeConstants.PROPERTY_TAX
                                    ? 700
                                    : 200
                              }}
                            >
                              {getTranslatedText('label.property_tax_text')}
                            </span>
                          </FormRadio>
                        </Col>
                      )}
                      {/* {!this.props.propertyTax && ( */}
                      {/* {
                        <Col xs='12'>
                          <FormRadio
                            key={paymentTypeConstants.ONLINE}
                            checked={
                              this.state.option === paymentTypeConstants.ONLINE
                            }
                            onChange={() =>
                              this.setState({
                                option: paymentTypeConstants.ONLINE
                              })
                            }
                          >
                            <span
                              style={{
                                fontWeight:
                                  this.state.option ===
                                  paymentTypeConstants.ONLINE
                                    ? 700
                                    : 200
                              }}
                            >
                              {getTranslatedText('heading.pay_now')}
                            </span>
                          </FormRadio>
                        </Col>
                      } */}

                      {/* <Col xs='12'>
                      <FormRadio
                        key={paymentTypeConstants.MEESEVA}
                        checked={this.state.option === paymentTypeConstants.MEESEVA}
                        onChange={() => this.setState({ option: paymentTypeConstants.MEESEVA })}
                      >
                        <span
                          style={{
                            fontWeight:
                              this.state.option === paymentTypeConstants.MEESEVA ? 700 : 200
                          }}
                        >
                          Pay Later
                        </span>
                      </FormRadio>
                    </Col> */}
                    </Row>
                  </CardBody>
                </Card>
              </Row>
              <Row className='align-items-center justify-content-center mt-5'>
                {/* <Col xs='auto'>
                  <Button
                    theme='danger'
                    disabled={isLoading}
                    onClick={() =>
                      Router.replaceRoute('review', {
                        language: language,
                        applicationId: application_identifier
                      })
                    }
                  >
                    {getTranslatedText('button.goBack')}
                  </Button>
                </Col> */}
                <Col xs='auto'>
                  <Button
                    theme='success'
                    type='submit'
                    disabled={isLoading}
                    // || this.props.propertyTax}
                    onClick={this.pay}
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
                      ? 'Loading'
                      : this.state.option === paymentTypeConstants.ONLINE
                      ? getTranslatedText('button.proceed_to_pay')
                      : getTranslatedText('button.proceed')}
                  </Button>
                </Col>
              </Row>
            </Container>
          </React.Fragment>
        </LoadingOverlay>
      </LocalizationProvider>
    );
  }
}

export default PaymentComponent;
