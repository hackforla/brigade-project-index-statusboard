import Octokit from '@octokit/rest';
import JSZip from 'jszip';
import _ from 'lodash';
import toml from 'toml';

export default function getProjectIndex(){
    // We will make calls out to Github for the latest index information
    const octokit = Octokit({
        auth: process.env.GITHUB_TOKEN
    })

    // TODO return promise
    octokit.repos.getArchiveLink({
        owner:'codeforamerica',
        repo:'brigade-project-index',
        archive_format:'zipball',
        ref:'index'  
    }).then( (response) => {
        // Download the latest brigade index in a zip archive
        const index_zip = new JSZip();
        index_zip.loadAsync( response.data ).then( archive => {
            // Iterate through all the .toml files
            const orgs = [];
            const projects = [];
            // Parse them into organizations / projects
            index_zip.folder('').forEach( (path) => {
                const parts = path.split('/');
                const t = parts[1];
                // Tag projects with org name / project name per path
                if( t == "projects" && parts.length == 4 ){
                    console.log(`Project: ${parts[2]}/${parts[3].replace('.toml','')} `);
                    const f = index_zip.file(path);
                    if(f){
                        f.async('string').then( data => {
                            const p = toml.parse(data);
                            p.name = parts[parts.length - 1].replace('.toml','');
                            p.brigade = parts[parts.length - 2];
                            if( p.brigade == 'Open San Diego'){
                                console.log(p);
                            }
                            projects.push(p)
                        }) 
                    }
                // tag with org name per path
                }else if(t == "organizations" && parts.length == 3 ){
                    console.log(`Org: ${parts[2].replace('.toml','')} `);
                    const f = index_zip.file(path);
                    if(f){
                        index_zip.file(path).async('string').then( data => {
                            const o = toml.parse(data);
                            o.name = parts[parts.length - 1].replace('.toml','');
                            if( o.name == 'Open San Diego'){
                                console.log(o);
                            }
                            orgs.push(o)
                        })
                    }
                }
            });
        }).catch( error => { 
            console.log(error.message);
        })
    }).catch( error => {
        console.log(error);
    })
}

getProjectIndex();