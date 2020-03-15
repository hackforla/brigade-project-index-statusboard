<template>
    <li>
        <div>
            <strong><router-link :to="`/brigade/${project.brigade_slug}`">{{ project.brigade }}</router-link>:</strong> {{ project.name }}
        </div>
        <div class="metrics">
            <span class="passed-metric" v-if="project.topics" :title="project.topics">
                <i class="fa fa-check"></i> GithubTopics
            </span>
            <span class="passed-metric" v-if="project.description" :title="project.description">
                <i class="fa fa-check"></i> Github Description
            </span>
            <a v-if="project.git_url" :href="project.code_url">
                <i class="fa fa-github"></i>
            </a>
        </div>
        <div class='other-topics'>
            <span v-for="(t,index) in  other_topics(project.topics)" v-bind:key="index">
                <strong v-if="index == 0">Other Topics:</strong>
                <span v-if="index > 0">,</span>
                <router-link :to="`/topics/${t}`">
                    {{ t }}
                </router-link>
            </span>
        </div>
        <div class="links" v-if="project.link_url">
            <strong>Project:</strong> <a v-bind:href="project.link_url">{{ project.link_url }}</a>
        </div>
        <div class="links" v-if="project.code_url">
            <strong>Code:</strong> <a v-bind:href="project.code_url">{{ project.code_url }}</a>
        </div>
    </li>
</template>

<script>
export default {
    props: ['project'] ,
    methods: {
        other_topics(topics){
            return _.filter(topics, t => t != this.topic);
        }
    }
}
</script>