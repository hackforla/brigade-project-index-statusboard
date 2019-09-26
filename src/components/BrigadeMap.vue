<template>
    <svg id="map"></svg>
</template>

<script>
import _ from 'lodash';
import usa_topojson from 'us-atlas/states-albers-10m.json';
import * as d3 from 'd3';
import * as topojson from 'topojson';

export default {
   data() {
       return {
       };
   },
   computed: {
       brigades(){
           return this.$store.getters.brigades;
       },
   },
   watch: {
        brigades: function(newVal, oldVal) {
               // TODO update map
        }
   },
   mounted(){
       this.createMap();
   },
   methods: {
       createMap(){
           console.log("creating map from ",usa_topojson);

            const svg = d3.select("#map")
              .attr("viewBox",[[0,0],[960,600]]); 
            const projection = d3.geoAlbersUsa().scale(1280).translate([480, 300])

            const path = d3.geoPath();

            const brigade_r = 10;
            const brigade_arc = d3.arc()
                        .innerRadius(brigade_r - 3)
                        .outerRadius(brigade_r);    
            const pie = d3.pie().value(d => 50);

            function make_map(us) {
                console.log("making map of ",us,svg)
              svg.append("g")
                  .attr("class", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                  .attr("d", path)
                  .attr("name", d=> d.name);
            };            

            function load_brigades(brigades){
                svg.append("g")
                        .attr("class","brigades")
                    .selectAll("circle") 
                        .data(pie(brigades))
                    .enter().append("g")
                        .attr("transform", function(d){ 
                            var p = projection(
                                [d.data.longitude,d.data.latitude]
                            ); 
                            if(p){
                                return `translate( ${p[0]},${p[1]})`;
                            }else{
                                console.log("unable to place",d.data.name,d.data)
                            }
                        } )
                        .attr("name",d => d.data.name)
                        .each(function(){
                            var _this = d3.select(this);
                            _this.append("circle")
                                .attr("r",`${brigade_r}px`);
                            _this.append("path")
                                .attr("d" , brigade_arc)
                                .attr("fill", function(d){
                                    return "green";
                                    if(d.data.properties.score > 90){
                                        return "green";
                                    }else if(d.data.properties.score > 50 ){
                                        return "yellow";
                                    }else if(d.data.properties.score > 25){
                                        return "orange";
                                    }else{
                                        return "red";
                                    }
                                })
                        })
            };

            make_map(usa_topojson);
            //load_brigades(this.brigades);

       },
   }
}
</script>

<style>
#map {
    width: 90%;
    margin: 5%;
}
.states path {
    fill:#e5e5e5 ;
    stroke: #444;
    stroke-width: 1px;
}

.brigades circle {
    fill: white;
    /* #999595 */
    stroke: #444444;
    stroke-width: 2px;
}
</style>