// Routed components
import Vue from 'vue';
import Router from 'vue-router';
import store from './store.js';
import BrigadeMap from './components/BrigadeMap.vue';
import Leaderboard from './components/Leaderboard.vue';
import BrigadeDetail from './components/BrigadeDetail.vue';
import Topics from './components/Topics.vue';
import TopicDetail from './components/TopicDetail.vue';
import ProjectDetail from './components/ProjectDetail.vue';

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
            beforeEnter: (to, from, next) => {
                store.dispatch("load_all").then(next)
            } 
        },
        {
            path: '/topics', 
            name: 'topics',
            component: Topics,
            beforeEnter: (to, from, next) => {
                store.dispatch("load_all").then(next)
            } 
        },
        {
            path: '/topics/:topics', 
            name: 'topic-detail',
            component: TopicDetail,
            props: true,
            beforeEnter: (to, from, next) => {
                store.dispatch("load_all").then(next)
            } 
        },
        {
            path: '/brigade/:slug', 
            component: BrigadeDetail,
            name: 'brigade-detail',
            props: true,
            beforeEnter: (to, from, next) => {
                store.dispatch("load_all").then(next)
            } 
        },
        {
            path: '/project/:slug/:project_slug', 
            component: ProjectDetail,
            name: 'project-detail',
            props: true,
            beforeEnter: (to, from, next) => {
                store.dispatch("load_all").then(next)
            } 
        }
    ]
});