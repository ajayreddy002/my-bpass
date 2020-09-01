import { Button, Card, CardBody, CardHeader } from 'shards-react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import React, { Component, Fragment } from 'react';
import { alterParamsForUrl, getURL } from '../../utils/urlUtils';
import { inject, observer } from 'mobx-react';

import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import { Router } from '../../routes';
import { UI_SERVER } from '../../config/url';
import apiConstants from '../../constants/apiConstants';
import colorConstants from '../../constants/colorConstants';
import fetch from 'isomorphic-unfetch';
import { getTranslationLocale } from '../../utils/routeUtils';
import paymentTypeConstants from '../../constants/data/paymentType';

@inject('applicationForm')
@inject('localization')
@observer
class OfflinePayment extends Component {
  static getInitialProps = async ({ mobxStore, query }) => {
    const { language, applicationId, type } = query;
    const translationLocale = getTranslationLocale(
      language,
      mobxStore.localization
    );

    if (applicationId) {
      const { applicationForm } = mobxStore;

      const applicationDetails = applicationForm.getApplicationData();
      const redirect = applicationDetails.applicationId != applicationId;
      if (!redirect) {
        let url = getURL(apiConstants.PAYMENT_SUCCESS.USECASE);
        url = alterParamsForUrl(url, {
          identifier: applicationId,
          type
        });

        try {
          const response = await fetch(url);
          if (response && response.status === 200) {
            await response.json();
            return { applicationId, ...translationLocale, type, redirect };
          }
        } catch (e) {
          return {
            error: true,
            applicationId,
            ...translationLocale,
            type,
            redirect
          };
        }
      }
      return { redirect, applicationId, ...translationLocale, type };
    }
    return {
      error: true,
      applicationId,
      ...translationLocale,
      type,
      redirect: false
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
    this.applicationForm = this.props.applicationForm;
    this.localizationStore = this.props.localization;
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const { redirect, applicationId, language } = this.props;
    if (redirect) Router.replaceRoute('redirect', { applicationId, language });
    this.setState({ isLoading: false });
  }

  render() {
    const {
      error,
      applicationId,
      language,
      type,
      localizationBundle
    } = this.props;
    const { isLoading } = this.state;
    let url = getURL(apiConstants.DOWNLOAD_ACKNOWLEDGMENT.USECASE);
    url = alterParamsForUrl(url, {
      identifier: applicationId
    });
    return error ? (
      <LocalizationProvider messages={localizationBundle}>
        <Fragment>
          <Header
            route='offline-payment'
            params={{ applicationId, language, type }}
          />
          <Container className='mt-5'>
            <Card>
              <CardHeader>Failed</CardHeader>
              <CardBody className='text-center'>
                Unable to Process your payment, please try again after sometime
              </CardBody>
            </Card>
          </Container>
        </Fragment>
      </LocalizationProvider>
    ) : (
      <LocalizationProvider messages={localizationBundle}>
        <Fragment>
          <Header
            route='offline-payment'
            params={{ applicationId, language, type }}
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
              <Card>
                <CardBody>
                  <Row
                    className='text-center align-items-center justify-content-center'
                    style={{ fontSize: '1.6rem' }}
                  >
                    <Col xs='12'>
                      Your application has been successfully submitted.
                    </Col>
                    <Col xs='12'>
                      {this.props.type === paymentTypeConstants.MEESEVA ? (
                        <span>
                          <span>Please visit nearest </span>
                          <span style={{ color: 'green' }}>mee seva</span>
                          <span> to pay your fee offline.</span>
                        </span>
                      ) : this.props.type ===
                        paymentTypeConstants.PROPERTY_TAX ? (
                        'Rs. 1 will be added in next property tax assessment'
                      ) : null}
                    </Col>
                  </Row>
                  {this.props.type === paymentTypeConstants.PROPERTY_TAX && (
                    <Row className='align-items-center justify-content-center mt-5'>
                      <Button theme='success' href={url}>
                        Download Acknowledgement
                      </Button>
                    </Row>
                  )}
                </CardBody>
              </Card>
            </LoadingOverlay>
          </Container>
        </Fragment>
      </LocalizationProvider>
    );
  }
}

export default OfflinePayment;
