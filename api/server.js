import express from 'express';
import _ from 'lodash';
import memcachedClient from './lib/memcachedClient';
import * as enforce from 'express-sslify';
import helmet from 'helmet';
import cors from 'cors';
import { createRoutes } from './src/routes';

const port = process.env.PORT || 8080;

// We will use Express
const app = express();

// We rely on memcached because github has limits API requests
app.mc = memcachedClient();

// Clear on first load
// app.mc.delete('data.json');

app.use(helmet());

// TODO: set env variable and check it before doing this
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use('/api', createRoutes(app.mc));

if (process.env.REDIRECT_TO_DOMAIN != undefined) {
  // If we are in heroku environment, force SSL / domain redirect
  // given appropriate env
  app.all(/.*/, function (req, res, next) {
    const host = req.header('host');
    if (host != process.env.REDIRECT_TO_DOMAIN) {
      res.redirect(301, `https://${process.env.REDIRECT_TO_DOMAIN}`);
    } else {
      next();
    }
  });
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
} else {
}

app.use(express.static(`${__dirname}/dist`));

app.listen(port);
