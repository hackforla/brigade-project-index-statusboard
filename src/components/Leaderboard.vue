<template>
    <div class="container" id="leaders">
        <h2>Leaders</h2>
        <ul class="list-group" v-for="brigade in leaders">
            <li class="list-group-item">
                <router-link :to="{name:'brigade-detail', params:  { slug: brigade.slug } }" >
                    {{ brigade.name }}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    computed: {
        leaders(){
            return this.$store.getters.leaders;
        },
    } 
}
</script>

<style scoped>
    #leaders {
        margin-top: 140px;
    }
</style>