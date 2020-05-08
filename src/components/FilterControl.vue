<template>
  <div className="filter-control">
    <span className="filter-label">Filter:</span>
    <Multiselect
      :value="filters"
      label="value"
      track-by="value"
      :options="availableFilters"
      :multiple="true"
      :close-on-select="false"
      :hide-selected="true"
      :limit="20"
      :options-limit="300"
      placeholder="Type to start filtering"
      @input="update_filters"
    >
      <template slot="tag" slot-scope="{ option, remove }">
        <span className="custom__tag">
          <span><strong>{{ option.type }}:</strong> {{ option.value }}</span>
          <span className="custom__remove" @click="remove(option)">❌</span>
        </span>
      </template>
      <span slot="noResult">
        No matching filters found.
      </span>
    </Multiselect>
    <button
      className="clear-filters-button"
      @mousedown.prevent.stop="clearAllFilters"
    >
      Clear All Filters
    </button>
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
    availableFilters: function () {
      return [...this.tags, ...this.locations];
    },
    tags: function () {
      const topics = this.$store.getters.topics;
      const discourse_tags = Object.values(
        this.$store.getters.discourse_tag_map
      ).map(t => t.id);
      const filterTags = this.mergeTopicsWithSource(topics, discourse_tags)
        .sort((a, b) => a.value.localeCompare(b.value));
      return filterTags;
    },
    locations: function () {
      const brigades = this.$store.getters.brigades;
      const locations = brigades.map(b => {
        return {
          value: b.city,
          brigadeName: b.name,
          type: 'Location'
        };
      }).sort((loc1, loc2) => {
        return loc1.value.localeCompare(loc2.value);
      });
      return locations;
    },
    ...mapState(['filters'])
  },
  methods: {
    mergeTopicsWithSource: function(github, discourse) {
      const uniq = [...new Set([...github, ...discourse])];
      const all = [];
      for (const topic of uniq) {
        const val = { value: topic, type: 'Topic', sources: [] };
        if (discourse.indexOf(topic) > -1) { val.sources.push('discourse'); }
        if (github.indexOf(topic) > -1) { val.sources.push('github'); }
        all.push(val);
      }
      return all;
    },
    limitText: function (count) {
      return `... and ${count} other filters`
    },
    clearAllFilters: function () {
      this.update_filters([], []);
    },
    ...mapActions([
      'update_filters'
    ])
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.filter-control {
  padding: 0 10%;
  display: flex;
  flex-direction: row;
}
.filter-control .filter-label {
  flex: initial;
  text-align: baseline;
  color: white;
}
.filter-control .multiselect {
  flex: auto;
  padding-right: 0.75rem;
}
.filter-control .multiselect .custom__tag {
  padding: 3px;
  border-radius: 3px;
  border: 1px solid #00a175;
}
.filter-control .clear-filters-button {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #cf1b41;
}
.filter-control .clear-filters-button:hover {
  fill: #cf1b41;
}
</style>
