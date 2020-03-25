import express from 'express';
import _ from 'lodash';
import memjs from 'memjs';
import getProjectIndex from './api';
import * as enforce from 'express-sslify';
import { BSON } from 'bson';
import {gzip, ungzip}  from 'node-gzip';

const port = process.env.PORT || 8080;
const bson = new BSON();

// We rely on memcached because github has limits API requests
const mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
  failover: true,  // default: false
  timeout: 1,      // default: 0.5 (seconds)
  keepAlive: true  // default: false
})

// Clear on first load
mc.delete('data.json');

// We will use Express 
var app = express();

// maybe a last_update call?

app.get('/api/data.json', (req, res ) => {
  const k = 'data.json';
  mc.get(k , (err, val) => { 
    if(err == null && val != null && typeof req.query.nocache === 'undefined' ){ 
      //console.log("loaded from memcacehd");
      ungzip(val).then( (zval) => {
        const v = bson.deserialize(zval);
        res.json(v.brigades)
      })
    }else{
      console.log("retrieving new copy");
      getProjectIndex(["Brigade", "Code for America"]).then( result => {
        const cache_value = bson.serialize({"brigades":result}); // JSON.stringify(result);
        //console.log("bson cache set for "+cache_value.length + 'bytes');
        gzip( cache_value ).then( (zcache_value) => {
          //console.log("gzipped cache at " + zcache_value.length)
          mc.set(k, zcache_value , {expires: 360}, function(err, val){/* handle error */});
        })
        res.json(result);
      }) 
    }
  });
});


if(process.env.REDIRECT_TO_DOMAIN != undefined){ // If we are in heroku environment, force SSL / domain redirect given appropriate env
  app.all(/.*/, function(req, res, next) {
    var host = req.header("host");
    if (host != process.env.REDIRECT_TO_DOMAIN) {
      res.redirect(301, "https://" + process.env.REDIRECT_TO_DOMAIN );
    }else{
      next();
    }
  });
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(express.static(__dirname + '/dist'));

app.listen(port);