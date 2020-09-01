import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';

import { Card, CardBody, CardHeader } from 'shards-react';
import { Container, Row } from 'react-bootstrap';
import React, { Fragment } from 'react';
import jwt, { decode } from 'jsonwebtoken';

import AdminSubHeader from '../../components/AdminSubHeaderComponent';
import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import { Router } from '../../routes';
import colorConstants from '../../constants/colorConstants';
import cookie from 'react-cookies';
import { getLocalizationBundleForLanguage } from '../../utils/translationUtils';

export default function withValidation(Component, isCreate) {
  return class extends React.Component {
    static getInitialProps = async ctx => {
      const { asPath, query } = ctx;
      let pageProperties =
        Component.getInitialProps && (await Component.getInitialProps(ctx));

      return {
        ...pageProperties,
        path: asPath.replace('/govt/', ''),
        route: query.route
      };
    };

    constructor(props) {
      super(props);
      this.state = {
        decoded: null,
        isLoading: true
      };
    }

    componentDidMount() {
      const access_token = cookie.load('access_token');
      if (access_token) {
        const decoded = jwt.decode(access_token);
        var current_time = Date.now() / 1000;
        if (decoded.exp < current_time) {
          //Checking expiry
          console.log('Checking expiry')
          Router.replaceRoute('admin-login', { route: this.props.path });
          return;
        }
        this.setState({ decoded, isLoading: false });
      } else {
        console.log('access_token not exist')
        Router.replaceRoute('admin-login', { route: this.props.path });
        return;
      }
    }

    render() {
      const { decoded, isLoading } = this.state;
      const localizationProvider = getLocalizationBundleForLanguage('en');
      if (!decoded || (isCreate && decoded.admin_type !== 'SUPER_ADMIN')) {
        return (
          <LocalizationProvider messages={localizationProvider}>
            <Fragment>
              <Header />
              <AdminSubHeader />
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
                    <CardHeader>Failed</CardHeader>
                    <CardBody className='text-center'>
                      You are not entitled to access this page
                    </CardBody>
                  </Card>
                </LoadingOverlay>
              </Container>
            </Fragment>
          </LocalizationProvider>
        );
      }
      return (
        <LocalizationProvider messages={localizationProvider}>
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
            <Fragment>
              <Component
                {...this.props}
                userDetails={decoded}
                isCreate={isCreate}
              />
            </Fragment>
          </LoadingOverlay>
        </LocalizationProvider>
      );
    }
  };
}
