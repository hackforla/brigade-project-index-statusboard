// Routed components
import Vue from 'vue';
import Router from 'vue-router';
import store from './store.js';
import BrigadeMap from './components/BrigadeMap.vue';
import Leaderboard from './components/Leaderboard.vue';
import BrigadeDetail from './components/BrigadeDetail.vue';

Vue.use(Router)

// Router
export default new Router({
    routes: [
        {
            path: '/', 
            name: 'overview',
            component: BrigadeMap,
        },
        {
            path: '/leaders', 
            name: 'leaders',
            component: Leaderboard,
        },
        {
            path: '/brigade/:slug', 
            component: BrigadeDetail,
            name: 'brigade-detail',
            props: true,
        }
    ]
});