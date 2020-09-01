const config = {
  development: {
    UI_SERVER: 'http://localhost:3000',
    API_SERVER: 'http://localhost:8084',
    PAYNIMO_MERCHANT_ID: 'T516938',
    PAYNIMO_CONSUMER_ID: 'c964634',
    PAYNIMO_SCHEME: 'FIRST'
  },
  production: {
    UI_SERVER:'http://uat.tsbpass.telangana.gov.in',
    API_SERVER:
      'http://10.10.2.251:8084',
    PAYNIMO_MERCHANT_ID: 'T516938',
    PAYNIMO_CONSUMER_ID: 'c964634',
    PAYNIMO_SCHEME: 'FIRST'
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
