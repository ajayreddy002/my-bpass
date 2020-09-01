import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import '../../styles/index.css';

import { Container, Row, Spinner } from 'react-bootstrap';
import { alterParamsForUrl, getURL } from '../../utils/urlUtils';
import { inject, observer } from 'mobx-react';

import ErrorCard from '../../components/Error';
import Header from '../../components/Header';
import { LocalizationProvider } from 'react-localize';
import React from 'react';
import { Router } from '../../routes';
import { UI_SERVER } from '../../config/url';
import apiConstants from '../../constants/apiConstants';
import fetch from 'isomorphic-unfetch';
import { getTranslationLocale } from '../../utils/routeUtils';
import paymentType from '../../constants/data/paymentType';

@inject('applicationForm')
@inject('localization')
@observer
class InitiatePaymentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationId: null,
      language: '',
      error: false
    };
    this.applicationForm = this.props.applicationForm;
    this.localizationStore = this.props.localization;
  }

  static getInitialProps = ({ mobxStore, query }) => {
    const { language, applicationId, type } = query;
    const translationLocale = getTranslationLocale(
      language,
      mobxStore.localization
    );

    return { applicationId, ...translationLocale, type };
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

  async componentDidMount() {
    const {
      applicationId,
      localizationBundle,
      language,
      textAlign,
      error
    } = this.props;
    this.setState({ applicationId, language });
    let url = getURL(apiConstants.INITIATE_PAYMENT.USECASE);
    url = alterParamsForUrl(url, {
      identifier: applicationId,
      type: paymentType.ONLINE
    });
    let response = await fetch(url);
    if (response && response.status === 200) {
      const data = await response.json();

      var form = document.createElement('FORM');
      form.method = 'POST';
      form.action = 'https://easypay.axisbank.co.in/index.php/api/payment';

      var input = document.createElement('INPUT');
      input.name = 'i';
      input.type = 'hidden';
      input.value = data.enc;
      form.appendChild(input);

      document.body.appendChild(form);

      // window.open('', 'newWindow', 'location=yes,width=400,height=400');
      form.submit();
    } else {
      this.setState({ error: true, applicationId, language });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.id);
  }

  render() {
    const { applicationId, language, error } = this.state;
    const { localizationBundle } = this.props;
    return error ? (
      <ErrorCard
        route='initiate-payment'
        params={{ language, applicationId }}
        messages={localizationBundle}
      />
    ) : (
      <LocalizationProvider messages={localizationBundle}>
        <React.Fragment>
          <Header
            route='initiate-payment'
            params={{ language, applicationId }}
            meseva_request={this.applicationForm.meseva_request}
          />
          <Container className='mt-5'>
            <Row className='align-items-center justify-content-center'>
              <Spinner
                animation='border'
                role='status'
                variant='success'
              ></Spinner>
            </Row>
          </Container>
        </React.Fragment>
      </LocalizationProvider>
    );
  }
}

export default InitiatePaymentComponent;
