import getProjectIndex from './api';
import memjs from 'memjs';

// We rely on memcached because github has limits API requests
const mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
    failover: true,  // default: false
    timeout: 1,      // default: 0.5 (seconds)
    keepAlive: true  // default: false
})

// TODO unify mc and k with server.js
const k = "data.json"

function updateIndexCache(){
    getProjectIndex(["Brigade", "Code for America"]).then( result => {
      const cache_value = JSON.stringify(result); 
      mc.set(k, cache_value , {expires: 360*3}, function(err, val){/* handle error */});
      console.log("setting cache")
      process.exit()
    })
}
 
updateIndexCache();