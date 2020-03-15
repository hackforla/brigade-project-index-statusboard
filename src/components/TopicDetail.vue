<template>
    <div class="container" id="topics">
        <h2>Projects tagged with {{ topic }}</h2>
        <ul class="list-group" v-for="project in tagged_projects" v-bind:key="project.name">
            <ProjectRow v-bind:project="project" class="list-group-item row" />
        </ul>
    </div>
</template>

<script>
import ProjectRow from "./ProjectRow.vue"

export default {
    components: {
        ProjectRow
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