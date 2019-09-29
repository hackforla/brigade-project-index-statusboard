var express = require('express');
var app = express();

app.get('/data/organizations.json', (req, res) => {
  res.json({message: 'Welcome to the Server'});
});

// TODO /data/organizations/<name>.toml
// TODO /data/projects/<org>/
// TODO /data/projects/<org>/<name>.toml
// CONSIDER Handle HEAD requests correctly to check for updates?

// TODO integrate so vue/webpack/express work together
app.listen(8081, ()=>{
  console.log('API listening on port 8081');
});