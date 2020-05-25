import { getProjectIndex, getDiscourseTagList } from './api';
import memjs from 'memjs';

// We rely on memcached because github has limits API requests
const mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
    failover: true,  // default: false
    timeout: 1,      // default: 0.5 (seconds)
    keepAlive: true  // default: false
})

function updateIndexCache(){
  Promise.all( [
    getProjectIndex(["Brigade", "Code for America"]).then( result => {
      console.log("setting data.json result")
      const cache_value = JSON.stringify(result); 
      mc.set("data.json", cache_value , {expires: 360*3}, function(err, val){/* handle error */});
    }),
    getDiscourseTagList().then( result => {
      console.log("setting tags.json result")
      const cache_value = JSON.stringify(result);
        mc.set("tags.json", cache_value, {expires: 360*3}, function(error,val){ });
    })
  ]).catch( e =>{ console.error(e) }).finally( result => { process.exit() } )
}


updateIndexCache();
