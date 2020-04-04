<template>
  <div class="container" id="brigade">
    <h2>{{ brigade.name }}</h2>

    <dl>
      <dt>City</dt>
        <dd>{{ brigade.city }}</dd>
      <dt>Website</dt>
        <dd>{{ brigade.website }}</dd>
      <dt>Events Url<dt/>
        <dd>{{ brigade.events_url}}</dd>
      <dt>Project List Url</dt>
        <dd>{{ brigade.website }}</dd>
      <dt>Previous Names</dt>
        <dd><span v-for="n in brigade.previous_names" v-bind:key="n">{{ n }}</span></dd>
    </dl>

    <p>{{ brigade.projects.length }} Projects</p>

    <div class="row mb-3">
      <div class="col-sm">
        <h5>Github Topic Coverage</h5>
        <!--
        <div class="progress">
          <div
            class="progress-bar"
            role="progressbar"
            :style="'width: '+tagged_percent+'%'"
            :aria-valuenow="tagged_percent"
            aria-valuemin="0"
            aria-valuemax="100"
          >{{ tagged_percent }}%</div>
        </div>
        -->
      </div>

    </div>

    <ul class="list-group projects" v-for="project in brigade.projects" v-bind:key="project.name">
        <ProjectRow v-bind:project="project" class="list-group-item" />
    </ul>
  </div>
</template>

<script>
import _ from 'lodash';
import ProjectRow from "./ProjectRow.vue"

export default {
    components: {
      ProjectRow
    },
    props: ['slug'],
    computed: {
        tagged_percent(){
            return Math.round((this.brigade.tagged / this.brigade.projects.length) * 100);
        },
        brigade(){
            const b = _.find(this.$store.getters.brigades, b => b.slug == this.slug );
            return b;
        },
    },
}
</script>

<style scoped>
#brigade {
  margin-top: 140px;
}

.topics {
  font-style: italic;
}

</style>