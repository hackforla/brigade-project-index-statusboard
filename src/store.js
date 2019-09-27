import axios from "axios";
import * as _ from "lodash";
import Vue from 'vue';
import Vuex from 'vuex'
import toml from 'toml';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        brigades: [],
        projects: null,
        last_update: new Date(),
    },
    getters: {
        brigades: state => {
            return state.brigades;
        },
        leaders: state => {
            const leaders = _.sortBy(state.brigades, b => -(b.tagged/b.projects.length));
            return _.slice(leaders,0,10);
        }
    },
    mutations: {
        add_brigades( state, brigades ){
            state.brigades = brigades;
        },
        set_projects( state, data ){
            const i = _.findIndex(state.brigades, br => br.name == data.brigade );
            if(i >= 0){
                const br = state.brigades[i];
                br.projects = data.projects;
                if(br.projects.length > 0){
                    br.tagged = br.projects.filter(
                            p => typeof p.topics !== "undefined"
                        ).length;
                }
                // Explicitely update element in array
                Vue.set(state.brigades,i, br);
            }else{
                console.error("failed to update project on brigade, no match for brigade",data.br);
            }
        }
    },
    actions: {
        load_brigades ({ commit,dispatch } ) {
            const url = `/data/organizations/`;

            axios.get(url).then( response => {
                axios.all(
                    response.data.map( brigade_url => {
                        return axios.get(url + brigade_url);
                    })
                ).then( responseArr => {
                    const brigades = responseArr.map( response => {
                        const brigade = toml.parse(response.data);
                        // Would be nice to explicitely include this in the .toml
                        brigade.name = /([^\/]+)\.toml$/.exec(response.config.url)[1];
                        brigade.tagged = null;
                        brigade.projects = [];
                        brigade.slug = brigade.name.toLowerCase().replace(/[^a-zA-Z0-9\-]+/g,"-")
                        return brigade;
                    }).filter( b => typeof b.type !== 'undefined' && b.type.indexOf('Brigade') >= 0  && b.type.indexOf('Code for America') > 0);
                    commit('add_brigades', brigades);
                    dispatch('load_projects');
                });
            });
        },
        load_projects({ commit,dispatch,state }) {
            axios.all(
                state.brigades.map( b => axios({
                    url:`/data/projects/${b.name}/`,
                    validateStatus: s => s == 200 || s == 404,
                }))
            ).then(responseArr => {
                // array of arrays of project toml files 
                console.log(responseArr);
                responseArr.filter( r => r.status == 200).map( response => {
                    const brigade_name = /([^\/]+)\/$/.exec(response.config.url)[1];
                    axios.all( 
                        response.data.map( url => axios.get(response.config.url + url ))
                    ).then( responseArr => {
                        const projects = responseArr.map( 
                            r => {
                                const p = toml.parse(r.data);
                                p.brigade_name = brigade_name;
                                return p;
                            });

                        commit("set_projects", {
                            brigade:brigade_name, 
                            projects:projects
                        } );
                    })
                })
            })
        },
        checkForUpdates({commit, state, dispatch}, last_check) {
            console.log("TODO check for updates given last check was at ",last_check);
        },
    }
});
