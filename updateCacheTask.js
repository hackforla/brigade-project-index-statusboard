import memjs from 'memjs';
import { getProjectIndex, getDiscourseTagList } from './api';

// We rely on memcached because github has limits API requests
const mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
  failover: true, // default: false
  timeout: 1, // default: 0.5 (seconds)
  keepAlive: true, // default: false
});

function updateIndexCache() {
  Promise.all([
    getProjectIndex(['Brigade', 'Code for America']).then((result) => {
      // prettier-ignore
      // eslint-disable-next-line no-console
      console.log('setting data.json result');
      const cacheValue = JSON.stringify(result);
      mc.set('data.json', cacheValue, { expires: 360 * 3 }, (err, _val) => {
        if (err) {
          // prettier-ignore
          // eslint-disable-next-line no-console
          console.error(err);
        }
        /* Handle error? */
      });
    }),
    getDiscourseTagList().then((result) => {
      // prettier-ignore
      // eslint-disable-next-line no-console
      console.log('setting tags.json result');
      const cacheValue = JSON.stringify(result);
      mc.set('tags.json', cacheValue, { expires: 360 * 3 }, (err, _val) => {
        if (err) {
          // prettier-ignore
          // eslint-disable-next-line no-console
          console.error(err);
        }
        /* Handle error? */
      });
    }),
  ])
    .catch((e) => {
      if (e) {
        // prettier-ignore
        // eslint-disable-next-line no-console
        console.error(e);
      }
      /* Handle error? */
    })
    .finally((_result) => {
      process.exit();
    });
}

updateIndexCache();
