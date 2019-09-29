<template>
    <div class="container" id="leaders">
        <h2>Github Taggging Leaders</h2>
        <ul class="list-group" v-for="brigade in leaders">
            <li class="list-group-item row">
                <div class="col-sm">
                    <router-link :to="{name:'brigade-detail', params:  { slug: brigade.slug } }" >
                        {{ brigade.name }}
                    </router-link>
                </div>
                <div class="col-sm">
                    <div class="progress">
                      <div
                        class="progress-bar"
                        role="progressbar"
                        :style="'width: '+(brigade.tagged/brigade.projects.length * 100)+'%'"
                        :aria-valuenow="(brigade.tagged/brigade.projects.length * 100)"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >{{ (brigade.tagged/brigade.projects.length * 100).toFixed(0) }}%</div>
                    </div>
                </div>
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