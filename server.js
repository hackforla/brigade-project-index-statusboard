import express from 'express';
import _ from 'lodash';
import memjs from 'memjs';
import { getProjectIndex } from './api';
import * as enforce from 'express-sslify';
import { BSON } from 'bson';
import {gzip, ungzip}  from 'node-gzip';
import cors from 'cors';

const port = process.env.PORT || 8080;
const bson = new BSON();

// We rely on memcached because github has limits API requests
const mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
  failover: true,  // default: false
  timeout: 1,      // default: 0.5 (seconds)
  keepAlive: true  // default: false
})

// Clear on first load
//mc.delete('data.json');

// We will use Express 
var app = express();

// Add CORS headers so the frontend can pull the data easily.
app.use(cors());

// maybe a last_update call?
app.get('/api/tags.json', (req, res ) => {
  mc.get("tags.json" , (err, val) => { 
    if(err == null && val != null && typeof req.query.nocache === 'undefined' ){ 
      res.write(val)
      res.end()
    }else{
      console.error( err );
      res.json({});
    }
  })
})

app.get('/api/data.json', (req, res ) => {
  const k = 'data.json';
  mc.get(k , (err, val) => { 
    if(err == null && val != null && typeof req.query.nocache === 'undefined' ){ 
      res.write(val)
      res.end()
      console.log("loaded from memcacehd");
      /* uncomment to retrieve as gzipped bson
      ungzip(val).then( (zval) => {
        const v = bson.deserialize(zval);
        res.json(v.brigades)
      }) */
    }else{
      console.log("retrieving new copy");
      getProjectIndex(["Brigade", "Code for America"]).then( result => {
        const cache_value = JSON.stringify(result); 
        mc.set(k, cache_value , {expires: 360*3}, function(err, val){/* handle error */});

        /* // uncomment to store gzipped and bson'd - takes more memory
        const cache_value = bson.serialize({"brigades":result}); 
        gzip( cache_value ).then( (zcache_value) => {
          mc.set(k, zcache_value , {expires: 360}, function(err, val){ console.log(err) });
        })
        */

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