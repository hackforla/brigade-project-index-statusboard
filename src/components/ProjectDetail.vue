<template>
    <div class="container" v-if="project">
        <h2>{{ project.name }}</h2>
        <div>
            <strong><router-link :to="`/brigade/${project.brigade_slug}`">{{ project.brigade }}</router-link>:</strong> {{ project.name }}
        </div>
        <div class="project-description" v-if="project.description">
            {{ project.description }}
        </div>
        <div class="links" v-if="project.link_url">
            <strong>Project:</strong> <a v-bind:href="project.link_url">{{ project.link_url }}</a>
        </div>
        <div class="links" v-if="project.code_url">
            <strong>Code:</strong> <a v-bind:href="project.code_url">{{ project.code_url }}</a>
        </div>

        <!-- Suggestsions for improvement -->
        <!--  

            Indexing  Metrics
             * topic tags!
             * descriptions
             * Status 
             * publiccode.yaml  
             * project url
             * project status (check vs activity)

            On-Boarding
            * README
            * CONTRIBUTING

            Network Effects?
            * Forks / Related Prejcts

         -->
    </div>
</template>

<script>
import slugify from '../utils.js'

export default {
    props: ['slug','project_slug'] ,
    computed: {
        project() {
            const b = _.find(this.$store.getters.brigades, b => b.slug == this.slug );
            if( b == null ){ return null }
            return _.find(b.projects, p => p.slug == slugify(this.project_slug));
        }
    },
    methods: {
        other_topics(topics){
            return _.filter(topics, t => t != this.topic);
        }
    }
}
</script>

<style scoped>
    .container {
        margin-top: 140px;
    }
    .project-description {
        padding-left: 1.2rem;
        font-style: italic;
    }
</style>