import memjs from 'memjs';
import memcachedClient from './memcachedClient';


describe('memcachedClient', () => {
  let mockCreate;
  beforeEach(() => {
    jest.mock('memjs');
    mockCreate = jest.fn();
    memjs.Client.create = mockCreate;
  });

  test('calls memjs.Client.create', () => {
    memcachedClient();
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  test('provides the expected options', () => {
    memcachedClient();
    expect(
      mockCreate.mock.calls[mockCreate.mock.calls.length - 1][1]
    ).toMatchObject(
      { failover: true, timeout: 1, keepAlive: true }
    );
  })
});
