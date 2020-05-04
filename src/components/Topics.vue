<template>
    <div class="container" id="topics">
        <h2>Topics by Usage</h2>
        <p>Topics have been normalized to be case insensitive and ignore dashes</p>
        <table class="col-sm table">
            <thead>
                <tr><th>topic</th><th>Discourse</th><th>uses</th></tr>
            </thead>
            <tbody>
                <tr v-for="t in topic_frequencies" v-bind:key="t[0]">
                    <td><router-link :to="`/topics/${t[0]}`">{{ t[0] }}</router-link></td>
                    <td>
                        <div v-if="discourse_tags[t[0]]">
                            <a target="_blank" :href="`https://discourse.codeforamerica.org/tag/${t[0]}`">on discourse</a>
                        </div>
                     </td>
                    <td>{{ t[1] }}</td>
                </tr>
            </tbody>
        </table>
        <p class="col-sm"><sup>1</sup>Topics are normalized case-insensitive and by removing dashes to consolidate</p>
    </div>
</template>

<script>
export default {
    computed: {
        topic_frequencies(){
            const topics = this.$store.getters.topics;
            const fq = {};
            topics.forEach( t => {
                if(typeof fq[t] === 'undefined'){
                    fq[t] = 1
                }else{
                    fq[t]++;
                }
            })
            return _.reverse(_.sortBy(_.toPairs(fq),1));
        },
        discourse_tags(){
            return this.$store.getters.discourse_tag_map
        }
    } 
}
</script>

<style scoped>
</style>