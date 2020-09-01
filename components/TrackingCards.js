import { Alert, Container } from 'react-bootstrap';
import React, { Fragment } from 'react';
import applicationStatusConstants, {
  TIMELINE_STATUSES
} from '../constants/applicationStatusConstants';

import AcknowledgmentCard from './Acknowledgment';
import CitizenActionComponent from './CitizenActionComponent';
import CitizenFeedbackCard from './CitizenFeedbackCard';
import CitizenPreProceedingTaskAction from './CitizenPreProceedingTaskAction';
import PaymentInfoCard from './PaymentInfo';
import ReviewApplication from './ReviewApplication';
import Timeline from './Timeline';
import UploadCard from './UploadCard';
import moment from 'moment';

class TrackingCard extends React.Component {
  constructor(props) {
    super(props);
    this.applicationForm = props.applicationForm;
  }

  renderTimeline = () => {
    const { applicationData: { status } = {} } = this.props || {};
    if (status)
      return (
        <div style={{ width: '80%', margin: '0 auto' }}>
          <Timeline data={TIMELINE_STATUSES} current={status} />
        </div>
      );
  };

  renderReview = () => {
    const { applicationData } = this.props;
    if (applicationData.applicationId)
      return (
        <ReviewApplication
          applicationData={this.props.applicationData}
          textAlign={this.props.textAlign}
          language={this.props.language}
        />
      );
  };

  renderUploadCard = () => {
    const { applicationData: { uploads } = {} } = this.props || {};
    const { approval_for } = this.props.applicationData;
    if (uploads)
      return (
        <UploadCard
          uploads={uploads}
          approval_for={approval_for}
          textAlign={this.props.textAlign}
          applicationId={this.props.applicationId}
        />
      );
  };

  renderPaymentCard = () => {
    const {
      applicationData: { status } = {},
      applicationPayment,
      applicationId,
      language
    } = this.props || {};
    if (applicationPayment)
      return (
        <PaymentInfoCard
          info={this.props.applicationPayment}
          textAlign={this.props.textAlign}
          appStatus={status}
          applicationId={applicationId}
          language={language}
        />
      );
  };

  renderAcknowledgment = () => {
    const { acknowledgment, applicationId } = this.props || {};
    if (acknowledgment && acknowledgment.file_url) {
      return <AcknowledgmentCard applicationId={applicationId} />;
    }
  };

  renderFeedback = () => {
    const { applicationData: { workflow, status } = {} } = this.props || {};
    if (
      status === applicationStatusConstants.SHORTFALL ||
      status === applicationStatusConstants.REJECTED
    ) {
      return <CitizenFeedbackCard workflow={workflow} />;
    }
  };

  renderActionCard = () => {
    const { applicationData: { workflow } = {} } = this.props;
    const tasks = (workflow && workflow.tasks) || [];
    let tks = tasks.filter(
      i =>
        i.status == 'IN_PROGRESS' &&
        (i.task_type === 'ADDITIONAL_DOCUMENTS_REQUESTED' ||
          i.task_type === 'PRE_PROCEEDING_CONDITIONS')
    );
    if (tks.length === 1) {
      if (tks[0].task_type === 'ADDITIONAL_DOCUMENTS_REQUESTED')
        return <CitizenActionComponent {...this.props} />;
      if (
        tks[0].task_type ===
        applicationStatusConstants.PRE_PROCEEDING_CONDITIONS
      )
        return <CitizenPreProceedingTaskAction {...this.props} />;
    }
  };

  renderAgeBanner = () => {
    const { applicationData: { workflow } = {} } = this.props;

    if (!workflow) return null;
    if (
      this.props.applicationData.status ==
        applicationStatusConstants.ACCEPTED ||
      this.props.applicationData.status == applicationStatusConstants.REJECTED
    )
      return null;

    const { age, tasks = [] } = workflow;
    const ttl = tasks
      .filter(i => i.status === 'IN_PROGRESS' && i.assigned_to === 'APPLICANT')
      .map(i => moment(i.expires_on).diff(moment(), 'days'))[0];
    return age || ttl ? (
      <Container>
        <Alert
          style={{ textAlign: 'center', fontSize: 18 }}
          variant={ttl < 5 ? 'danger' : 'primary'}
        >
          <strong>
            <div>
              Your application has taken {age} working days from the Government
              to process since day it was applied.
            </div>
            <div>
              {ttl >= 0
                ? `${ttl} days remaining for you to complete additional items to avoid application rejection.`
                : null}
            </div>
          </strong>
        </Alert>
      </Container>
    ) : null;
  };

  render() {
    return (
      <Fragment>
        {this.renderTimeline()}
        {this.renderAgeBanner()}
        {this.renderReview()}
        {this.renderUploadCard()}
        {this.renderFeedback()}
        {this.renderActionCard()}
        {this.renderPaymentCard()}
        {this.renderAcknowledgment()}
      </Fragment>
    );
  }
}

export default TrackingCard;
