import express from 'express';
import GitHub from 'github-api';
import _ from 'lodash';

const gh = new GitHub();
const repo = gh.getRepo('codeforamerica','brigade-project-index');

var app = express();

app.get('/api/organizations/', (req, res ) => {
    // codeforamerica/brigade-project-index/tree/index/organizations
    repo.getContents("index",'organizations').then( data => {
      const orgs = [];
      _.each(data.data, org => {
        orgs.push(org.path.replace('organizations/',''));
      });
      res.json(orgs);
    })
});

app.get('/api/organizations/:orgfile', (req, res ) => {
    repo.getContents("index",`organizations/${req.params.orgfile}`).then( ( data ) => {
      res.write(Buffer.from(data.data.content,data.data.encoding));
      res.end();
    })
});

app.get('/api/projects/:orgname/', (req, res ) => {
    // codeforamerica/brigade-project-index/tree/index/organizations
    repo.getContents("index",`projects/${req.params.orgname}`).then( data => {
      const projects = [];
      _.each(data.data, org => {
          projects.push(org.path.replace(`projects/${req.params.orgname}/`,''));
      });
      res.json(projects);
    })
});

app.get('/api/projects/:orgname/:projfile', (req, res ) => {
    repo.getContents("index",`projects/${req.params.orgname}/${req.params.projfile}`).then( ( data ) => {
      res.write(Buffer.from(data.data.content,data.data.encoding));
      res.end();
    })
});



// Base Web App
app.use(express.static('dist'))


// TODO /data/organizations/<name>.toml
// TODO /data/projects/<org>/
// TODO /data/projects/<org>/<name>.toml
// CONSIDER Handle HEAD requests correctly to check for updates?

// TODO integrate so vue/webpack/express work together
app.listen(8081, ()=>{
  console.log('API listening on port 8081');
});