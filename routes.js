const routes = (module.exports = require("next-routes")());

routes
  .add(
    "layout",
    "/:language/self-certification/layout",
    "self-certification-application/layouts/layout"
  )
  .add(
    "application",
    "/:language/self-certification/application",
    "self-certification-application/application"
  )
  .add(
    "documents",
    "/:language/self-certification/:applicationId/upload-documents",
    "self-certification-application/documents"
  )
  .add(
    "review",
    "/:language/self-certification/:applicationId/review",
    "self-certification-application/review"
  )
  .add(
    "payment",
    "/:language/self-certification/:applicationId/payment",
    "self-certification-application/payment"
  )
  .add(
    "initiate-payment",
    "/:language/self-certification/:applicationId/initiate-payment",
    // 'self-certification-application/initiatePayment'
    "self-certification-application/paynimoPayment"
    // 'self-certification-application/razorPayment'
  )
  .add(
    "payment-response",
    "/:language/self-certification/:applicationId/payment-response",
    "self-certification-application/paymentResponse"
  )
  .add(
    "track",
    "/:language/self-certification/:applicationId/track",
    "self-certification-application/tracking"
  )
  .add("me-seva-login", "/me-seva/login", "me-seva/login")
  .add(
    "citizen-search",
    "/:language/citizen-search",
    "citizen-search/citizenSearch"
  )
  .add(
    "citizen-application-track",
    "/:language/citizen-application-track",
    "citizen-search/searchApplicationForStatus"
  )
  .add(
    "redirect",
    "/:language/self-certification/:applicationId/redirect",
    "self-certification-application/redirects"
  )
  .add("admin-list", "/govt/list", "govt/applicationList")
  .add("admin-login", "/govt/login", "govt/adminLogin")
  .add("admin-logout", "/govt/logout", "govt/adminLogout")
  .add("admin-create", "/govt/create", "govt/adminCreation")
  .add("admin-redirect", "/govt/redirect", "govt/adminRedirect")
  .add("admin-change-password", "/govt/change-password", "govt/changePassword")
  .add("report", "/govt/report", "govt/report")
  .add("stats", "/govt/stats", "govt/stats")
  .add("reports", "/govt/reports", "govt/reports")
  .add(
    "offline-payment",
    "/:language/self-certification/:applicationId/offline-payment/:type(MEESEVA|PROPERTY_TAX)",
    "self-certification-application/offlinePayment"
  )
  .add(
    "download-acknowledgement",
    "/downloadAckForm/:hash",
    "self-certification-application/download"
  )
  .add(
    "backdoor-document-uploader",
    "/gotham/alfred",
    "gotham/backdoorFileUploader"
  );
