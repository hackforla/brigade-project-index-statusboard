import memjs from 'memjs';

// We rely on memcached because github has limits API requests
export default function memcachedClient() {
  const mc = memjs.Client.create(
    process.env.MEMCACHIER_SERVERS,
    {
      failover: true, // default: false
      timeout: 1, // default: 0.5 (seconds)
      keepAlive: true, // default: false
    }
  );
  return mc;
}
