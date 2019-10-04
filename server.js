import express from 'express';
import _ from 'lodash';
import memjs from 'memjs';

const port = process.env.PORT || 8080;

// We rely on memcached because github has limits API requests
const mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
  failover: true,  // default: false
  timeout: 1,      // default: 0.5 (seconds)
  keepAlive: true  // default: false
})

// We will use Express 
var app = express();

// maybe a last_update call?

app.get('/api/data.json', (req, res ) => {
  mc.get('data' , (err, val) => { 
    if(err == null && val != null && typeof req.query.nocache === 'undefined' ){ 
      res.write(val)
      // TODO add headers?
      res.end()
    }else{
      const result = {"TODO":"return zip"};
      mc.set(k, JSON.stringify(result) , {expires: 360}, function(err, val){/* handle error */});
      res.json(result)
    }
  });
});

app.use(express.static(__dirname + '/dist'));

app.listen(port);
