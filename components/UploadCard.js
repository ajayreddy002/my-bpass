import { Button, Card, CardBody, CardHeader } from 'shards-react';
import {
  Col,
  Container,
  ListGroup,
  Overlay,
  Row,
  Tooltip
} from 'react-bootstrap';
import React, { useRef, useState } from 'react';
import { alterParamsForUrl, getURL } from '../utils/urlUtils';
import requiredDocs, {
  sitePhotographDocs
} from '../constants/data/requiredDocs';

import { FiDownload } from 'react-icons/fi';
import apiConstants from '../constants/apiConstants';
import documentTypes from '../constants/documentTypes';
import { getTranslatedText } from '../utils/translationUtils';
import requiredDocsForLayout from '../constants/data/requiredDocsForLayout';
import stringConstants from '../constants/stringConstants';

const UploadedItem = ({ data, applicationId }) => {
  const { file_url, file_type } = data;
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const getDisplayName = file =>
    documentTypes[file]
      ? documentTypes[file]
      : file.split('_')
      ? file.split('_').join(' ')
      : file;
  let url = getURL(apiConstants.DOWNLOAD_DOCUMENTS.USECASE);
  url = alterParamsForUrl(url, {
    identifier: applicationId,
    file_type
  });

  return (
    <div className='uploaded-item'>
      <a
        ref={target}
        href={url}
        target='_blank'
        onMouseOver={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {file_type === 'sale_deed'
          ? 'Ownership Document'
          : getDisplayName(file_type)}
        <FiDownload style={{ marginLeft: '10px', color: 'blue' }} />
        <Overlay target={target.current} show={show} placement='top'>
          {props => (
            <Tooltip id='overlay-example' {...props}>
              Click to download
            </Tooltip>
          )}
        </Overlay>
      </a>
    </div>
  );
};
class UploadCard extends React.Component {
  render() {
    const { uploads = [], applicationId } = this.props;
    let upload_files =
      this.props.approval_for === stringConstants.BUILDING
        ? requiredDocs
        : requiredDocsForLayout;
    upload_files.push.apply(upload_files, sitePhotographDocs);
    upload_files.push('ADDITIONAL_DOCUMENT');
    return (
      <Container className='mt-5'>
        <Row>
          <Col style={{ padding: 0 }}>
            <Card>
              <CardHeader>
                {getTranslatedText('heading.uploaded_document')}
              </CardHeader>
              <CardBody>
                {uploads.map((val, ind) => {
                  if (upload_files.indexOf(val.file_type) > -1)
                    return (
                      <UploadedItem
                        key={'uploaded_' + ind}
                        data={val}
                        applicationId={applicationId}
                      />
                    );
                })}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default UploadCard;
