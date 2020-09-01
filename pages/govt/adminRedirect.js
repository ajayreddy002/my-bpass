import React, { Component, Fragment } from 'react';

import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import { Router } from '../../routes';
import colorConstants from '../../constants/colorConstants';
import { getLocalizationBundleForLanguage } from '../../utils/translationUtils';
import withValidation from './withValidation';

class AdminRedirects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
  }

  componentDidMount() {
    const { userDetails: { admin_type = '' } = {}, route } = this.props;
    switch (admin_type) {
      case 'SUPER_ADMIN':
        if (route === 'create') Router.replaceRoute('admin-create');
        else Router.replaceRoute('admin-create');
        break;
      default:
        Router.replaceRoute('admin-list');
    }
  }

  render() {
    const localizationProvider = getLocalizationBundleForLanguage('en');
    return (
      <LocalizationProvider messages={localizationProvider}>
        <Fragment>
          <Header route='admin-redirect' />
          <div>
            <LoadingOverlay
              active={true}
              spinner
              text={'Fetching the information'}
              styles={{
                overlay: base => ({
                  ...base,
                  background: colorConstants.overlayBackground
                })
              }}
            >
              <div style={{ width: '100%', height: '100vh' }}></div>
            </LoadingOverlay>
          </div>
        </Fragment>
      </LocalizationProvider>
    );
  }
}

export default withValidation(AdminRedirects);
