import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import { router } from './routes';

let app = express();

app.use(logger('dev'));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // our data isn't huge

app.all('/*', (req, res, next) => {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Auth Middleware
app.all('/api/v1/*', expressJwt({secret: 'nyancat'}));

app.use('/', router);

// If no route is matched by now, it must be a 404
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Start the server
app.set('port', process.env.PORT || 3000);

let server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + server.address().port);
});
