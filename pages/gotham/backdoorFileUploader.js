import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'shards-react';
import React, { Fragment } from 'react';
import requiredDocs, {
  sitePhotographDocs
} from '../../constants/data/requiredDocs';

import Header from '../../components/Header';
import LoadingOverlay from 'react-loading-overlay';
import { LocalizationProvider } from 'react-localize';
import { Spinner } from 'react-bootstrap';
import apiConstants from '../../constants/apiConstants';
import colorConstants from '../../constants/colorConstants';
import documentTypes from '../../constants/documentTypes';
import { getTranslatedText } from '../../utils/translationUtils';
import { getTranslationLocale } from '../../utils/routeUtils';
import { getURL } from '../../utils/urlUtils';
import { isEmpty } from 'lodash';
import { useLocalStore } from 'mobx-react';

export default class SearchApplicationForStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: '',
      localizationBundle: {},
      textAlign: '',
      isLoading: false,
      application_id: null,
      document_type: null,
      filename: null,
      file: null,
      errorMessage: null
    };
  }

  static getInitialProps = async ({ mobxStore, query }) => {
    const language = 'en';
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
    console.log(language, '...', localizationBundle);
    this.setState({ language, localizationBundle, textAlign });
  };

  setLoading = param => {
    this.setState({
      isLoading: param
    });
  };

  resetUploadForm = () => {
    this.setState({
      isLoading: false,
      application_id: null,
      document_type: null,
      file: null,
      filename: null,
      errorMessage: null
    });
  };

  alredSaveTheDay = async event => {
    event.preventDefault();
    const { application_id, document_type, file } = this.state;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', document_type);
    formData.append('identifier', application_id);

    const url = getURL(apiConstants.UPLOAD_DOCUMENTS.USECASE);
    let response = await fetch(url.toString(), {
      method: 'POST',
      body: formData
    });
    if (response && response.status === 200) {
      alert('Upload successful');
      this.resetUploadForm();
    } else {
      this.setState({ errorMessage: "Couldn't upload file" });
    }
  };

  render() {
    const {
      localizationBundle,
      isLoading,
      language,
      application_id,
      document_type,
      filename,
      errorMessage
    } = this.state;
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
            <Card style={{ maxWidth: 350, margin: 'auto', top: 100 }}>
              <CardHeader>Upload documents</CardHeader>
              <CardBody className='center-block'>
                {errorMessage && (
                  <Alert
                    theme='danger'
                    dismissible={() => {
                      this.setState({ errorMessage: null });
                    }}
                  >
                    {errorMessage}
                  </Alert>
                )}
                <Form>
                  <Row>
                    {/* Application ID */}
                    <Col xs='12'>
                      <FormGroup className={this.props.textAlign}>
                        <label htmlFor='application_id'>
                          <strong>
                            {getTranslatedText('label.application_id')}
                          </strong>
                        </label>
                        <FormInput
                          id='#application_id'
                          placeholder='Application ID'
                          onChange={event =>
                            this.setState({
                              application_id: event.target.value
                            })
                          }
                          value={application_id ? application_id : ''}
                          name='application_id'
                          valid={!isEmpty(application_id)}
                          invalid={application_id === ''}
                        />
                      </FormGroup>
                    </Col>
                    <Col xs='12'>
                      <FormGroup className={this.props.textAlign}>
                        <label htmlFor='document_type'>
                          <strong>Document Type</strong>
                        </label>
                        <FormSelect
                          id='#document_type'
                          onChange={event =>
                            this.setState({
                              document_type: event.target.value
                            })
                          }
                          value={document_type ? document_type : ''}
                          name='document_type'
                          valid={!isEmpty(document_type)}
                          invalid={document_type === ''}
                        >
                          <option value=''>Select</option>
                          {requiredDocs.map((value, index) => {
                            return (
                              <option value={value} key={index}>
                                {documentTypes[value]}
                              </option>
                            );
                          })}
                          {sitePhotographDocs.map((value, index) => {
                            return (
                              <option value={value} key={index}>
                                {documentTypes[value]}
                              </option>
                            );
                          })}
                        </FormSelect>
                      </FormGroup>
                    </Col>

                    <Col xs='12'>
                      <label htmlFor='document_type'>
                        <strong>File to upload</strong>
                      </label>
                      <FormInput
                        id='file'
                        type='file'
                        accept='.pdf,image/*'
                        name='file'
                        onChange={event => {
                          if (
                            event.target.value &&
                            event.target.value.length > 0
                          )
                            this.setState({
                              filename: event.target.value,
                              file: event.target.files[0]
                            });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs='12' className='text-center'>
                      <Button
                        theme='success'
                        style={{ marginTop: '30px' }}
                        disabled={
                          isEmpty(application_id) ||
                          isEmpty(document_type) ||
                          isEmpty(filename) ||
                          isLoading
                        }
                        onClick={event => {
                          this.alredSaveTheDay(event);
                        }}
                        type='submit'
                      >
                        {isLoading ? (
                          <Spinner
                            as='span'
                            animation='grow'
                            size='sm'
                            role='status'
                            aria-hidden='true'
                          />
                        ) : null}
                        {isLoading ? 'Uploading...' : 'Upload Document'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </div>
        </LoadingOverlay>
      </LocalizationProvider>
    );
  }
}
