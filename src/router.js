// Routed components
import Vue from 'vue';
import Router from 'vue-router';
import store from './store.js';
import BrigadeMap from './components/BrigadeMap.vue';
import Leaderboard from './components/Leaderboard.vue';
import BrigadeDetail from './components/BrigadeDetail.vue';
import Topics from './components/Topics.vue';
import TopicDetail from './components/TopicDetail.vue';

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
            path: '/map/:filter_tag', 
            name: 'topic-map',
            component: BrigadeMap,
            props: true,
        },
        {
            path: '/leaders', 
            name: 'leaders',
            component: Leaderboard,
        },
        {
            path: '/topics', 
            name: 'topics',
            component: Topics,
        },
        {
            path: '/topics/:topic', 
            name: 'topic-detail',
            component: TopicDetail,
            props: true,
        },
        {
            path: '/brigade/:slug', 
            component: BrigadeDetail,
            name: 'brigade-detail',
            props: true,
        }
    ]
});