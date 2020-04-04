<template>
    <div class="container" v-if="project">
        <h1 class="text-center">{{ project.name }}</h1>
        <div class="row">
            <h3 class="col-sm-12">
                <router-link :to="`/brigade/${project.brigade_slug}`">{{ project.brigade }}</router-link>
            </h3>
            <p class="col-sm-12 project-description" v-if="project.description">
                {{ project.description }}
            </p>
            <p class="col-sm-12 links" v-if="project.link_url">
                <strong>Project:</strong> <a v-bind:href="project.link_url">{{ project.link_url }}</a>
            </p>
            <p class="col-sm-12 links" v-if="project.code_url">
                <strong>Code:</strong> <a v-bind:href="project.code_url">{{ project.code_url }}</a>
            </p>
        </div>

        <div class="row mt-3">
            <div class="col-sm">
                <h4>How to Improve your Project's Visibility</h4>

                <p>
                    The following guidelines will help you improve your projects "meta data" to increase visibility for potential
                    collaborators, volunteers, and partners. Additionally, it helps the brigade network as a whole by helping incoming
                    civic tech volunteers with help in finding existing projects to deploy and build upon. 

                </p>
                <p><a class="button" target="_blank" href="https://discourse.codeforamerica.org/t/making-your-project-contributor-friendly/737">Learn More</a></p>
            </div>
        </div>


        <div class="row mt-3">
            <h4 class="col-sm-12">Ways to Project's Visibility</h4>
            <ul class="col-sm">
                <li>
                    <strong>Add Topics / Tags</strong> <i v-if="project.topics" class="fa fa-check"></i>  
                    <p v-if="github_project">
                        Adding <router-link to="topics">Topics Tags</router-link> to your project on github. 
                        <a href="#" target="_blank">Learn More</a>
                    </p>
                    <p v-else>
                        Add "intended Audience" or "scope" to a <a :href="publiccode_yml_url" target="_blank">publiccode.yml</a> file (preferred), 
                        or "categories" to a <a :href="civic_json_url" target="_blank">civic.json</a> file in your repo's root folder.
                    </p>
                </li>
                <li>
                    <strong>Add Description</strong>
                    <p v-if="github_project">
                        Add a description to your project on github. 
                        <a href="#" target="_blank">Learn More</a>
                    </p>
                    <p v-else>
                        Add "description" to a <a :href="publiccode_yml_url" target="_blank">publiccode.yml</a> file, 
                        or "description" to a <a :href="civic_json_url" target="_blank">civic.json</a> file in your repo's root folder.
                    </p>
                </li>
                <li>
                    <strong>Add a Project URL</strong>
                    <p v-if="github_project">
                        Add a project URL to your project on github (e.g. your project homepage). 
                        <a href="#" target="_blank">Learn More</a>
                    </p>
                    <p v-else>
                        Add a "landingUrl" to a <a :href="publiccode_yml_url" target="_blank">publiccode.yml</a> file, 
                        or "homepage" to a <a :href="civic_json_url" target="_blank">civic.json</a> file in your repo's root folder.
                    </p>
                </li>
                <li>
                    <strong>Add a README</strong>
                    <p>
                        Add a README to your code repo. 
                        <a href="https://help.github.com/en/github/building-a-strong-community/creating-a-default-community-health-file" target="_blank">Learn More</a>
                    </p>
                </li>
                <li>
                    <strong>Add a CONTRIBUTING guide</strong>
                    <p>
                        Add a CONTRIBUTING guide to your code repo. 
                        <a href="https://help.github.com/en/github/building-a-strong-community/creating-a-default-community-health-file" target="_blank">Learn More</a>
                        and 
                        <a href="https://discourse.codeforamerica.org/t/making-your-project-contributor-friendly/737" target="_blank">Brigade specific help</a>
                    </p>
                </li>
                <li>
                    <strong>Choose an appropriate License</strong>
                    <p>
                        Selecting a commonly used open-source or Creative Commons license will make it more likely to be indexed.
                        <a href="https://discourse.codeforamerica.org/t/making-your-project-contributor-friendly/737" target="_blank">Learn More</a>
                    </p>
                </li>
                <li>
                    <strong>Choose an appropriate License</strong>
                    <p>
                        Selecting a commonly used open-source or Creative Commons license will make it more likely to be indexed.
                        <a href="https://discourse.codeforamerica.org/t/making-your-project-contributor-friendly/737" target="_blank">Learn More</a>
                    </p>
                </li>
                <li>
                    <strong>Add Meta Data to your Repository</strong>
                    <p>
                        Add a <a :href="publiccode_yml_url" target="_blank">publiccode.yml</a> file or 
                        <a :href="civic_json_url" target="_blank">civic.json</a> file in your repo's root folder.
                        <a href="https://discourse.codeforamerica.org/t/making-your-project-contributor-friendly/737" target="_blank">Learn More</a>
                    </p>
                </li>            
            </ul>
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
    data() {
        return {
            civic_json_url: "http://open.dc.gov/civic.json/",
            publiccode_yml_url: "https://docs.italia.it/italia/developers-italia/publiccodeyml-en/en/master/index.html",
        }
    },
    computed: {
        project() {
            const b = _.find(this.$store.getters.brigades, b => b.slug == this.slug );
            if( b == null ){ return null }
            return _.find(b.projects, p => p.slug == slugify(this.project_slug));
        },
        github_project(){
            return this.project.code_url && this.project.code_url.startsWith("https://github.com/")
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