import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import '../../styles/index.css';

import { Button, Card, CardBody, CardHeader } from 'shards-react';
import { Container, Row, Spinner } from 'react-bootstrap';
import { alterParamsForUrl, getURL } from '../../utils/urlUtils';
import { inject, observer } from 'mobx-react';

import ErrorCard from '../../components/Error';
import Head from 'next/head';
import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
// import { RAZORPAY_API_KEY } from '../../constants/apiConfig';
import React from 'react';
import { Router } from '../../routes';
import { UI_SERVER } from '../../config/url';
import apiConstants from '../../constants/apiConstants';
import colorConstants from '../../constants/colorConstants';
import fetch from 'isomorphic-unfetch';
import { getTranslatedText } from '../../utils/translationUtils';
import { getTranslationLocale } from '../../utils/routeUtils';
import paymentType from '../../constants/data/paymentType';

@inject('applicationForm')
@inject('localization')
@observer
class InitiatePaymentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationId: this.props.applicationId,
      language: this.props.language,
      error: false,
      paymentCompleted: false,
      isLoading: true
    };
    this.applicationForm = this.props.applicationForm;
    this.localizationStore = this.props.localization;
    this.buttonRef = React.createRef();
  }

  static getInitialProps = ({ mobxStore, query }) => {
    const { language, applicationId, type } = query;
    const translationLocale = getTranslationLocale(
      language,
      mobxStore.localization
    );

    return { applicationId, ...translationLocale, type };
  };

  async handlePayment() {
    const { amount, applicationId } = this.state;
    let url = getURL(apiConstants.INITIATE_PAYMENT.USECASE);
    url = alterParamsForUrl(url, {
      identifier: applicationId,
      type: paymentType.ONLINE
    });
    let response = await fetch(url);

    if (response && response.status === 200) {
      const data = await response.json();
    }

    const options = {
      key: 'RAZORPAY_API_KEY',
      image: '/html/images/logo.png',
      amount: amount * 100,
      name: 'TS-bPASS Payment Process',
      description: 'DIRECTOR OF TOWN AND COUNTRY PLANNING',
      handler: async response => {
        this.setState({ isLoading: true });
        const paymentId = response.razorpay_payment_id;
        let url = getURL(apiConstants.PAYMENT_SUCCESS.USECASE);
        url = alterParamsForUrl(url, {
          identifier: applicationId,
          type: paymentType.ONLINE,
          paymentId: response.razorpay_payment_id
          // signature: response.razorpay_signature
        });
        response = await fetch(url);
        response = await response.json();
        let error = response && !response.isSuccess;
        this.setState({ paymentCompleted: true, isLoading: false });
      },
      theme: {
        color: '#ff0084'
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  }

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

  componentDidMount() {
    const {
      applicationForm,
      applicationId,
      language,
      textAlign,
      localizationBundle,
      error
    } = this.props;

    if (!applicationForm.payment) {
      Router.replaceRoute('redirect', {
        language: language,
        applicationId: applicationId
      });
    } else {
      this.setState({ ...this.state, amount: applicationForm.payment.amount });
      this.localizationStore.setLocalizationData({
        localizationBundle: JSON.stringify(localizationBundle),
        language,
        textAlignment: textAlign
      });
      setTimeout(
        function() {
          this.buttonRef.current.click();
        }.bind(this),
        500
      );
    }
  }

  getLabelTextAlignment = () => {
    if (this.props.textAlign) {
      return this.props.textAlign;
    }
  };

  render() {
    const {
      applicationId,
      language,
      error,
      isLoading,
      paymentCompleted
    } = this.state;
    const localizationBundle = this.localizationStore.getLocalizationBundle()
      ? this.localizationStore.getLocalizationBundle()
      : {};
    return error ? (
      <ErrorCard
        route='initiate-payment'
        params={{ language, applicationId }}
      />
    ) : !paymentCompleted ? (
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
            <Head>
              <script src='https://checkout.razorpay.com/v1/checkout.js'></script>
            </Head>
            <Header
              route='initiate-payment'
              params={{ language, applicationId }}
              meseva_request={this.applicationForm.meseva_request}
            />
            <Container className='mt-5'>
              <Row className='align-items-center justify-content-center'>
                <Card>
                  <CardHeader className={this.getLabelTextAlignment()}>
                    Payment
                  </CardHeader>
                  <CardBody>
                    <Row className='align-items-center justify-content-center'>
                      <h4>Proceeding to checkout</h4>
                      <button
                        ref={this.buttonRef}
                        onClick={this.handlePayment.bind(this)}
                        hidden='true'
                      >
                        Pay Now
                      </button>
                    </Row>
                  </CardBody>
                </Card>
              </Row>
            </Container>
          </React.Fragment>
        </LoadingOverlay>
      </LocalizationProvider>
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
              route='payment-response'
              params={{ applicationId, language }}
              meseva_request={this.applicationForm.meseva_request}
            />
            <Container className='mt-5'>
              <Row className='align-items-center justify-content-center'>
                <Card>
                  <CardHeader className={this.getLabelTextAlignment()}>
                    {getTranslatedText('heading.congratulations')}
                  </CardHeader>
                  <CardBody>
                    <p className={this.getLabelTextAlignment()}>
                      {getTranslatedText('label.application_id')}-{' '}
                      {applicationId}
                    </p>
                    <Row className='align-items-center justify-content-center'>
                      <Button
                        className={this.getLabelTextAlignment()}
                        theme='success'
                        href={
                          UI_SERVER +
                          apiConstants.DOWNLOAD_ACKNOWLEDGMENT.URL +
                          '?identifier=' +
                          encodeURIComponent(applicationId)
                        }
                      >
                        {getTranslatedText('button.download')}
                      </Button>
                    </Row>
                  </CardBody>
                </Card>
              </Row>
              <Row className='align-items-center justify-content-center mt-5'>
                <a href='/'>{getTranslatedText('button.back_to_home')}</a>
              </Row>
            </Container>
          </React.Fragment>
        </LoadingOverlay>
      </LocalizationProvider>
    );
  }
}

export default InitiatePaymentComponent;
