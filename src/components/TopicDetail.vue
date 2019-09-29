<template>
    <div class="container" id="topics">
        <h2>Projects tagged with {{ topic }}</h2>
        <ul class="list-group" v-for="project in tagged_projects">
            <li class="list-group-item row">
                <div><strong>{{ project.brigade_name }}:</strong> {{ project.name }}</div>
                <div class='other-topics'>{{ other_topics(project.topics) }}</div>
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
            const other = _.filter(topics, t => t != this.topic);
            if(other.length){ 
                return `other topics: ${other.join(',')}`
            }else{ return ''; }
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