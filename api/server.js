import apicache from 'apicache';
import cors from 'cors';
import redis from 'redis';
import * as enforce from 'express-sslify';
import express from 'express';
import helmet from 'helmet';

import createRoutes from './src/routes';

const port = process.env.PORT || 8080;

// We will use Express
const app = express();

// We rely on redis because Github has limits API requests
const REDIS_URL = process.env.REDISCLOUD_URL || 'redis://localhost:6379';
const redisClient = redis.createClient(REDIS_URL, {
  retry_strategy: ({ attempt, error }) => {
    if (attempt >= 5) {
      throw new Error(`Redis Command Failed After 5 Retries: ${error}`);
    } else {
      return true;
    }
  },
});
redisClient.on('error', (e) => console.warn('Redis Error: ', e));
app.cache = apicache.options({ redisClient }).middleware;

app.use(helmet());

// Add CORS headers so the frontend can pull the data easily.
app.use(cors());

app.use('/api', createRoutes(app));

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
}

app.use(express.static(`${__dirname}/dist`));

app.listen(port, () => console.log(`Listening on port ${port}`));
