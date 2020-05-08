<template>
    <div>
        <h1>Status board</h1>
        <div id="tooltip"></div>
        <svg id="map" />
        <!-- <div id="announce">
            <span class="badge">🛡</span>
            New Achievement Unlocked for Open San Diego!
        </div> -->
        <!--
        <div class="text-center"> 
            <router-link v-if="filter_tag" class="btn btn-primary" :to="`/topics/${filter_tag}`">"{{ filter_tag }}" Project List</router-link>
        </div> 
        -->
    </div>
</template>

<script>
import _ from "lodash";
import usa_topojson from "us-atlas/states-10m.json";
import * as d3 from "d3";
import * as topojson from "topojson";
import * as d3_composite from "d3-composite-projections";
import cfaColors from '../cfa_colors';

const color3 = d3
    .scaleLinear()
    .domain([0, 1])
    .range([cfaColors.lightGray,cfaColors.red])
    // .range(["#fedd44", "#00a175"])
    .interpolate(d3.interpolateHcl);

export default {
    props: ["filter_tag"],
    data: function () {
        const viewBoxSize = [975, 610];
        return {
            viewBoxSize,
            scalingFactor: 1280,
            translation: viewBoxSize.map(s => s/2)
        }
    },
    computed: {
        brigades() {
            return this.$store.getters.brigades;
        },
        filters() {
            return this.$store.getters.filters;
        }
    },
    watch: {
        brigades: function(newVal, oldVal) {
            this.updateMap();
            // TODO update map
        },
        filter_tag: function(newVal, oldVal) {
            this.updateMap();
        },
        filters: function(newVal, oldVal) {
            console.log('Updating map because filters changed...')
            this.updateMap();
        }
    },
    mounted() {
        this.createMap();
        this.updateMap();
    },
    methods: {
        createMap() {
            const svg = d3.select("#map").attr("viewBox", [
                [0, 0],
                // this.viewBoxSize
                [975, 610]
            ]);
            const projection = this.get_projection();
            const path = d3.geoPath().projection(projection);

            //projection.getCompositionBorders())
            //console.log("making map of ",usa_topojson,svg)

            svg.append("g")
                .attr("class", "states")
                .selectAll("path")
                .data(
                    topojson.feature(usa_topojson, usa_topojson.objects.states)
                        .features
                )
                .enter()
                .append("path")
                .attr("d", path)
                .attr("name", d => d.name);
            svg.append("g").attr("class", "brigades");
        },
        updateMap() {
            const projection = this.get_projection();
            const brigade_r = 10;
            console.log("updating map with", this.brigades);

            d3.select("#map")
                .select(".brigades")
                .selectAll("circle")
                .data(this.brigades, d => d.name)
                .join(
                    enter =>
                        enter
                            .append("circle")
                            .attr("r", this.brigade_radius)
                            .attr("transform", d => {
                                var p = projection([d.longitude, d.latitude]);
                                if (p) {
                                    return `translate( ${p[0]},${p[1]})`;
                                } else {
                                    console.log("unable to place", d.name, d);
                                    return `translate(-100,-100)`; // Sorry PR!
                                }
                            })
                            .attr("fill", this.brigade_color)
                            .on("mouseover", d => {
                                const div = d3.select("#tooltip");
                                div.transition()
                                    .duration(200)
                                    .style("opacity", 0.9);

                                div.html(this.brigade_html(d))
                                    .style(
                                        "left",
                                        d3.event.pageX + brigade_r + "px"
                                    )
                                    .style(
                                        "top",
                                        d3.event.pageY - brigade_r + "px"
                                    );
                            })
                            .on("mouseout", d => {
                                const div = d3.select("#tooltip");
                                div.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            })
                            .on("click", d => {
                                d3.select("#tooltip").style("opacity", 0);
                                this.$router.push(`/brigade/${d.slug}`);
                                // TODO load Brigade Detail
                            }),
                    update =>
                        update
                            .attr("name", d => d.name)
                            .attr("r", this.brigade_radius)
                            .attr("fill", this.brigade_color)
                );
        },
        filtered_projects(brigade) {
            let projects = brigade.projects;
            if (this.filter_tag) {
                projects = projects.filter(p => {
                    return !(
                        p.topics == undefined ||
                        p.topics.indexOf(this.filter_tag) < 0
                    );
                });
            } else {
                const filtered = projects.filter((project) => {
                    const topics = this.$store.state.filters
                        .filter(f => f.type === 'Topic').map(f => f.value);
                    if (topics.length === 0) { return true; }
                    if (typeof project.topics === 'undefined') { return false; }
                    for (const projectTopic of project.topics) {
                        if (topics.includes(projectTopic)) { return true; }
                    }
                    return false;
                });
            }
            return projects;
       },
       has_projects(brigade){
           return this.filtered_projects(brigade).length == 0;
       },
       brigade_radius(brigade){
           return this.has_projects(brigade) ? 6 : 10;
       },
       brigade_color(brigade){
            if(this.has_projects(brigade)){ return "lightgray" };
            // const p = brigade.tagged / brigade.projects.length;
            // return color3(p);
            return color3(1.0);
       },
       brigade_html(brigade){
            const projects = this.filtered_projects(brigade);
            var html =
                `${brigade.name}` +
                `<br> ${brigade.projects.length} Projects ` +
                (brigade.tagged == null
                    ? ""
                    : `<br> ${brigade.tagged} have topics`);
            if (projects.length < brigade.projects.length) {
                if (this.filter_tag != null) {
                    html += `<br>${projects.length} projects tagged with "${this.filter_tag}"`;
                } else {
                    html += `<br>${projects.length} projects tagged with matching filters`;
                }
            }
            return html;
       },
       get_projection(){
            return d3_composite.geoAlbersUsaTerritories()
                .scale(this.scalingFactor)
                .translate(this.translation);
       }
    }
};
</script>

<style>
#map {
    display: block;
}
.states path {
    fill: #399fd3;
    stroke: #fff;
    stroke-width: 1px;
}

.brigades circle {
    stroke: #e5e5e5;
    stroke-width: 1px;
    cursor: pointer;
    transition: r 200ms, fill 200ms;
}

#tooltip {
    border-radius: 3px;
    position: absolute;
    padding: 8px;
    background-color: white;
    border: solid 1px black;
    min-width: 100px;
    min-height: 100px;
    opacity: 0;
    pointer-events: none;
}
#announce {
    position: absolute;
    width: 50%;
    top: 40%;
    left: 25%;
    margin: auto;
    min-height: 100px;
    background-color: #fedd44;
    border: solid 3px white;
    border-radius: 10px;
    padding: 20px;
    font-size: 32pt;
    opacity: 0;
    display: none;
}
#announce .badge {
    font-size: 100px;
    vertical-align: middle;
}
</style>
