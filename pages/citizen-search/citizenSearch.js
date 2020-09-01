import { Button, Col, Row } from 'shards-react';
import React, { Fragment } from 'react';

import ApplicationLoginComponent from '../../components/ApplicationLoginComponent';
import ApplicationSearch from './ApplicationSearch';
import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import { Router } from '../../routes';
import colorConstants from '../../constants/colorConstants';
import { getTranslatedText } from '../../utils/translationUtils';
import { getTranslationLocale } from '../../utils/routeUtils';

export default class CitizenSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: '',
      localizationBundle: {},
      textAlign: '',
      isLoading: false
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

  navigateToQuickTrackPage = () => {
    this.setLoading(true);
    Router.replaceRoute('citizen-application-track', {
      language: this.state.language
    });
    return;
  };

  render() {
    const { localizationBundle, isLoading, language } = this.state;
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
            <div className='text-right mb-3'>
              <Button theme='info' onClick={this.navigateToQuickTrackPage}>
                {getTranslatedText('button.track_application_status')}
              </Button>
            </div>
            <ApplicationLoginComponent
              {...this.props}
              setLoading={this.setLoading}
            />
            {/* <div className='mt-4'>
              <ApplicationSearch {...this.props} />
            </div> */}
          </div>
        </LoadingOverlay>
      </LocalizationProvider>
    );
  }
}
