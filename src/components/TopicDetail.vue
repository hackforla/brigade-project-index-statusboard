<template>
    <div class="container" id="topics">
        <h2>Projects tagged with {{ topics }}</h2>

        <div class="row" v-if="discourse_tags">
            <p v-for="t in topic_list">
                <a target="_blank" :href="`https://discourse.codeforamerica.org/tag/${t}`">Discourse Topic for {{ t }}</a>
            </p>
        </div>

        <BrigadeMap v-bind:filter_topic="topics" />
        <div class="row">
            <div class="col-sm-12 col-md-3 right mb-2">
                <span class="badge badge-primary ml-1 topic-badge" v-for="t in topic_list" v-bind:key="t">{{ t }} <a @click="remove_topic(t)">X</a> </span>
            </div>
            <div class="col-sm-12 col-md-3 right mb-2">
                <input v-model="new_topic" type="text" placeholder="Filter Additional Topic" /> <button class="btn btn-primary" @click="add_topic">Add</button>
            </div>
        </div>
        <ul class="list-group mb-2" v-for="project in topiced_projects" v-bind:key="project.name">
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
import _ from 'lodash';

export default {
    components: {
        ProjectRow,
        BrigadeMap,
    },
    data(){
        return {
            new_topic: null,
        }
    },
    props: ['topics'],
    computed: {
        topic_list(){
            const topic_list = _.sortBy(this.topics.split(','))
            return topic_list;
        },
        topiced_projects(){
            const topics = this.topic_list;
            return _.filter(this.$store.getters.projects, p => {
                if(typeof p.topics === 'undefined'){ return false } 
                var found = true;
                topics.forEach( t => {
                    if( p.topics.indexOf(t) < 0 ){ found = false }
                })
                return found;
            })
        },
        discourse_tags() {
            const matching = {}
            this.$store.getters.discourse_tags.forEach( t => {
                if(this.topic_list.includes(t.id.toLowerCase())){
                    matching[t.id.toLowerCase()] = t
                }
            })
            return matching;
        }
    },
    methods: {
        add_topic(){
            console.log("would add ",this.new_topic)
            if(this.topic_list.includes(this.new_topic)){
                return
            }
            const new_topics = this.topics + "," + this.new_topic;
            this.$router.push({ name: 'topic-detail', params: { topics: new_topics } })
            this.new_topic = ""
        },
        remove_topic(t){
            console.log("Removing ",t)
            const topics = this.topic_list
            if(topics.length == 1){ return }
            const i = topics.indexOf(t)
            console.log("Splicing",t,i,topics)
            topics.splice(i,1)
            const new_topics = topics.join(',')
            console.log("new topics",new_topics)
            this.$router.push({ name: 'topic-detail', params: { topics: new_topics } })
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

    .topic-badge { 
        cursor: pointer;
    }
</style>