import { Router } from 'express';
import { getProjectIndex } from './api';

export function createRoutes(app) {
  const router = Router();
  // maybe a last_update call?
  router.get('/tags.json', app.cache('15 minutes'), (req, res) => {
    res.json({});
  });

  router.get('/data.json', app.cache('15 minutes'), (req, res) => {
    getProjectIndex(['Brigade', 'Code for America']).then((result) => {
      const cache_value = JSON.stringify(result);
      res.json(result);
    });
  });

  return router;
}
