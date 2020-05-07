<template>
  <div>
    <BrigadeMap></BrigadeMap>
    <Leaderboard show-projects="true"></Leaderboard>
  </div>
</template>

<script>
import BrigadeMap from './BrigadeMap.vue';
import Leaderboard from './Leaderboard.vue';

export default {
  components: {
    BrigadeMap,
    Leaderboard
  }
}
</script>

<style scoped>
</style>