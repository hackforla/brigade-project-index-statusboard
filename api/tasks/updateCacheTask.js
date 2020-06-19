import memcachedClient from '../lib/memcachedClient';
import { getProjectIndex, getDiscourseTagList } from '../api';

export async function updateIndexCache(memcachedClient) {
  try {
    await Promise.all([
      projectIndexPromise(memcachedClient),
      discourseTagsPromise(memcachedClient)
    ]);  
  } catch (e) {
    // prettier-ignore
    // eslint-disable-next-line no-console
    if (e) { console.error(e); }
  }
}

export async function projectIndexPromise(memcachedClient) {
  const result = getProjectIndex(['Brigade', 'Code for America']);
  // prettier-ignore
  // eslint-disable-next-line no-console
  console.log('setting data.json result');
  const cacheValue = JSON.stringify(result);
  memcachedClient.set(
    'data.json',
    cacheValue,
    { expires: 360 * 3 },
    (err, _val) => {
      // prettier-ignore
      // eslint-disable-next-line no-console
      if (err) { console.error(err); }
    }
  );
}

export async function discourseTagsPromise(memcachedClient) {
  const result = await getDiscourseTagList();
  // prettier-ignore
  // eslint-disable-next-line no-console
  console.log('setting tags.json result');
  const cacheValue = JSON.stringify(result);
  memcachedClient.set(
    'tags.json',
    cacheValue,
    { expires: 360 * 3 },
    (err, _val) => {
      // prettier-ignore
      // eslint-disable-next-line no-console
      if (err) { console.error(err); }
    }
  );
}


if (require.main === module) {
  const mc = memcachedClient();
  updateIndexCache(mc)
    // prettier-ignore
    // eslint-disable-next-line no-console
    .then(() => { console.log('update index cache task completed'); })
    .finally(() => { process.exit(); });
}
