<template>
    <div
        id="projects-list"
        :class="collapsed ? 'collapsed' : ''"
        v-if="has_projects(brigade)"
    >
        <div class="list-title projects" v-on:click="collapsed = !collapsed">
              <span>{{ brigade.name }} Projects</span>
              <i :class="accordionIcon"></i>
        </div>
        <ul class="list-group projects"
              v-for="project in filtered_projects(brigade)"
              v-bind:key="project.name" >
              <ProjectRow
                    v-bind:project="project"
                    class="list-group-item" />
        </ul>
    </div>
</template>

<script>
import ProjectRow from './ProjectRow.vue';

export default {
    props: ["brigade"],
    components: {
      ProjectRow
    },
    data: function () {
        return { collapsed: true }
    },
    computed: {
        accordionIcon: function () {
            return this.collapsed ? 'fa fa-chevron-down' : 'fa fa-times';
        }
    },
    methods: {
        filtered_projects(brigade) {
            const filtered = brigade.projects.filter((project) => {
                const topics = this.$store.state.filters
                    .filter(f => f.type === 'Topic').map(f => f.value);
                if (topics.length === 0) { return true; }
                if (typeof project.topics === 'undefined') { return false; }
                for (const projectTopic of project.topics) {
                    if (topics.includes(projectTopic)) { return true; }
                }
                return false;
            });
            console.log(`FILTERED PROJECTS FOR ${brigade.name}:`, filtered);
            return filtered;
        },
        has_projects(brigade) {
            return this.filtered_projects(brigade).length > 0;
        }
    }
}
</script>

<style scoped>
    #projects-list .list-title.projects {
        margin-top: 0.75rem;
        margin-bottom: 8px;
        padding: 0.25rem 1.25rem;
        background-color: rgba(0, 0, 0, 0.125);
        border: 1px solid rgba(0, 0, 0, 0.25);
        border-radius: 0.25rem;
        display: flex;
    }
    #projects-list .list-title.projects > span {
        flex: auto;
    }
    #projects-list .list-title.projects > i {
        flex: initial;
    }
    #projects-list .list-group.projects {
        display: block;
    }
    #projects-list.collapsed .list-group.projects {
        display: none;
    }
</style>
