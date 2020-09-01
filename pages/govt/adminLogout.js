import { Col, Row } from 'shards-react';
import React, { Component, Fragment } from 'react';

import { LocalizationProvider } from 'react-localize';
import Router from 'next/router';
// import { Router } from '../../routes';
import cookie from 'react-cookies';
import { getLocalizationBundleForLanguage } from '../../utils/translationUtils';

class AdminLogoutScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    cookie.remove('access_token', { path: '/' });
    this.redirectToLogin();
  }

  redirectToLogin() {
    Router.push('/govt/login');
  }

  render() {
    const localizationProvider = getLocalizationBundleForLanguage('en');
    return (
      <LocalizationProvider messages={localizationProvider}>
        <Fragment>
          <Row className='text-center' style={{ marginTop: 30 }}>
            <Col>
              <span>Logging you out ...</span>
            </Col>
          </Row>
        </Fragment>
      </LocalizationProvider>
    );
  }
}

export default AdminLogoutScreen;
