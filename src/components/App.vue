<template>
    <div class="content">
        <Nav></Nav>
        <main>
            <div class="loader" v-if="loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">loading...</span>
                </div>
                Loading {{ loading }}
            </div>
            <router-view class="main-router-view"></router-view>
        </main>
    </div>
</template>

<script>
import Nav from "./Nav.vue";

export default {
    components: {
        Nav
    },
    data() {
        return {
            last_check: null,
        };
    },
    computed: {
        loading() {
            return this.$store.getters.loading;
        },
        dev_site() {
            return this.$store.getters.is_dev_site;
        }
    },
    created() {
        this.last_check = new Date();
        this.$store.dispatch("load_all");
        window.setInterval(this.checkForUpdates, 60 * 1000 * 10); // Check for updates every 10 minutes
    },
    methods: {
        checkForUpdates() {
            this.$store.dispatch("check_for_updates", this.last_check);
            this.last_check = new Date();
        }
    }
};
</script>

<style>
.main-router-view {
    margin-bottom: 80px;
}
</style>
