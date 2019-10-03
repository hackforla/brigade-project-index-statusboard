import express from 'express';
import GitHub from 'github-api';
import _ from 'lodash';
import memjs from 'memjs';

const port = process.env.PORT || 8080;

// We will make calls out to Github for the latest index information
const gh = new GitHub({
  token: process.env.GITHUB_TOKEN
});
const repo = gh.getRepo('codeforamerica','brigade-project-index');

// We rely on memcached because github has limits API requests
const mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
  failover: true,  // default: false
  timeout: 1,      // default: 0.5 (seconds)
  keepAlive: true  // default: false
})

// We will use Express 
var app = express();

// TODO
// This is not a great way to go about it
// Instead we should query the org list
// Then bundle a GET for each org
// Where we download all projects from the project folder
// And cache that result, that way we limit the total request
// Also, ultimately we could perhaps bundle it all into one big delivery
// Rather than 75 GETs

/* Routes */
app.get('/api/organizations/', (req, res ) => {
    // check cache for orgs list
    mc.get('orgs', (err, val) => { 
        if(err == null && val != null && typeof req.query.nocache === 'undefined' ){
            // Send cached org
            console.log("retrieved orgs from memcached");
            res.json(JSON.parse(val.toString()));
        }else{
            console.log("querying new orgs from github");
            // query contents from github
            repo.getContents("index",'organizations').then( data => {
              const orgs = [];
              _.each(data.data, org => {
                orgs.push(org.path.replace('organizations/',''));
              });
              mc.set('orgs', JSON.stringify(orgs), {expires: 360}, function(err, val){/* handle error */});
              res.json(orgs);
            }).catch( error => {
              res.json( {"error": error.message } );
            })
        }
    });
});

app.get('/api/organizations/:orgfile', (req, res ) => {
    const k = `org <${req.params.orgfile}>`;
    mc.get(k , (err, val) => { 
        if(err == null && val != null && typeof req.query.nocache === 'undefined' ){
            console.log(`retrieved org file ${req.params.orgfile} from memcached`);
            res.write(val.toString());
            res.end();
        }else{
          console.log(`querying new org file ${req.params.orgfile} from github`);
          repo.getContents("index",`organizations/${req.params.orgfile}`).then( ( data ) => {
            const file_contents = Buffer.from(data.data.content,data.data.encoding);
            mc.set(k, file_contents , {expires: 360}, function(err, val){/* handle error */});
            res.write(file_contents);
            res.end();
          }).catch( error => {
              res.json( {"error": error.message } );
          })
        }
    });
});

app.get('/api/projects/:orgname/', (req, res ) => {
    // check cache for org project list
    const k = `orgproj <${req.params.orgname}>`;

    mc.get(k, (err, val) => { 
        if(err == null && val != null && typeof req.query.nocache === 'undefined' ){
            console.log(`retrieved org ${req.params.orgname} project list from memcached`);
            res.json(JSON.parse(val.toString()));
        }else{
            console.log(`querying new org project list for ${req.params.orgname} from github`);
            repo.getContents("index",`projects/${req.params.orgname}`).then( data => {
              const projects = [];
              _.each(data.data, org => {
                  projects.push(org.path.replace(`projects/${req.params.orgname}/`,''));
              });
              res.json(projects);
              mc.set(k, JSON.stringify(projects), {expires: 360}, function(err, val){/* handle error */});
            }).catch( error => {
              res.json( {"error": error.message } );
            })
        }
    });
});

app.get('/api/projects/:orgname/:projfile', (req, res ) => {
    const k = `org <${req.params.orgname}/${req.params.projfile}>`;
    mc.get(k , (err, val) => { 
        if(err == null && val != null && typeof req.query.nocache === 'undefined' ){
            console.log(`retrieved proj file ${req.params.orgname}/${req.params.projfile} from memcached`);
            res.write(val.toString());
            res.end();
        }else{
          console.log(`querying new proj file ${req.params.orgname}/${req.params.projfile} from github`);
          repo.getContents("index",`projects/${req.params.orgname}/${req.params.projfile}`).then( ( data ) => {
            const file_contents = Buffer.from(data.data.content,data.data.encoding);
            mc.set(k, file_contents , {expires: 360}, function(err, val){/* handle error */});
            res.write(file_contents);
            res.end();
          }).catch( error => {
            res.json( {"error": error.message } );
          })
        }
    });
});

app.use(express.static(__dirname + '/dist'));

app.listen(port);
