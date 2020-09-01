import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';

import ErrorCard from '../../components/Error';
import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import { Router } from '../../routes';
import applicationStatusConstants from '../../constants/applicationStatusConstants';
import colorConstants from '../../constants/colorConstants';
import { getApplicationDetails } from '../../apiHelpers/applicationDetails';
import { getTranslationLocale } from '../../utils/routeUtils';

@inject('applicationForm')
@inject('localization')
@observer
class Redirects extends Component {
  static getInitialProps = async ({ mobxStore, query }) => {
    const { language, applicationId } = query;
    const translationLocale = getTranslationLocale(
      language,
      mobxStore.localization
    );

    if (applicationId) {
      const {
        applicationDetails,
        applicationType,
        applicationDocuments,
        applicationPayment,
        docsToUpload,
        acknowledgment,
        error,
        notLoggedIn
      } = await getApplicationDetails(applicationId);
      if (error) return { error: true, language, applicationId };
      return {
        applicationDetails,
        applicationDocuments,
        ...translationLocale,
        applicationId,
        applicationType,
        acknowledgment,
        applicationPayment,
        docsToUpload,
        notLoggedIn
      };
    } else {
      return { error: true, language, applicationId };
    }
  };

  constructor(props) {
    super(props);
    this.applicationForm = props.applicationForm;
    this.localizationStore = props.localization;
  }

  componentDidMount() {
    const {
      applicationDetails,
      applicationType,
      applicationDocuments,
      applicationPayment,
      docsToUpload,
      localizationBundle,
      language,
      textAlign,
      error,
      acknowledgment,
      applicationId,
      notLoggedIn
    } = this.props;
    if (notLoggedIn) {
      return Router.replaceRoute('citizen-search', { language });
    }
    if (!error) {
      this.applicationForm.setApplicationData(applicationDetails);
      this.applicationForm.setApplicationType(applicationType);
      this.applicationForm.setDocumentData(applicationDocuments);
      this.applicationForm.setDocsToUpload(docsToUpload);
      this.applicationForm.setAcknowledgment(acknowledgment);
      this.applicationForm.setApplicationPayment(applicationPayment);
      this.localizationStore.setLocalizationData({
        localizationBundle: JSON.stringify(localizationBundle),
        language,
        textAlignment: textAlign
      });
      this.redirect();
    }
  }

  redirect = () => {
    const {
      applicationId,
      language,
      applicationDetails,
      applicationType
    } = this.props;
    let redirectRoute = 'track';
    switch (applicationDetails.status) {
      case applicationStatusConstants.DRAFT:
        redirectRoute = 'documents';
        break;
      case applicationStatusConstants.DOCS_UPLOADED:
        redirectRoute = 'review';
        break;
      case applicationStatusConstants.SELF_DECLARATION_ACCEPTED:
      case applicationStatusConstants.DOCS_VERIFICATION_PENDING:
      case applicationStatusConstants.SHORTFALL:
      case applicationStatusConstants.DOCS_VERIFICATION_COMPLETED:
      case applicationStatusConstants.FEE_CERTIFICATION_PENDING:
      case applicationStatusConstants.PAYMENT_INITIATED:
      case applicationStatusConstants.PAYMENT_INITIATED_WITH_PENALTY:
      case applicationStatusConstants.PAID_ACK_SENT:
      case applicationStatusConstants.REJECTED:
        redirectRoute = 'track';
        break;
    }
    Router.replaceRoute(redirectRoute, { applicationId, language });
  };

  render() {
    const { localizationBundle, error, language, applicationId } = this.props;
    return error ? (
      <ErrorCard
        route='redirect'
        params={{ applicationId, language }}
        messages={localizationBundle}
      />
    ) : (
      <LocalizationProvider messages={localizationBundle}>
        <Fragment>
          <div>
            <Header route='redirect' params={{ applicationId, language }} />
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

export default Redirects;
