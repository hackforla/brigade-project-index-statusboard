import memcachedClient from '../lib/memcachedClient';
import {
  updateIndexCache,
  projectIndexPromise,
  discourseTagsPromise
} from './updateCacheTask';

describe('updateCacheTask', () => {
  beforeEach(() => {
    jest.mock('../lib/memcachedClient', () => ({
      set: jest.fn(),
      get: jest.fn()
    }));
  });

  describe('updateIndexCache', () => {
    let mockPIP, mockDTP;
    beforeEach(() => {
      mockPIP = jest.fn();
      mockDTP = jest.fn();
      jest.mock('./updateCacheTask', () => ({
        updateIndexCache: require.requireActual('./updateCacheTask').updateIndexCache,
        projectIndexPromise: mockPIP,
        discourseTagsPromise: mockDTP
      }));
    });
    test('calls the expected functions', async () => {
      await updateIndexCache(memcachedClient());
      expect(mockPIP).toHaveBeenCalledTimes(1);
      expect(mockDTP).toHaveBeenCalledTimes(1);
    });
  });
});
