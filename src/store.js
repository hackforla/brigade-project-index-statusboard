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
        set_brigades( state, brigadesj ){
            state.brigades = brigades;
        },
    },
    actions: {
        load_brigades ({ commit,dispatch } ) {
            const url = `/data/brigades.json`;

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
