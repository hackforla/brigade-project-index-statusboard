<template>
    <div class="container" id="topics">
        <h2>Projects tagged with {{ topic }}</h2>
        <BrigadeMap v-bind:filter_tag="topic" />
        <ul class="list-group mb-2" v-for="project in tagged_projects" v-bind:key="project.name">
            <ProjectRow v-bind:project="project" class="list-group-item row" />
        </ul>
        <!--
        <div class="row">
            <div class="col text-center my-2">
                <router-link class="btn btn-primary" :to="`/map/${topic}`">View "{{ topic }}" on Map</router-link>
            </div>
        </div>
        -->
    </div>
</template>

<script>
import ProjectRow from "./ProjectRow.vue"
import BrigadeMap from "./BrigadeMap.vue"

export default {
    components: {
        ProjectRow,
        BrigadeMap,
    },
    props: ['topic'],
    computed: {
        tagged_projects(){
            return _.filter(this.$store.getters.projects, p => {
                return (typeof p.topics !== 'undefined' && p.topics.indexOf( this.topic) >= 0 );
            })
        }
    }
}
</script>

<style scoped>
    #topics {
        margin-top: 140px;
    }
    .other-topics {
        font-style: italic;
    }
</style>