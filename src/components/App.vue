<template>

    <div class="content">
        <h1>⭐ Brigade Project Index ⭐</h1>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {
            last_check: null,
        };
    },
    created(){
        this.last_check = new Date();
        this.$store.dispatch("load_brigades");
        window.setInterval(this.checkForUpdates, 60000); // Check for updates every minute
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
    h1 {
        position: absolute;
        top: 10px;
        width: 100%;
        text-align: center;
    } 
</style>