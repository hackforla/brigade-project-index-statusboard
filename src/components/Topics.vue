<template>
    <div class="container" id="topics">
        <h2>Github Tagging Topics</h2>
        <table class="col-sm table">
            <thead>
                <tr><th>topic</th><th>uses</th></tr>
            </thead>
            <tbody>
                <tr v-for="t in topic_frequencies">
                    <td>{{ t[0] }}</td>
                    <td>{{ t[1] }}</td>
                </tr>
            </tbody>
        </table>
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
        }
    } 
}
</script>

<style scoped>
    #topics {
        margin-top: 140px;
    }
</style>