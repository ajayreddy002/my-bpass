export default {
  DRAFT: 'DRAFT',
  DOCS_UPLOADED: 'DOCS_UPLOADED',
  SELF_DECLARATION_ACCEPTED: 'SELF_DECLARATION_ACCEPTED',
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  DOCS_VERIFICATION_PENDING: 'DOCS_VERIFICATION_PENDING',
  DOCS_VERIFICATION_COMPLETED: 'DOCS_VERIFICATION_COMPLETED',
  FEE_CERTIFICATION_PENDING: 'FEE_CERTIFICATION_PENDING',
  SHORTFALL: 'SHORTFALL',
  PAYMENT_INITIATED_WITH_PENALTY: 'PAYMENT_INITIATED_WITH_PENALTY',
  POST_PROCESSING_PENDING: 'POST_PROCESSING_PENDING',
  ADDITIONAL_DOCUMENTS_REQUIRED: 'ADDITIONAL_DOCUMENTS_REQUIRED',
  FINAL_REVIEW_PENDING: 'FINAL_REVIEW_PENDING',
  PAID_ACK_SENT: 'PAID_ACK_SENT',
  REJECTED: 'REJECTED',
  ACCEPTED: 'ACCEPTED',
  PRE_PROCEEDING_CONDITIONS: 'PRE_PROCEEDING_CONDITIONS'
};
export const DISPLAY_STATUS = {
  // DRAFT: 'DRAFT',
  // DOCS_UPLOADED: 'Documents Uploaded',
  // SELF_DECLARATION_ACCEPTED: 'Self-declaration accepted',
  // PAYMENT_INITIATED: 'Payment Initiated',
  // DOCS_VERIFICATION_PENDING: 'Application verification pending from MA&UD',
  // DOCS_VERIFICATION_COMPLETED: 'Application verification completed',
  // FEE_CERTIFICATION_PENDING: 'Pending Fee certification',
  // SHORTFALL: 'Shortfall',
  // PAYMENT_INITIATED_WITH_PENALTY: 'Payment Initiated with Late fee',
  POST_PROCESSING_PENDING: 'POST_PROCESSING_PENDING',
  // ADDITIONAL_DOCUMENTS_REQUIRED: 'Additional documents needed',
  // PAID_ACK_SENT: 'Acknowledgment sent',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  FINAL_REVIEW_PENDING: 'Post verification is pending in final review'

  // PRE_PROCEEDING_CONDITIONS: 'Applicant to accept pre-proceeding conditions'
};

export const TIMELINE_STATUSES = [
  {
    key: 'DRAFT',
    status: 'Draft'
  },
  {
    key: 'DOCS_UPLOADED',
    status: 'Documents Uploaded'
  },
  [
    {
      key: 'SELF_DECLARATION_ACCEPTED',
      status: 'Self Declaration accepted'
    },
    {
      key: 'DOCS_VERIFICATION_PENDING',
      status: 'Verifying Application Documents '
    },
    {
      key: 'DOCS_VERIFICATION_COMPLETED',
      status: 'Application Verification Complete'
    },
    { key: 'FEE_CERTIFICATION_PENDING', status: 'Pending Fee Certification' },

    {
      key: 'SHORTFALL',
      status: 'Shortfall'
    },
    {
      key: 'PRE_PROCEEDING_CONDITIONS',
      status: 'Pre-proceeding conditons'
    },
    {
      key: 'ADDITIONAL_DOCUMENTS_REQUIRED',
      status: 'Additional Document Required'
    }
  ],
  [
    {
      key: 'PAYMENT_INITIATED',
      status: 'Payment Initiated'
    },
    {
      key: 'PAYMENT_INITIATED_WITH_PENALTY',
      status: 'Payment Initiated'
    },
    {
      key: 'OFFLINE_PENDING',
      status: 'Payment Pending'
    }
  ],
  [
    {
      key: 'PAID_ACK_SENT',
      status: 'Acknowledgement Sent'
    },
    {
      key: 'REJECTED',
      status: 'Rejected'
    },
    {
      key: 'ACCEPTED',
      status: 'Accepted'
    },
    {
      key: 'POST_PROCESSING_PENDING',
      status: 'Pending post verifitcation'
    },
    {
      key: 'FINAL_REVIEW_PENDING',
      status: 'Pending in Final Review'
    }
  ]
];
