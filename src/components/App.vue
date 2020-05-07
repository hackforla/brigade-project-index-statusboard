<template>

    <div class="content">
        <header>
            <h1><router-link to="/">Brigade Project Index</router-link></h1>
            <h2>status board</h2>
            <div class="loader" v-if="loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">loading...</span>
                </div>
                Loading {{ loading }}
            </div>
            <FilterControl></FilterControl>
        </header>
        <router-view class="main-router-view"></router-view>
        <div class="leader-link">
            <router-link class="btn btn-primary" to="/by-loc">Projects by Location</router-link>
            <router-link class="btn btn-primary" to="/map">Map</router-link>
            <router-link class="btn btn-primary" to="/leaders">Brigades</router-link>
            <router-link class="btn btn-primary" to="/topics">Projects by Topic</router-link>
            <router-link class="btn btn-warning" to="/topics/covid-19">Covid-19 Related Projects</router-link> 
        </div>
    </div>
</template>

<script>
import FilterControl from './FilterControl.vue';

export default {
    components: {
        FilterControl
    },
    data() {
        return {
            last_check: null,
        };
    },
    computed: {
        loading(){
            return this.$store.getters.loading;
        },
        dev_site(){
            return this.$store.getters.is_dev_site;
        }
    },
    created(){
        this.last_check = new Date();
        this.$store.dispatch("load_all");
        window.setInterval(this.checkForUpdates, 60*1000*10); // Check for updates every 10 minutes
    },
    methods: {
        checkForUpdates() {
            this.$store.dispatch("check_for_updates", this.last_check);
            this.last_check = new Date();
        }
    }
}
</script>

<style>
    header {
        position: absolute;
        top: 10px;
        width: 100%;
        text-align: center;
    } 
    .leader-link {
        position: fixed;
        left: 8px;
        bottom: 8px;
    }
    .main-router-view {
        margin-bottom: 80px;
    }
</style>