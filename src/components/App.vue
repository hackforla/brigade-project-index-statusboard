<template>

    <div class="content">
        <h1>⭐ Brigade Project Index ⭐</h1>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    created(){
        this.$store.dispatch("load_brigades");
    }
}
</script>

<style scoped>
    h1 {
        position: fixed;
        top: 10px;
        width: 100%;
        text-align: center;
    } 
</style>