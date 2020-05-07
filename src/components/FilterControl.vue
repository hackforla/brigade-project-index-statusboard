<template>
  <div id="filter-control">
    <Multiselect
      :value="topic_filters"
      label="value"
      track-by="value"
      :options="tags"
      :multiple="true"
      :close-on-select="false"
      :hide-selected="true"
      :limit="20"
      :options-limit="300"
      placeholder="Type a topic to filter on"
      @input="update_topic_filters"
    >
      <template slot="tag" slot-scope="{ option, remove }">
        <span class="custom__tag">
          <span><strong>Topic:</strong> {{ option.value }}</span>
          <span class="custom__remove" @click="remove(option)">❌</span>
        </span>
      </template>
      <template slot="clear" slot-scope="props">
        <div class="multiselect__clear"
          v-if="topic_filters.length"
          @mousedown.prevent.stop="clearAllTopics(props.search)"
        ></div>
      </template>
      <span slot="noResult">
        No matching topics found.
      </span>
    </Multiselect>
    <Multiselect
      :value="location_filters"
      label="value"
      track-by="value"
      :options="locations"
      :multiple="true"
      :close-on-select="false"
      :hide-selected="true"
      :limit="20"
      :options-limit="300"
      placeholder="Type a location to filter on"
      @input="update_location_filters"
    >
      <template slot="tag" slot-scope="{ option, remove }">
        <span class="custom__tag">
          <span><strong>Location:</strong> {{ option.value }}</span>
          <span class="custom__remove" @click="remove(option)">❌</span>
        </span>
      </template>
      <template slot="clear" slot-scope="props">
        <div class="multiselect__clear"
          v-if="location_filters.length"
          @mousedown.prevent.stop="clearAllLocations(props.search)"
        ></div>
      </template>
      <span slot="noResult">
        No matching locations found.
      </span>
    </Multiselect>
  </div>
</template>

<script>
import Vuex from 'vuex';
import Multiselect from 'vue-multiselect';

const { mapActions, mapState } = Vuex;

export default {
  props: ["callback"],
  components: {
    Multiselect
  },
  computed: {
    tags: function () {
      const topics = this.$store.getters.topics;
      const discourse_tags = Object.values(
        this.$store.getters.discourse_tag_map
      ).map(t => t.id);
      const filterTags = [...new Set([...topics, ...discourse_tags])].sort();
      const selectableFilters = filterTags.map(f => {
        return {
          selectLabel: `Topic: ${f}`,
          value: f
        };
      })
      return selectableFilters;
    },
    locations: function () {
      const brigades = this.$store.getters.brigades;
      const locations = brigades.map(b => {
        return {
          selectLabel: `Location: ${b.city}`,
          value: b.city,
          brigadeName: b.name
        };
      }).sort((loc1, loc2) => {
        return loc1.value.localeCompare(loc2.value);
      });
      return locations;
    },
    ...mapState(['location_filters', 'topic_filters'])
  },
  methods: {
    limitTextTopics: function (count) {
      return `... and ${count} other topics`
    },
    limitTextLocations: function (count) {
      return `... and ${count} other locations`
    },
    clearAllFilters: function () {
      this.update_filters([], []);
    },
    clearAllTopics: function () {
      this.update_topic_filters([]);
    },
    clearAllLocations: function () {
      this.update_location_filters([]);
    },
    ...mapActions([
      'update_filters',
      'update_location_filters',
      'update_topic_filters'
    ])
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
#filter-control {
  margin-top: 50px;
  padding: 0 10%;
  display: flex;
}
#filter-control .multiselect {
  flex: auto;
  max-width: 40%;
  padding-right: 0.75rem;
}
</style>
