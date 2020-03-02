import Octokit from '@octokit/rest';
import JSZip from 'jszip';
import _ from 'lodash';
import toml from 'toml';
import fs from 'fs';

export function getLastUpdate(){
    // TODO Promise of last commit
}

export default function getProjectIndex(org_type){
    // We will make calls out to Github for the latest index information
    const octokit = Octokit({
        auth: process.env.GITHUB_TOKEN
    })

    // return promise the resolves once we have unzipped and merged
    // all the projects / organizations
    let promise = new Promise( (resolve, reject) => {

        octokit.repos.getArchiveLink({
            owner:'codeforamerica',
            repo:'brigade-project-index',
            archive_format:'zipball',
            ref:'index/v1'  
        }).then( (response) => {
            // Download the latest brigade index in a zip archive
            const index_zip = new JSZip();
            index_zip.loadAsync( response.data ).then( archive => {
                // Iterate through all the .toml files
                const orgs = [];
                const projects = [];
                const promises = [];
                // Parse them into organizations / projects
                index_zip.folder('').forEach( (path) => {
                    const parts = path.split('/');
                    const t = parts[1];
                    // Tag projects with org name / project name per path
                    if( t == "projects" && parts.length == 4 ){
                        const f = index_zip.file(path);
                        if(f){
                            promises.push( f.async('string').then( data => {
                                const p = toml.parse(data);
                                p.name = parts[parts.length - 1].replace('.toml','');
                                p.brigade = parts[parts.length - 2];
                                projects.push(p)
                            })  )
                        }
                    // tag with org name per path
                    }else if(t == "organizations" && parts.length == 3 ){
                        const f = index_zip.file(path);
                        if(f){
                            promises.push( index_zip.file(path).async('string').then( data => {
                                const o = toml.parse(data);
                                o.projects = [];
                                o.name = parts[parts.length - 1].replace('.toml','');
                                o.slug = o.name.toLowerCase().replace(/[^a-zA-Z0-9\-]+/g,"-")
                                orgs.push(o)
                            }))
                        }
                    }
                });

                // After all async loads are finished, we combine the projects into the orgs
                // and keep our original promise
                Promise.all(promises).then( result => {
                    console.log(`Loaded ${orgs.length} orgs and ${projects.length} projects.. joining them`);
                    const orgs_by_name = _.keyBy(orgs,'name');
                    projects.forEach( proj => {
                        if( orgs_by_name[proj.brigade]){
                            orgs_by_name[proj.brigade].projects.push(proj);
                        }
                    });

                    if(org_type != null){
                        resolve(orgs.filter( o => org_type.test(o.type) ));
                    }else{
                        resolve(orgs);
                    }
                });
            }).catch( error => { 
                console.log(error.message);
            })
        }).catch( error => {
            console.log(error);
        })
    });
    return promise;
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