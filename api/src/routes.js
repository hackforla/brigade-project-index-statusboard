import { Router } from 'express';
import apicache from 'apicache';

import { getProjectIndex } from './api';
import { getTaxonomy } from './api';

export function createRoutes(app) {
  const router = Router();
  // maybe a last_update call?
  router.get('/tags.json', app.cache('15 minutes'), (_, res) => {
    res.json({});
  });

  router.get(['/', '/data.json'], app.cache('90 minutes'), (_, res) => {
	getProjectIndex()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Could not fetch project index data');
      });
  });

  router.get('/force-refresh/data.json', (_, res) => {
    apicache.clear('/api/data.json');
    res.redirect('/api/data.json');
  });

  router.get(['/', '/taxonomy.json'], app.cache('90 minutes'), (_, res) => {
    getTaxonomy()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Could not fetch taxonomy data');
      });
  });

  router.get('/force-refresh/taxonomy.json', (_, res) => {
    apicache.clear('/api/taxonomy.json');
    res.redirect('/api/taxonomy.json');
  });
  
  return router;
}
