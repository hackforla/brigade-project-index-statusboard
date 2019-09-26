import axios from "axios";
import * as _ from "lodash";
import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        brigades: null,
        projects: null,
        last_update: new Date(),
    },
    getters: {
        brigades: state => {
            return state.brigades;
        },
    },
    mutations: {
        set_brigades( state, brigades ){
            // Consider is this how we filter for Brigades?
            state.brigades = _.filter(
                brigades,
                b => typeof(b.type) !== 'undefined' && b.type.indexOf('Brigade') >= 0
            );
        },
    },
    actions: {
        load_brigades ({ commit,dispatch } ) {
            const url = `/data/organizations.json`;

            axios.get(url).then( response => {
                const data = response.data;
                commit('set_brigades', data);
                dispatch('load_projects')
            });
        },
        load_projects({ commit,dispatch }) {
            // TODO brigades.forEach ...
        },
    }
});
