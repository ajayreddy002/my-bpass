import { Card, CardBody, CardHeader } from 'shards-react';
import { Container, Row } from 'react-bootstrap';
import React, { Fragment } from 'react';

import Header from './Header';
import { LocalizationProvider } from 'react-localize';
import { Router } from '../routes';
import { getLocalizationBundleForLanguage } from '../utils/translationUtils';
import paymentType from '../constants/data/paymentType';

const ErrorCard = props => {
  const { route, params: { applicationId, language } = {}, message } = props,
    paymentPage = route.indexOf('payment') !== -1;

  const localizationProvider = getLocalizationBundleForLanguage(language);

  return (
    <Fragment>
      <LocalizationProvider messages={localizationProvider}>
        <Header {...props} />
        <Container className='mt-5'>
          <Card>
            <CardHeader>Failed</CardHeader>
            <CardBody className='text-center'>
              {message
                ? message
                : paymentPage
                ? 'Unable to process your payment'
                : 'Unable to fetch the details of this application'}
              {paymentPage ? (
                <Row className='align-items-center justify-content-center mt-5'>
                  <a
                    href='#'
                    onClick={() =>
                      Router.replaceRoute('redirect', {
                        applicationId,
                        language
                      })
                    }
                  >
                    Track your status
                  </a>
                </Row>
              ) : null}
            </CardBody>
          </Card>
        </Container>
      </LocalizationProvider>
    </Fragment>
  );
};

export default ErrorCard;
