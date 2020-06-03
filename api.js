import { Octokit } from '@octokit/rest';
import JSZip from 'jszip';
import _ from 'lodash';
import toml from 'toml';
import axios from 'axios';

export function getLastUpdate() {
  // TODO Promise of last commit
}

function slugify(n) {
  return n.toLowerCase().replace(/[^a-zA-Z0-9\-]+/g, '-');
}

export function getProjectIndex(orgType) {
  // prettier-ignore
  // eslint-disable-next-line no-console
  console.log('getting project index');
  // We will make calls out to Github for the latest index information
  const octokit = Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  // return promise the resolves once we have unzipped and merged
  // all the projects / organizations
  const promise = new Promise((resolve, _reject) => {
    octokit.repos
      .getArchiveLink({
        owner: 'codeforamerica',
        repo: 'brigade-project-index',
        archive_format: 'zipball',
        ref: 'index/v1',
      })
      .then((response) => {
        // Download the latest brigade index in a zip archive
        const indexZip = new JSZip();
        indexZip
          .loadAsync(response.data)
          .then((_archive) => {
            // Iterate through all the .toml files
            const orgs = [];
            const projects = [];
            const promises = [];
            // Parse them into organizations / projects
            indexZip.folder('').forEach((path) => {
              const parts = path.split('/');
              const t = parts[1];
              // Tag projects with org name / project name per path
              if (t === 'projects' && parts.length === 4) {
                const f = indexZip.file(path);
                if (f) {
                  promises.push(
                    f.async('string').then((data) => {
                      const p = toml.parse(data);
                      p.name = parts[parts.length - 1].replace('.toml', '');
                      p.brigade = parts[parts.length - 2];
                      projects.push(p);
                    })
                  );
                }
                // tag with org name per path
              } else if (t === 'organizations' && parts.length === 3) {
                const f = indexZip.file(path);
                if (f) {
                  promises.push(
                    indexZip
                      .file(path)
                      .async('string')
                      .then((data) => {
                        const o = toml.parse(data);
                        o.projects = [];
                        o.name = parts[parts.length - 1].replace('.toml', '');
                        o.slug = slugify(o.name);
                        orgs.push(o);
                      })
                  );
                }
              }
            });

            // After all async loads are finished, we combine the projects
            // into the orgs and keep our original promise
            Promise.all(promises).then((_result) => {
              // prettier-ignore
              // eslint-disable-next-line no-console
              console.log(
                `Loaded ${orgs.length} orgs and ${projects.length} projects.. joining them`
              );
              const orgsByName = _.keyBy(orgs, 'name');
              projects.forEach((proj) => {
                if (orgsByName[proj.brigade]) {
                  orgsByName[proj.brigade].projects.push({
                    ...proj,
                    brigade_slug: slugify(proj.brigade),
                  });
                }
              });

              if (orgType != null) {
                resolve(
                  orgs.filter((o) => {
                    let valid = true;
                    orgType.forEach((t) => {
                      if (!o.tags.includes(t)) {
                        valid = false;
                      }
                    });
                    return valid;
                  })
                );
              } else {
                resolve(orgs);
              }
            });
          })
          .catch((error) => {
            // prettier-ignore
            // eslint-disable-next-line no-console
            console.error(error.message);
          });
      })
      .catch((error) => {
        // prettier-ignore
        // eslint-disable-next-line no-console
        console.error(error);
      });
  });
  return promise;
}

export function getDiscourseTagList() {
  // prettier-ignore
  // eslint-disable-next-line no-console
  console.log('getting tag list');
  const URL = 'https://discourse.codeforamerica.org/tags.json';
  const promise = new Promise((resolve, reject) => {
    axios
      .get(URL)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
}

// index project subcategories
// https://discourse.codeforamerica.org/categories.json  -> projects.subcategory_ids => 30 (e.g. courbot)
// https://discourse.codeforamerica.org/c/30/show.json => slug
// translates into  https://discourse.codeforamerica.org/c/projects/courtbot/30
// found via https://meta.discourse.org/t/how-do-i-get-subcategory-by-id-using-discourse-api/137790
// and digging in the json

export default function test() {
  // prettier-ignore
  // eslint-disable-next-line no-console
  console.log('test');
}
/*
getProjectIndex().then( orgs => {
    console.log(`${orgs.length} promised orgs have been returned!`);
    fs.writeFile( 'out.json', JSON.stringify(orgs), (err) => {
        if (err)  throw err;
        console.log("out.json written");
    });
});
*/
