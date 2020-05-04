<template>
    <div class="container" id="leaders">
        <h1>Brigade List</h1>
        <ul class="list-group" v-for="brigade in leaders" v-bind:key="brigade.name">
            <li class="list-group-item row">
                <div class="col-sm">
                    <router-link :to="{name:'brigade-detail', params:  { slug: brigade.slug } }" >
                        {{ brigade.name }} 
                    </router-link>
                    {{brigade.city}}
                </div>
                <div class="col-sm">
                    <span class="passed-metric" v-if="brigade.tagged">
                        <i class="fa fa-check"></i> Topics
                    </span>
                    <!--
                    <div class="progress">
                      <div
                        class="progress-bar"
                        role="progressbar"
                        :style="'width: ' + tagged_percent(brigade) + '%'"
                        :aria-valuenow="tagged_percent(brigade)"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >{{ tagged_percent(brigade) }}% have topics</div>
                    </div>
                    -->
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    computed: {
        leaders(){
            return _.sortBy(this.$store.getters.brigades, b => b.name);
        },
    } ,
    methods: {
        tagged_percent(brigade) {
            if(typeof brigade.projects !== 'undefined' && brigade.projects.length > 0) { 
                return (brigade.tagged / brigade.projects.length * 100).toFixed(0);
            }else{
                return 0;
            }

        }
    }
}
</script>

<style scoped>
    #leaders {
        margin-top: 140px;
    }
</style>
