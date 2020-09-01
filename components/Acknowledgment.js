import { Card, CardBody, CardHeader } from 'shards-react';
import { Col, Container, Row } from 'react-bootstrap';
import { alterParamsForUrl, getURL } from '../utils/urlUtils';

import { FiDownload } from 'react-icons/fi';
import { MdPictureAsPdf } from 'react-icons/md';
import React from 'react';
import apiConstants from '../constants/apiConstants';
import { getTranslatedText } from '../utils/translationUtils';

const AcknowlegmentCard = ({ applicationId }) => {
  let url = getURL(apiConstants.DOWNLOAD_ACKNOWLEDGMENT.USECASE);
  url = alterParamsForUrl(url, {
    identifier: applicationId
  });
  return (
    <Container className='mt-5'>
      <Row>
        <Col style={{ padding: 0 }}>
          <Card>
            <CardHeader>
              {getTranslatedText('heading.acknowledgment')}
            </CardHeader>
            <CardBody>
              <a href={url}>
                <Row className='flex-column align-items-center justify-content-around'>
                  <MdPictureAsPdf
                    style={{
                      color: 'red',
                      fontSize: '50px'
                    }}
                  />
                  <div
                    className='uploaded-item'
                    style={{ padding: 0, color: 'black' }}
                  >
                    {getTranslatedText('label.acknowledgement_letter')}
                    <FiDownload style={{ marginLeft: '10px', color: 'blue' }} />
                  </div>
                  <div style={{ color: 'grey', fontSize: '13px' }}>
                    {getTranslatedText('button.download')}
                  </div>
                </Row>
              </a>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AcknowlegmentCard;
