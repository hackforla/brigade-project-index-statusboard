import { Octokit } from '@octokit/rest';
import JSZip from 'jszip';
import _ from 'lodash';
import toml from 'toml';
import axios from 'axios';

function slugify(n) {
  return n.toLowerCase().replace(/[^a-zA-Z0-9-]+/g, '-');
}

export async function getProjectIndex(orgType) {
  console.log('Getting project index');

  let downloadedRepos;
  try {
    // We will make calls out to Github for the latest index information
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });
    // return promise the resolves once we have unzipped and merged
    // all the projects / organizations
    downloadedRepos = await octokit.repos.downloadArchive({
      owner: 'codeforamerica',
      repo: 'brigade-project-index',
      archive_format: 'zipball',
      ref: 'index/v1',
    });
  } catch (err) {
    console.error(err);
    throw new Error('Could not fetch data from GitHub');
  }

  try {
    // Download the latest brigade index in a zip archive
    const indexZip = new JSZip();
    await indexZip.loadAsync(downloadedRepos.data);

    // Iterate through all the .toml files
    const orgs = [];
    const projects = [];
    const promises = [];
    indexZip.folder('').forEach((path) => {
      const _file = indexZip.file(path);
      if (!_file) return;
      // Parse them into organizations / projects
      const parts = path.split('/');
      const itemType = parts[1];
      // Tag projects with org name / project name per path
      if (itemType === 'projects' && parts.length === 4) {
        promises.push(
          _file.async('string').then((data) => {
            const project = toml.parse(data);
            project.name = parts[parts.length - 1].replace('.toml', '');
            project.brigade = parts[parts.length - 2];
            projects.push(project);
          })
        );
        // tag with org name per path
      } else if (itemType === 'organizations' && parts.length === 3) {
        promises.push(
          indexZip
            .file(path)
            .async('string')
            .then((data) => {
              const organization = toml.parse(data);
              organization.projects = [];
              organization.name = parts[parts.length - 1].replace('.toml', '');
              organization.slug = slugify(organization.name);
              orgs.push(organization);
            })
        );
      }
    });

    await Promise.all(promises);
    console.log(
      `Loaded ${orgs.length} orgs and ${projects.length} projects.. joining them`
    );

    // Add projects to orgs
    const orgsByName = _.keyBy(orgs, 'name');
    projects.forEach((proj) => {
      if (orgsByName[proj.brigade]) {
        orgsByName[proj.brigade].projects.push({
          ...proj,
          brigade_slug: slugify(proj.brigade),
        });
      }
    });

    if (!orgType) {
      return orgs;
    }

    return orgs.filter((_thisOrg) =>
      orgType.some((t) => _thisOrg.tags.includes(t))
    );
  } catch (err) {
    console.error(err);
    throw new Error('Could not parse data after fetch');
  }
}

const DISCOURSE_URL = 'https://discourse.codeforamerica.org/tags.json';

export function getDiscourseTagList() {
  console.log('Getting tag list');
  return new Promise((resolve, reject) => {
    axios
      .get(DISCOURSE_URL)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// index project subcategories
// https://discourse.codeforamerica.org/categories.json  -> projects.subcategory_ids => 30 (e.g. courbot)
// https://discourse.codeforamerica.org/c/30/show.json => slug
// translates into  https://discourse.codeforamerica.org/c/projects/courtbot/30
// found via https://meta.discourse.org/t/how-do-i-get-subcategory-by-id-using-discourse-api/137790
// and digging in the json

export async function getTaxonomy() {
  console.log('Getting taxonomy');

  let downloadedRepos;
  try {
    // Getting the Github repository
    const octokit = new Octokit({
      // auth: process.env.GITHUB_TOKEN,
    });
    // return promise the resolves once we have unzipped and merged
    // all the data
    downloadedRepos = await octokit.repos.downloadArchive({
      owner: 'codeforamerica',
      repo: 'civic-tech-taxonomy',
      archive_format: 'zipball',
      ref: 'master',
    });
  } catch (err) {
    console.error(err);
    throw new Error('Could not fetch data from GitHub');
  }

  try {
    // Download the latest brigade index in a zip archive
    const indexZip = new JSZip();
    await indexZip.loadAsync(downloadedRepos.data);

    // Iterate through all the .toml files
    const orgs = [];
    const issues = [];
    const promises = [];
    indexZip.folder('').forEach((path) => {
      const _file = indexZip.file(path);
      if (!_file) return;
      console.log(_file);
      // Parse them into issues and then other sets of data
      const parts = path.split('/');
      const itemType = parts[1];
      // for now limiting to "issues" set of data
      if (itemType === 'issues') {
        promises.push(
          _file.async('string').then((data) => {
            const topic = toml.parse(data);
            console.log(topic);
            issues.push(topic);
          })
        );
      }
    });

    await Promise.all(promises);
    console.log(`Loaded ${issues.length} issues.`);
    return issues;
  } catch (err) {
    console.error(err);
    throw new Error('Could not parse data after fetch');
  }
}
