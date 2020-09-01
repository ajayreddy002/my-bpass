import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import '../../styles/index.css';

import { Button, Card, CardBody, CardHeader } from 'shards-react';
import { Container, Row } from 'react-bootstrap';
import { alterParamsForUrl, getURL } from '../../utils/urlUtils';
import { inject, observer } from 'mobx-react';

import { Router } from '../../routes';
import ErrorCard from '../../components/Error';
import Header from '../../components/Header';
import { LocalizationProvider } from 'react-localize';
import React from 'react';
import { UI_SERVER } from '../../config/url';
import apiConstants from '../../constants/apiConstants';
import { getTranslatedText } from '../../utils/translationUtils';
import { getTranslationLocale } from '../../utils/routeUtils';
import paymentType from '../../constants/data/paymentType';
import LoadingOverlay from 'react-loading-overlay';
import colorConstants from '../../constants/colorConstants';

@inject('applicationForm')
@inject('localization')
@observer
class PaymentResponseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationId: null,
      isLoading: true
    };
    this.applicationForm = this.props.applicationForm;
    this.localizationStore = this.props.localization;
  }

  static getInitialProps = async ({ mobxStore, query }) => {
    const { language, applicationId, i } = query;
    let error = false,
      is_advance_payment = false;
    const translationLocale = getTranslationLocale(
      language,
      mobxStore.localization
    );
    let url = getURL(apiConstants.PAYMENT_SUCCESS.USECASE);
    url = alterParamsForUrl(url, {
      identifier: applicationId,
      type: paymentType.ONLINE,
      encryptedResponse: i
    });
    try {
      let response = await fetch(url);
      response = await response.json();
      error = response && !response.isSuccess;
      is_advance_payment = response && response.is_advance_payment;
    } catch (e) {
      error = true;
    }

    return { error, applicationId, is_advance_payment, ...translationLocale };
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
      applicationId,
      language,
      textAlign,
      localizationBundle,
      is_advance_payment
    } = this.props;
    this.setState({ applicationId });
    if (is_advance_payment) {
      Router.replaceRoute('track', { applicationId, language });
      return;
    }

    this.localizationStore.setLocalizationData({
      localizationBundle: JSON.stringify(localizationBundle),
      language,
      textAlignment: textAlign
    });
    this.setState({ isLoading: false });
  };

  getLabelTextAlignment = () => {
    if (this.props.textAlign) {
      return this.props.textAlign;
    }
  };

  render() {
    const { applicationId, language, error } = this.props;
    const { isLoading } = this.state;
    const localizationBundle = this.localizationStore.getLocalizationBundle()
      ? this.localizationStore.getLocalizationBundle()
      : {};
    return error ? (
      <ErrorCard
        route='payment-response'
        params={{ applicationId, language }}
      />
    ) : (
      <LocalizationProvider messages={localizationBundle}>
        <React.Fragment>
          <Header
            route='payment-response'
            params={{ applicationId, language }}
            meseva_request={this.applicationForm.meseva_request}
          />
          <Container className='mt-5'>
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
              <div>
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
              </div>
            </LoadingOverlay>
          </Container>
        </React.Fragment>
      </LocalizationProvider>
    );
  }
}

export default PaymentResponseComponent;
