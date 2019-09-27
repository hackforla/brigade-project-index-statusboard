<template>
    <div id="leaders">
        <button>Close</button>
        <div class="panel" v-for="brigade in leaders">
            <div>{{ brigade.name }}</div>
        </div>
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