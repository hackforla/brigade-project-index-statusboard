<template>
  <div id="brigade">
    <h2>{{ brigade.name }}</h2>
    <p>{{ brigade.projects.length }} Projects</p>

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

    <div class="projects" v-for="project in brigade.projects">
        <h3>{{ project.name }}</h3>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
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