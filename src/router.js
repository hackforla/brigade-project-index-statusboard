// Routed components
import Vue from 'vue';
import Router from 'vue-router';
import store from './store.js';
import BrigadeMap from './components/BrigadeMap.vue';

Vue.use(Router)

// Router
export default new Router({
    routes: [
        {
            path: '/', 
            component: BrigadeMap,
        }
    ]
});