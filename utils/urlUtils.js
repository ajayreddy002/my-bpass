import { UI_SERVER } from '../config/url';
import apiConstants from '../constants/apiConstants';

export function getURL(usecase) {
  let url = UI_SERVER;

  switch (usecase) {
    case apiConstants.LOCATION_DROPDOWN.USECASE:
      url += apiConstants.LOCATION_DROPDOWN.URL;
      break;
    case apiConstants.FLOOR_DROPDOWN.USECASE:
      url += apiConstants.FLOOR_DROPDOWN.URL;
      break;
    case apiConstants.SRO_DROPDOWN.USECASE:
      url += apiConstants.SRO_DROPDOWN.URL;
      break;
    case apiConstants.GET_APPLICATION_DETAILS.USECASE:
      url += apiConstants.GET_APPLICATION_DETAILS.URL;
      break;
    case apiConstants.INITIATE_PAYMENT.USECASE:
      url += apiConstants.INITIATE_PAYMENT.URL;
      break;
    case apiConstants.SELF_DECLARATION_UPDATE.USECASE:
      url += apiConstants.SELF_DECLARATION_UPDATE.URL;
      break;
    case apiConstants.VALIDATE_DOCUMENTS.USECASE:
      url += apiConstants.VALIDATE_DOCUMENTS.URL;
      break;
    case apiConstants.UPLOAD_DOCUMENTS.USECASE:
      url += apiConstants.UPLOAD_DOCUMENTS.URL;
      break;
    case apiConstants.CREATE_APPLICATION.USECASE:
      url += apiConstants.CREATE_APPLICATION.URL;
      break;
    case apiConstants.DOWNLOAD_DOCUMENTS.USECASE:
      url += apiConstants.DOWNLOAD_DOCUMENTS.URL;
      break;
    case apiConstants.DOWNLOAD_ACKNOWLEDGMENT.USECASE:
      url += apiConstants.DOWNLOAD_ACKNOWLEDGMENT.URL;
      break;
    case apiConstants.GET_AUTHN_APPLICATION_DETAILS.USECASE:
      url += apiConstants.GET_AUTHN_APPLICATION_DETAILS.URL;
      break;
    case apiConstants.PAYMENT_SUCCESS.USECASE:
      url += apiConstants.PAYMENT_SUCCESS.URL;
      break;
    case apiConstants.RESET_APPLICATION_PASSWORD.USECASE:
      url += apiConstants.RESET_APPLICATION_PASSWORD.URL;
      break;
    case apiConstants.UPDATE_AUTO_DCR.USECASE:
      url += apiConstants.UPDATE_AUTO_DCR.URL;
      break;
    // case apiConstants.MESEVA_CALLBACK.USECASE:
    //   url += apiConstants.MESEVA_CALLBACK.URL;
    //   break;
    case apiConstants.GET_APPLICATION_LIST_FOR_ADMIN.USECASE:
      url += apiConstants.GET_APPLICATION_LIST_FOR_ADMIN.URL;
      break;
    case apiConstants.CREATE_ADMIN.USECASE:
      url += apiConstants.CREATE_ADMIN.URL;
      break;
    case apiConstants.ADMIN_ROLES.USECASE:
      url += apiConstants.ADMIN_ROLES.URL;
      break;
    case apiConstants.ALL_OPEN_WORKFLOWS.USECASE:
      url += apiConstants.ALL_OPEN_WORKFLOWS.URL;
      break;
    case apiConstants.ADMIN_LOGIN.USECASE:
      url += apiConstants.ADMIN_LOGIN.URL;
      break;
    case apiConstants.RESET_ADMIN_PASSWORD.USECASE:
      url += apiConstants.RESET_ADMIN_PASSWORD.URL;
      break;
    case apiConstants.UNIQUE_USER.USECASE:
      url += apiConstants.UNIQUE_USER.URL;
      break;
    case apiConstants.GET_APPLICATION_ID_FROM_HASH.USECASE:
      url += apiConstants.GET_APPLICATION_ID_FROM_HASH.URL;
      break;
    case apiConstants.ADD_REVIEW.USECASE:
      url += apiConstants.ADD_REVIEW.URL;
      break;
    case apiConstants.APPROVE_APPLICATION.USECASE:
      url += apiConstants.APPROVE_APPLICATION.URL;
      break;
    case apiConstants.REJECT_APPLICATION.USECASE:
      url += apiConstants.REJECT_APPLICATION.URL;
      break;
    case apiConstants.SHORTFALL.USECASE:
      url += apiConstants.SHORTFALL.URL;
      break;
    case apiConstants.REQ_DOCUMENT.USECASE:
      url += apiConstants.REQ_DOCUMENT.URL;
      break;
    case apiConstants.NO_DOC_REQUIRED.USECASE:
      url += apiConstants.NO_DOC_REQUIRED.URL;
      break;
    case apiConstants.CERTIFY_FEE.USECASE:
      url += apiConstants.CERTIFY_FEE.URL;
      break;
    case apiConstants.APPROVE_POST_PROCESSING.USECASE:
      url += apiConstants.APPROVE_POST_PROCESSING.URL;
      break;
    case apiConstants.REJECT_POST_PROCESSING.USECASE:
      url += apiConstants.REJECT_POST_PROCESSING.URL;
      break;
    case apiConstants.GET_VALIDATION_FIELDS.USECASE:
      url += apiConstants.GET_VALIDATION_FIELDS.URL;
      break;
    case apiConstants.SUBMIT_ADDITIONAL_DOCUMENT.USECASE:
      url += apiConstants.SUBMIT_ADDITIONAL_DOCUMENT.URL;
      break;
    case apiConstants.APPLICATION_SETBACKS.USECASE:
      url += apiConstants.APPLICATION_SETBACKS.URL;
      break;
    case apiConstants.ADD_AUTO_DCR_FIELDS.USECASE:
      url += apiConstants.ADD_AUTO_DCR_FIELDS.URL;
      break;
    case apiConstants.GET_ADMIN_TEAMS.USECASE:
      url += apiConstants.GET_ADMIN_TEAMS.URL;
      break;
    case apiConstants.CREATE_TEAM.USECASE:
      url += apiConstants.CREATE_TEAM.URL;
      break;
    case apiConstants.APPLICATION_MARKET_VALUE.USECASE:
      url += apiConstants.APPLICATION_MARKET_VALUE.URL;
      break;
    case apiConstants.APPLICATION_SLUM_AREA.USECASE:
      url += apiConstants.APPLICATION_SLUM_AREA.URL;
      break;
    case apiConstants.GET_REPORT.USECASE:
      url += apiConstants.GET_REPORT.URL;
      break;
    case apiConstants.GET_REPORT_FOR_ULB.USECASE:
      url += apiConstants.GET_REPORT_FOR_ULB.URL;
      break;
    case apiConstants.PAYNIMO_RETURN.USECASE:
      url += apiConstants.PAYNIMO_RETURN.URL;
      break;
    case apiConstants.PAYNIMO_INITIATE_PAYMENT.USECASE:
      url += apiConstants.PAYNIMO_INITIATE_PAYMENT.URL;
      break;
    case apiConstants.OPEN_APPLICATION_SEARCH.USECASE:
      url += apiConstants.OPEN_APPLICATION_SEARCH.URL;
      break;
    case apiConstants.GET_STATS.USECASE:
      url += apiConstants.GET_STATS.URL;
      break;
    case apiConstants.GET_ADMIN_BY_ROLE.USECASE:
      url += apiConstants.GET_ADMIN_BY_ROLE.URL;
      break;
    case apiConstants.ASSIGN_TASK.USECASE:
      url += apiConstants.ASSIGN_TASK.URL;
      break;
    case apiConstants.GET_APPLICATION_FOR_TASK_MANAGER.USECASE:
      url += apiConstants.GET_APPLICATION_FOR_TASK_MANAGER.URL;
      break;
    case apiConstants.GET_OTP.USECASE:
      url += apiConstants.GET_OTP.URL;
      break;
    case apiConstants.VERIFY_OTP.USECASE:
      url += apiConstants.VERIFY_OTP.URL;
      break;
    case apiConstants.ADD_COMMENT.USECASE:
      url += apiConstants.ADD_COMMENT.URL;
      break;
    case apiConstants.ADMIN_CHANGE_PASSWORD.USECASE:
      url += apiConstants.ADMIN_CHANGE_PASSWORD.URL;
      break;
    case apiConstants.ADMIN_PRE_PROCEEDING_CONDITIONS.USECASE:
      url += apiConstants.ADMIN_PRE_PROCEEDING_CONDITIONS.URL;
      break;
    case apiConstants.APPLICANT_PRE_PROCEEDING_ACCEPT.USECASE:
      url += apiConstants.APPLICANT_PRE_PROCEEDING_ACCEPT.URL;
      break;
      case apiConstants.GET_CHASING_STATS.USECASE:
      url += apiConstants.GET_CHASING_STATS.URL;
      break;
  }
  return new URL(url);
}

export function alterParamsForUrl(url, params) {
  Object.keys(params).map(key => {
    url.searchParams.set(key, params[key]);
  });
  return url.toString();
}
