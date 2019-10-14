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
        <dd><span v-for="n in brigade.previous_names">{{ n }}</span></dd>
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

    <ul class="list-group projects" v-for="project in brigade.projects">
        <li class="list-group-item">
          <h4><a :href="project.link_url">{{ project.name }}</a></h4>
          <div v-if="project.topics" class="topics">{{ project.topics.join(', ') }}</div>
          <span class="passed-metric" v-if="project.topics" :title="project.topics">
                <i class="fa fa-check"></i> GithubTopics
          </span>
          <span class="passed-metric" v-if="project.description" :title="project.description">
                <i class="fa fa-check"></i> Github Description
          </span>
          <a v-if="project.git_url" :href="project.code_url">
            <i class="fa fa-github"></i>
          </a>
        </li>
    </ul>
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

<style scoped>
#brigade {
  margin-top: 140px;
}
.passed-metric {
  color: #00a175;
}
.topics {
  font-style: italic;
}
</style>