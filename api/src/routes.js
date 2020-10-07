import { Router } from 'express';
import apicache from 'apicache';

import { getProjectIndex } from './api';

export function createRoutes(app) {
  const router = Router();
  // maybe a last_update call?
  router.get('/tags.json', app.cache('15 minutes'), (req, res) => {
    res.json({});
  });

  router.get('/data.json', app.cache('90 minutes'), (req, res) => {
    getProjectIndex(['Brigade', 'Code for America']).then((result) => {
      res.json(result);
    });
  });

  router.get('/force-refresh/data.json', (req, res) => {
    apicache.clear('/api/data.json');
    res.redirect('/api/data.json');
  });

  return router;
}
