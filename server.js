import express from 'express';
import GitHub from 'github-api';
import _ from 'lodash';

const port = process.env.PORT || 8080;
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


app.use(express.static(__dirname + '/dist'));

app.listen(port);