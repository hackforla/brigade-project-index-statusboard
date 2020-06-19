import { Router } from 'express';
import { getProjectIndex } from './api';

export function createRoutes(memcachedClient) {
  const router = Router();
  // maybe a last_update call?
  router.get('/tags.json', (req, res) => {
    memcachedClient.get('tags.json', (err, val) => {
      if (
        err == null &&
        val != null &&
        typeof req.query.nocache === 'undefined'
      ) {
        res.write(val);
        res.end();
      } else {
        console.error(err);
        res.json({});
      }
    });
  });

  router.get('/data.json', (req, res) => {
    const k = 'data.json';
    memcachedClient.get(k, (err, val) => {
      if (
        err == null &&
        val != null &&
        typeof req.query.nocache === 'undefined'
      ) {
        res.write(val);
        res.end();
        console.log('loaded from memcached');
        /* uncomment to retrieve as gzipped bson
          ungzip(val).then( (zval) => {
            const v = bson.deserialize(zval);
            res.json(v.brigades)
          }) */
      } else {
        console.log('retrieving new copy');
        getProjectIndex(['Brigade', 'Code for America']).then((result) => {
          const cache_value = JSON.stringify(result);
          memcachedClient.set(k, cache_value, { expires: 360 * 3 }, function (err, val) {
            /* handle error */
          });

          /* // uncomment to store gzipped and bson'd - takes more memory
            const cache_value = bson.serialize({"brigades":result});
            gzip( cache_value ).then( (zcache_value) => {
              memcachedClient.set(k, zcache_value , {expires: 360}, function(err, val){ console.log(err) });
            })
            */

          res.json(result);
        });
      }
    });
  });

  return router;
}
