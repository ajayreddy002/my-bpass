export default {
  LOCATION_DROPDOWN: {
    USECASE: 'LOCATION_DROPDOWN',
    URL: '/api/form/location'
  },
  FLOOR_DROPDOWN: {
    USECASE: 'FLOOR_DROPDOWN',
    URL: '/api/form/floors'
  },
  SRO_DROPDOWN: {
    USECASE: 'SRO_DROPDOWN',
    URL: '/api/form/sro'
  },
  GET_APPLICATION_DETAILS: {
    USECASE: 'GET_DETAILS_OF_APPLICATION',
    URL: '/api/application/details?identifier=:appId'
  },
  GET_AUTHN_APPLICATION_DETAILS: {
    USECASE: 'GET_DETAILS_OF_APPLICATION_AUTHENTICATED',
    URL: '/api/application/details'
  },
  INITIATE_PAYMENT: {
    USECASE: 'INITIATE_PAYMENT_FOR_APPLICATION',
    URL: '/api/application/initiatePayment?identifier=:appId&type=:type'
  },
  PAYNIMO_INITIATE_PAYMENT: {
    USECASE: 'PAYNIMO_INITIATE_PAYMENT',
    URL: '/api/paynimo/payment/initiation'
  },
  PAYNIMO_RETURN: {
    USECASE: 'PAYNIMO_RETURN',
    URL: '/api/paynimo/payment/return'
  },
  SELF_DECLARATION_UPDATE: {
    USECASE: 'SELF_DECLARATION_ACCEPTED',
    URL: '/api/application/acceptSelfDeclaration?identifier=:appId'
  },
  VALIDATE_DOCUMENTS: {
    USECASE: 'VALIDATE_DOCUMENT_UPLOADS',
    URL: '/api/application/validate?identifier=:appId'
  },
  UPLOAD_DOCUMENTS: {
    USECASE: 'UPLOAD_DOCUMENTS_FOR_APPLICATION',
    URL: '/api/application/upload'
  },
  CREATE_APPLICATION: {
    USECASE: 'CREATE_APPLICATION',
    URL: '/api/application/create'
  },
  DOWNLOAD_DOCUMENTS: {
    USECASE: 'DOWNLOAD_DOCUMENTS',
    URL:
      '/api/application/downloadDocument?identifier=:appId&file_type=:fileType'
  },
  DOWNLOAD_ACKNOWLEDGMENT: {
    USECASE: 'DOWNLOAD_ACKNOWLEDGMENT',
    URL: '/api/application/acknowledgment'
  },
  AUTO_DCR_VALIDATE: {
    USECASE: 'AUTO_DCR_VALIDATE',
    URL: '/api/application/autoDCRValidate'
  },
  ADD_AUTO_DCR_FIELDS: {
    USECASE: 'ADD_AUTO_DCR_FIELDS',
    URL: '/api/application/addAutoDcrFields'
  },
  PAYMENT_SUCCESS: {
    USECASE: 'PAYMENT_SUCCESS',
    URL: '/api/paynimo/payment/processPayment?identifier=:appId&type=:type'
  },
  RESET_APPLICATION_PASSWORD: {
    USECASE: 'RESET_APPLICAITON_PASSWORD',
    URL: '/api/application/resetPassword?identifier=:appId'
  },
  UPDATE_AUTO_DCR: {
    USECASE: 'UPDATE_AUTO_DCR',
    URL: '/api/application/validateAutoDcr'
  },
  GET_APPLICATION_LIST_FOR_ADMIN: {
    USECASE: 'GET_LIST_OF_APPLICATIONS_FOR_ADMIN',
    URL: '/api/admin/allApplications'
  },
  CREATE_ADMIN: {
    USECASE: 'CREATE_ADMIN',
    URL: '/api/admin/create'
  },
  ADMIN_ROLES: {
    USECASE: 'GET_ALL_ADMIN_ROLES',
    URL: '/api/admin/allAdminRoles'
  },
  ALL_OPEN_WORKFLOWS: {
    USECASE: 'ALL_OPEN_WORKFLOWS',
    URL: '/api/admin/allWorkFlowInProgress'
  },
  ADMIN_LOGIN: {
    USECASE: 'ADMIN_LOGIN',
    URL: '/api/admin/auth'
  },
  RESET_ADMIN_PASSWORD: {
    USECASE: 'RESET_ADMIN_PASSWORD',
    URL: '/api/admin/resetPassword'
  },
  UNIQUE_USER: {
    USECASE: 'UNIQUE_USER',
    URL: '/api/admin/search?user_id=:user_id'
  },
  GET_APPLICATION_ID_FROM_HASH: {
    USECASE: 'GET_APPLICATION_ID_FROM_HASH',
    URL: '/api/application/getIdentifierFromHash'
  },
  ADD_REVIEW: {
    USECASE: 'ADD_REVIEW',
    URL: '/api/workflow/admin/review'
  },
  APPROVE_APPLICATION: {
    USECASE: 'APPROVE_APPLICATION',
    URL: '/api/workflow/admin/approve'
  },
  REJECT_APPLICATION: {
    USECASE: 'REJECT_APPLICATION',
    URL: '/api/workflow/admin/reject'
  },
  SHORTFALL: {
    USECASE: 'SHORTFALL',
    URL: '/api/workflow/admin/shortfall'
  },
  REQ_DOCUMENT: {
    USECASE: 'REQ_DOCUMENT',
    URL: '/api/workflow/admin/document/request'
  },
  NO_DOC_REQUIRED: {
    USECASE: 'NO_DOC_REQUIRED',
    URL: '/api/workflow/admin/document/approve'
  },
  CERTIFY_FEE: {
    USECASE: 'CERTIFY_FEE',
    URL: '/api/workflow/admin/certify-fee'
  },
  APPROVE_POST_PROCESSING: {
    USECASE: 'APPROVE_POST_PROCESSING',
    URL: '/api/workflow/admin/postprocessing/approve'
  },
  REJECT_POST_PROCESSING: {
    USECASE: 'REJECT_POST_PROCESSING',
    URL: '/api/workflow/admin/postprocessing/reject'
  },
  GET_VALIDATION_FIELDS: {
    USECASE: 'GET_VALIDATION_FIELDS',
    URL: '/api/workflow/validation/fields'
  },
  SUBMIT_ADDITIONAL_DOCUMENT: {
    USECASE: 'SUBMIT_ADDITIONAL_DOCUMENT',
    URL: '/api/workflow/document/submit'
  },
  APPLICATION_SETBACKS: {
    USECASE: 'APPLICATION_SETBACK',
    URL: '/api/form/setback'
  },
  APPLICATION_SLUM_AREA: {
    USECASE: 'APPLICATION_SLUM_AREA',
    URL: '/api/form/slum_area'
  },
  GET_ADMIN_TEAMS: {
    USECASE: 'GET_ADMIN_TEAMS',
    URL: '/api/admin/team/search'
  },
  CREATE_TEAM: {
    USECASE: 'CREATE_TEAM',
    URL: '/api/admin/team/create'
  },
  APPLICATION_MARKET_VALUE: {
    USECASE: 'APPLICATION_MARKET_VALUE',
    URL: '/api/form/market_value'
  },
  GET_REPORT: {
    USECASE: 'GET_REPORT',
    URL: '/api/reporting/UlbWiseApplicationsCount'
  },
  GET_STATS: {
    USECASE: 'GET_STATS',
    URL: '/api/reporting/ulb_stats'
  },
  GET_CHASING_STATS: {
    USECASE: 'GET_CHASING_STATS',
    URL: '/api/reporting/chasing_stats_by_ulb'
  },
  GET_REPORT_FOR_ULB: {
    USECASE: 'GET_REPORT_FOR_ULB',
    URL: '/api/reporting/applicationForUlb'
  },
  OPEN_APPLICATION_SEARCH: {
    USECASE: 'OPEN_APPLICATION_SEARCH',
    URL: '/api/application/userApplicationSearch'
  },
  GET_ADMIN_BY_ROLE: {
    USECASE: 'GET_ADMIN_BY_ROLE',
    URL: '/api/admin/entitlements/search'
  },
  ASSIGN_TASK: {
    USECASE: 'ASSIGN_TASK',
    URL: '/api/workflow/admin/task/assign'
  },
  GET_APPLICATION_FOR_TASK_MANAGER: {
    USECASE: 'GET_APPLICATION_FOR_TASK_MANAGER',
    URL: '/api/admin/allTaskAssignmentApplications'
  },
  GET_OTP: {
    USECASE: 'GET_OTP',
    URL: '/api/otp/generate'
  },
  VERIFY_OTP: {
    USECASE: 'VERIFY_OTP',
    URL: '/api/otp/validate'
  },
  ADD_COMMENT: {
    USECASE: 'ADD_COMMENT',
    URL: '/api/admin/comment'
  },
  ADMIN_CHANGE_PASSWORD: {
    USECASE: 'ADMIN_CHANGE_PASSWORD',
    URL: '/api/admin/changePassword'
  },
  ADMIN_PRE_PROCEEDING_CONDITIONS: {
    USECASE: 'ADMIN_PRE_PROCEEDING_CONDITIONS',
    URL: '/api/workflow/admin/pre-proceeding/request'
  },
  APPLICANT_PRE_PROCEEDING_ACCEPT: {
    USECASE: 'APPLICANT_PRE_PROCEEDING_ACCEPT',
    URL: '/api/workflow/pre-proceeding/accept'
  },


  // Frontend User Api's
   
  USER_LOGIN: {
    USECASE: 'USER_LOGIN',
    URL: '/oauth/token'
  },
  USER_DETAILS: {
    USECASE: 'USER_DETAILS',
    URL: '/api/v1/users/token'
  },
  SEARCH_VILLAGE: {
    USECASE: 'SEARCH_VILLAGE',
    URL: '/api/v1/villages/search'
  },
  SLUM_AREA: {
    USECASE: 'SLUM_AREA',
    URL: '/api/v1/villages/slums'
  },
  RELATIONSHIP_TYPE: {
    USECASE: 'RELATIONSHIP_TYPE',
    URL: '/api/v1/applications/relationship_type'
  },
  APPLICATION: {
    USECASE: 'APPLICATION',
    URL: '/api/v1/applications'
  },
  QUESTIONS: {
    USECASE: 'QUESTIONS',
    URL: '/api/v1/properties/questions'
  },
  FILE_UPLOAD: {
    USECASE: 'FILE_UPLOAD',
    URL: '/api/v1/media/s3_signed_url'
  },
  MEDIA: {
    USECASE: 'MEDIA',
    URL: '/api/v1/media'
  },
  PLOT_POST: {
    USECASE: 'PLOT_POST',
    URL: '/api/v1/properties'
  },
  PLOT_ENUMS: {
    USECASE: 'PLOT_ENUMS',
    URL: '/api/v1/properties/plot_enums'
  },
  FLOORS: {
    USECASE: 'FLOORS',
    URL: '/api/v1/properties/floors'
  },
  PROHITED: {
    USECASE: 'PROHITED',
    URL: '/api/v1/villages/prohibited'
  },
  BUILDING_CATEGORY: {
    USECASE: 'BUILDING_CATEGORY',
    URL: '/api/v1/properties/building_category'
  },
  BUILDING_SUB_CATEGORY: {
    USECASE: 'BUILDING_SUB_CATEGORY',
    URL: '/api/v1/properties/building_subcategory'
  },
  GET_SETBACKS: {
    USECASE: 'GET_SETBACKS',
    URL: '/api/v1/properties/setbacks'
  },
  AUTO_DCR: {
    USECASE: 'AUTO_DCR',
    URL: '/api/v1/external/dcr_portal/sanction_details'
  },
  AUTO_DCR_CONFIRM: {
    USECASE: 'AUTO_DCR_CONFIRM',
    URL: '/api/v1/properties/dcr'
  },
  APPLICATION_STATUS_UPDATE: {
    USECASE: 'APPLICATION_STATUS_UPDATE',
    URL: '/api/v1/applications/update_application_status'
  },
  ACKOWLEDGEMENT_LETER: {
    USECASE: 'ACKOWLEDGEMENT_LETER',
    URL: '/api/v1/docupilot/acknowledgement_letter'
  },
  APPROVAL_LETTER_DTCP: {
    USECASE: 'APPROVAL_LETTER_DTCP',
    URL: '/api/v1/docupilot/approval_letter_above_500_dtcp'
  },
  FEE_DETAILS: {
    USECASE: 'FEE_DETAILS',
    URL: '/api/v1/fee_calculator/fee_details'
  },
  CITIZEN_DASHBOARD: {
    USECASE: 'CITIZEN_DASHBOARD',
    URL: '/api/v1/citizen_dashboard'
  },
  CITIZEN_APPLICATION: {
    USECASE: 'CITIZEN_APPLICATION',
    URL: '/api/v1/citizen_dashboard/application'
  },
  PAYNIMO_NEW_PAYMENT: {
    USECASE: 'PAYNIMO_NEW_PAYMENT',
    URL: '/api/v1/payments'
  },
  PAYNIMO_NEW_RETURN: {
    USECASE: 'PAYNIMO_NEW_RETURN',
    URL: '/api/v1/payments/receive_payment_response'
  },
};
