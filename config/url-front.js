const config = {
  development: {
    UI_SERVER: 'http://localhost:3000',
    // API_SERVER: 'http://hyno-external-rails-new-1353938241.ap-southeast-1.elb.amazonaws.com',
    API_SERVER: 'http://hyno-external-rails-new-1912107687.ap-southeast-1.elb.amazonaws.com',
    // API_SERVER: 'http://tsb-pass.herokuapp.com',
  },
  production: {
    UI_SERVER:'http://uat.tsbpass.telangana.gov.in',
    // API_SERVER: 'http://hyno-external-rails-new-1353938241.ap-southeast-1.elb.amazonaws.com',
    API_SERVER: 'http://hyno-external-rails-new-1912107687.ap-southeast-1.elb.amazonaws.com',
    // API_SERVER: 'http://tsb-pass.herokuapp.com',
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];


// http://localhost:3000/en/self-certification/1668%2FAMAN%2F0024%2F2020/initiate-payment?type=ONLINE