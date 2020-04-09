import './style.scss';
import Vue from 'vue';

// Core application bits
import App from './components/App.vue'
import store from './store.js';
import router from './router.js';
import slugify from './utils.js';

Vue.filter('slugify', slugify);

// App
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
