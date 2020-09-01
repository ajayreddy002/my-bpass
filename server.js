const next = require('next');
const routes = require('./routes');
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handler = routes.getRequestHandler(app);
const request = require('request');
const apiURL = require('./config/url').API_SERVER;
const express = require('express');
const packageJSON = require('./package.json');
app.prepare().then(() => {
  const server = express();

  server.get('/api/application/initiatePayment', function(req, res) {
    var payCall = request.get(
      apiURL +
        '/api/application/initiatePayment?identifier=' +
        req.query.identifier,
      function(error, response, body) {
        let data = body ? JSON.parse(body) : {};
        if (data && data.encryptedString) {
          res.status(200).send({ enc: data.encryptedString });
          return;
        } else {
          res.status(400).end('Payment Failed');
        }
      }
    );
    req.pipe(payCall);
  });

  server.use('/citizen-download/media/*', function(req, res) {
    const url = apiURL + req.originalUrl;
    var x = request(url);
    req.pipe(x);
    x.on('error', function(e) {
      console.log(e);
    });
    x.on('response', function(response) {
      if (response.statusCode !== 200) {
        x.pipe(res).on('error', function(e) {
          res.status(400).send('Unable to find the application');
        });
      } else {
        x.pipe(res);
      }
    });
  });

  server.use('/api/admin/*', function(req, res) {
    const url = apiURL + req.originalUrl;
    var x = request(url);
    req.pipe(x);
    x.on('response', function(response) {
      if (response.statusCode !== 401) {
        x.pipe(res).on('error', function(e) {
          res.status(500).end('Something went wrong');
        });
      } else {
        res.clearCookie('access_token');
        res.writeHead(302, {
          Location: '/govt/login'
        });
        res.end();
      }
    });
  });

  server.use('/api/version', function(req, res) {
    res.status(200).send({
      version: packageJSON.version,
      release_date: packageJSON.release_date
    });
  });

  server.use('/api/*', function(req, res) {
    const url = apiURL + req.originalUrl;
    var x = request(url);
    req.pipe(x);
    x.on('error', function(e) {
      console.log(e);
    });
    x.on('response', function(response) {
      if (response.statusCode !== 401) {
        x.pipe(res).on('error', function(e) {
          res.status(500).end('Something went wrong');
        });
      } else {
        res.clearCookie('access_token');
        res.writeHead(302, {
          Location: '/en/citizen-search'
        });
        res.end();
      }
    });
  });
  server.use(handler);
  server.listen(3000);
});
