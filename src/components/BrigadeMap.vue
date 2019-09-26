<template>
    <svg width="100%" height="100%" id="map" class="d-block w-100"></svg>
</template>

<script>
export default {
   data() {
       return {
       };
   } ,
   created(){
       console.log("todo create map");
   },
}
</script>

<style scoped>
    svg { background-color: #f0f; }
</style>