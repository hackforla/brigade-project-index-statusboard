<template>
    <div class="container" id="topics">
        <h2>Projects tagged with {{ topic }}</h2>
        <ul class="list-group" v-for="project in tagged_projects">
            <li class="list-group-item row">
                <div><strong>{{ project.brigade }}:</strong> {{ project.name }}</div>
                <div class='other-topics'>
                    <span v-for="(t,index) in  other_topics(project.topics)">
                        <strong v-if="index == 0">Other Topics:</strong>
                        <span v-if="index > 0">,</span>
                        <router-link :to="`/topics/${t}`">
                            {{ t }}
                        </router-link>
                    </span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ['topic'],
    computed: {
        tagged_projects(){
            return _.filter(this.$store.getters.projects, p => {
                return (typeof p.topics !== 'undefined' && p.topics.indexOf( this.topic) >= 0 );
            })
        }
    } ,
    methods: {
        other_topics(topics){
            return _.filter(topics, t => t != this.topic);
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