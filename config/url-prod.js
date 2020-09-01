const config = {
  development: {
    UI_SERVER: 'http://localhost:3000',
    API_SERVER: 'http://localhost:3001',
    PAYNIMO_MERCHANT_ID: 'T516938',
    PAYNIMO_CONSUMER_ID: 'c964634',
    PAYNIMO_SCHEME: 'FIRST',
  },
  production: {
    UI_SERVER: 'http://tsbpass.telangana.gov.in',
    API_SERVER:
      'http://internal-tsbpass-backend-ilb-374973327.ap-southeast-1.elb.amazonaws.com',
    PAYNIMO_MERCHANT_ID: 'L516938',
    PAYNIMO_CONSUMER_ID: 'c964634',
    PAYNIMO_SCHEME: 'FIRST',
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
