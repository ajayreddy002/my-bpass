import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import '../../styles/index.css';

import { Button, Card, CardBody, CardHeader, Form } from 'shards-react';
import { Container, Row } from 'react-bootstrap';
import { alterParamsForUrl, getURL } from '../../utils/urlUtils';
import { inject, observer } from 'mobx-react';

import ErrorCard from '../../components/Error';
import Header from '../../components/Header';
import { LocalizationProvider } from 'react-localize';
import React from 'react';
import { UI_SERVER } from '../../config/url';
import apiConstants from '../../constants/apiConstants';
import fetch from 'isomorphic-unfetch';
import { getTranslationLocale } from '../../utils/routeUtils';
import { isEmpty } from 'lodash';

@inject('applicationForm')
@inject('localization')
@observer
class DownloadAckComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      application_identifier: null,
      url: null
    };
    this.applicationForm = this.props.applicationForm;
    this.localizationStore = this.props.localization;
  }

  static getInitialProps = async ({ mobxStore, query }) => {
    const { language, hash } = query;
    const translationLocale = getTranslationLocale(
      language,
      mobxStore.localization
    );
    let error = isEmpty(hash);
    if (!error) {
      let url = getURL(apiConstants.GET_APPLICATION_ID_FROM_HASH.USECASE);
      url = alterParamsForUrl(url, { hash: hash });
      let response = await fetch(url);
      if (response && response.status === 200) {
        response = await response.json();
        const application_identifier = response.identifier;
        return { error, application_identifier, ...translationLocale };
      } else
        return {
          error: true
        };
    }
    return { error, ...translationLocale };
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
      error,
      application_identifier,
      localizationBundle,
      language,
      textAlign
    } = this.props;
    if (!error) {
      this.localizationStore.setLocalizationData({
        localizationBundle: JSON.stringify(localizationBundle),
        language,
        textAlignment: textAlign
      });
      const application_identifier_original = application_identifier.replace(
        /-/g,
        '/'
      );
      let url = getURL(apiConstants.DOWNLOAD_ACKNOWLEDGMENT.USECASE);
      url = alterParamsForUrl(url, {
        identifier: application_identifier_original
      });

      this.setState({ error, application_identifier, url }, () => {
        this.downloadFile();
      });
    } else {
      this.setState({ error: true });
    }
  };

  downloadFile = () => {
    const { url, application_identifier } = this.state;
    var link = document.createElement('a');
    link.href = url;
    link.download = application_identifier + '.pdf';
    if (application_identifier) link.dispatchEvent(new MouseEvent('click'));
  };

  render() {
    const {
      application_identifier,
      error,
      url,
      localizationBundle
    } = this.props;
    return error ? (
      <ErrorCard
        route='download-acknowledgement'
        message='Application does not exist. Please check the url you have entered'
        hide_language={true}
        messages={localizationBundle}
      />
    ) : (
      <React.Fragment>
        <LocalizationProvider messages={localizationBundle}>
          <Header route='download-acknowledgement' hide_language={true} />
          <Container className='mt-5'>
            <Row className='align-items-center justify-content-center'>
              <Card>
                <CardBody>
                  <p>Download manually if your file is not auto-downloaded</p>
                  <Row className='align-items-center justify-content-center'>
                    <Button theme='success' onClick={this.downloadFile}>
                      Download Acknowledgement
                    </Button>
                  </Row>
                </CardBody>
              </Card>
            </Row>
          </Container>
        </LocalizationProvider>
      </React.Fragment>
    );
  }
}

export default DownloadAckComponent;
