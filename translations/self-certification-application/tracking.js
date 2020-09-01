import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import '../../styles/index.css';

import {
  getLocalizationBundleForLanguage,
  getTextAlignmentForLanguage
} from '../../utils/translationUtils';
import { inject, observer } from 'mobx-react';

import ErrorCard from '../../components/Error';
import Header from '../../components/Header';
import { LocalizationProvider } from 'react-localize';
import React from 'react';
import { Router } from '../../routes';
import TrackingCards from '../../components/TrackingCards';
import { getTranslationLocale } from '../../utils/routeUtils';

@inject('applicationForm')
@inject('localization')
@observer
class Tracking extends React.Component {
  constructor(props) {
    super(props);
    this.applicationForm = props.applicationForm;
    this.localizationStore = props.localization;
  }
  static getInitialProps = async ({ query, mobxStore }) => {
    const { applicationId, language } = query;

    const translationLocale = getTranslationLocale(
      language,
      mobxStore.localization
    );

    if (applicationId) {
      const { applicationForm } = mobxStore;
      const applicationDetails = applicationForm.getApplicationData(),
        applicationPayment = applicationForm.getApplicationPayment(),
        acknowledgment = applicationForm.getAcknowledgment();
      const redirect =
        !applicationDetails.applicationId ||
        applicationDetails.applicationId != applicationId;
      return {
        error: false,
        redirect,
        applicationId: applicationId,
        applicationData: applicationDetails,
        applicationPayment: applicationPayment,
        acknowledgment,
        ...translationLocale
      };
    } else {
      return { error: true, applicationId, ...translationLocale };
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

  componentDidMount() {
    const {
      redirect,
      applicationId,
      localizationBundle,
      language,
      textAlign
    } = this.props;
    if (redirect) Router.replaceRoute('redirect', { applicationId, language });
    else {
      this.localizationStore.setLocalizationData({
        localizationBundle: JSON.stringify(localizationBundle),
        language,
        textAlignment: textAlign
      });
    }
  }

  render() {
    const { error, applicationId, language } = this.props;

    const localizationBundle = this.localizationStore.getLocalizationBundle()
      ? this.localizationStore.getLocalizationBundle()
      : {};
    return error ? (
      <ErrorCard route='track' params={{ applicationId, language }} />
    ) : (
      <LocalizationProvider messages={localizationBundle}>
        <div style={{ paddingBottom: '15px' }}>
          {/* <Header /> */}

          <Header route='track' params={{ applicationId, language }} />

          <TrackingCards {...this.props} />
        </div>
      </LocalizationProvider>
    );
  }
}

export default Tracking;
