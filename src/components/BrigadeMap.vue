<template>
    <div>
        <div id="tooltip"></div>
        <svg id="map"></svg>
    </div>
</template>

<script>
import _ from 'lodash';
import usa_topojson from 'us-atlas/states-albers-10m.json';
import * as d3 from 'd3';
import * as topojson from 'topojson';

export default {
   data() {
       return {
           svg: null,
       };
   },
   computed: {
       brigades(){
           return this.$store.getters.brigades;
       },
   },
   watch: {
        brigades: function(newVal, oldVal) {
            this.updateMap();
               // TODO update map
        }
   },
   mounted(){
       this.createMap();
       this.updateMap();
   },
   methods: {
       createMap(){
            const svg = d3.select("#map")
              .attr("viewBox",[[0,0],[960,700]]); 
            const path = d3.geoPath();

            console.log("making map of ",usa_topojson,svg)
            svg.append("g")
                  .attr("class", "states")
                .selectAll("path")
                .data(topojson.feature(usa_topojson, usa_topojson.objects.states).features)
                .enter().append("path")
                  .attr("d", path)
                  .attr("name", d=> d.name);
              svg.append("g").attr("class","brigades");
       },
       updateMap(){
            const projection = d3.geoAlbersUsa().scale(1280).translate([480, 300])
            const brigade_r = 10;
            console.log("updating map with",this.brigades);

            d3.select("#map").select(".brigades")
                .selectAll("circle") 
                .data(this.brigades, d => d.name )
                .join(
                    enter => enter.append("circle")
                        .attr("r",brigade_r)
                        .attr("transform", d => { 
                            var p = projection(
                                [d.longitude,d.latitude]
                            ); 
                            if(p){
                                return `translate( ${p[0]},${p[1]})`;
                            }else{
                                console.log("unable to place",d.name,d)
                                return `translate(-100,-100)`; // Sorry PR!
                            }
                        } )
                        .attr("fill", d => {
                            if(d.tagged == null){ return "lightgray" };

                            const p = d.tagged / d.projects.length;
                            if(p > 0.9){
                                return "palegreen";
                            }else if(p > 0.5 ){
                                return "lightblue";
                            }else if(p > 0.25){
                                return "purple";
                            }else{
                                return "paleturquoise";
                            }
                        })
                        .on("mouseover", d => {
                            const div = d3.select("#tooltip")
                            div.transition().duration(200).style('opacity',.9);

                            div	.html(
                                `${d.name}` 
                                + `<br> ${d.projects.length } Projects ` 
                                + ((d.tagged==null)?"":`<br> ${d.tagged} have topics`)
                                ).style("left", (d3.event.pageX + brigade_r) + "px")		
                                .style("top", (d3.event.pageY - brigade_r) + "px");	
                        })			
                        .on("mouseout", d => {
                            const div = d3.select("#tooltip")
                            div.transition().duration(500).style('opacity',0);
                        })
                        .on("click", d => {
                            d3.select("#tooltip").style("opacity",0);
                            // TODO load Brigade Detail  
                        }),
                    update => update.attr("name",d => d.name)
                        .attr("fill", d => {
                            const p = d.tagged / d.projects.length;
                            if(p > 0.9){
                                return "palegreen";
                            }else if(p > 0.5 ){
                                return "lightblue";
                            }else if(p > 0.25){
                                return "purple";
                            }else{
                                return "paleturquoise";
                            }
                        }),
                )
       },
   }
}
</script>

<style>
#map {
    width: 75%;
    display: block;
    margin: 100px auto;
}
.states path {
    fill:#e5e5e5 ;
    stroke: #444;
    stroke-width: 1px;
}

.brigades circle {
    stroke: #444444;
    stroke-width: 1px;
    cursor: pointer;
}

#tooltip {
    position: absolute;
    padding: 8px;
    background-color: white;
    border: solid 1px black;
    min-width: 100px;
    min-height: 100px;
    opacity: 0;
    pointer-events: none;
}

</style>