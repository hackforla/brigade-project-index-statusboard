import axios from "axios";
import * as _ from "lodash";
import Vue from 'vue';
import Vuex from 'vuex'
import toml from 'toml';
import slugify from './utils.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        brigades: [],
        last_update: null,
        loading: "brigades",
        discourse_tags: [],
        is_dev_site: false, // OTOD pass info frorm ENV variables
    },
    getters: {
        brigades: state => {
            return state.brigades;
        },
        leaders: state => {
            const leaders = _.sortBy(state.brigades, b => -(b.tagged/b.projects.length));
            return _.slice(leaders,0,10);
        },
        topics: state => {
            const topics = [];
            state.brigades.forEach( br => {
                if(br.projects){
                    br.projects.forEach( prj => {
                        if(typeof prj.topics !== 'undefined') {
                            topics.push( ...prj.topics );
                        }
                    });
                }
            })
            return topics;
        },
        projects: state => {
            return _.flatten(_.map(state.brigades, b => b.projects));
        },
        loading: state => {
            return state.loading;
        },
        discourse_tags: state => {
            return state.discourse_tags
        },
        discourse_tag_map: state => {
            const map = {}
            state.discourse_tags.forEach( t => {
                map[t.id] = t
            }) 
            return map
        }
    },
    mutations: {
        add_brigades( state, brigades ){
            state.brigades = brigades;
        },
        set_loading( state, value ){
            state.loading = value;
            state.last_update = new Date();
        },
        add_discourse_tags( state, tags ){
            state.discourse_tags = tags;
        }
    },
    actions: {
        load_all( {commit, dispatch} ){
            const url = `/api/data.json`;

            Promise.all( [
                axios.get( url ).then( response => {
                    const brigades = response.data;
                    brigades.forEach( b => {
                        b.tagged = b.projects.filter( p => typeof p.topics !== 'undefined' && p.topics.length ).length;
                        b.projects.forEach( p => {
                            p.slug = slugify(p.name);
                        })
                    })
                    //console.log("loaded brigades",brigades);
                    commit('add_brigades', brigades);
                }),
                axios.get( `/api/tags.json` ).then( response => {
                    const discourse_tags = response.data;
                    commit('add_discourse_tags', discourse_tags.tags);
                })
            ]).finally( () => {
                commit('set_loading',false);
            })
        },
       check_for_updates({commit, state, dispatch}, last_check) {
            console.log("TODO check for updates given last check was at ",last_check);
            dispatch("load_all");
        },
    },
});
