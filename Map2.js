
var svg = d3.select("#content g.map")
let projection = d3.geoMercator().scale(400).translate([200, 280]).center([0, 5]);
let geoGenerator = d3.geoPath().projection(projection);
const radiusScale = d3.scaleSqrt();

// colour schemes to use 
var color = d3.scaleOrdinal().range(d3.schemeSet2);
var pop_clr = d3.scaleSequential().domain([1, 100000000]).interpolator(d3.interpolateRdBu);
var gdp_clr = d3.scaleSequential().domain([1, 15000]).interpolator(d3.interpolateRdBu);
var content_clr = d3.scaleSequential().domain([1, 200]).interpolator(d3.interpolateRdBu);
var standup_clr = d3.scaleSequential().domain([1, 10]).interpolator(d3.interpolateRdBu);

const sizeScale = d3.scaleSqrt();

// Mouseover function
function handleMouseover(e, d) {
    d3.select('#content .info').text("Country: " + d.properties.name)
        .style('fontsize', '56px')
        .style('color', 'white');
    
    d3.select('#content .economy')
        .text("Economic Status: " + d.properties['economy'])
        .style('color', 'white');
    
    d3.select('#content .pop')
        .text("Estimated population of the region: " + d.properties['pop_est'])
        .style('color', 'white');
    
    d3.select('#content .content')
        .text("Amount of content: " + d.properties['content_count'])
        .style('color', 'white');
    
    d3.select('#content .standup')
        .text("Amount of standup content: " + d.properties['standup_count'])
        .style('color', 'white');


    d3.select(this)
    .style('fill', 'red');
}

//function for when you click 
function clickedFunction(e, d) {
    console.log("clicked on: " + d.properties.name);
    d3.select('graphs').append("title").text("Hello darkness my old friend").attr("color", "white");
}

//load data
Promise.all([
    d3.csv('countries.csv'),
    d3.json('custom.geo.json'),
    d3.csv('standup_by_country.csv'),
]).then(([csv, json, standupcsv]) => {
    //for the csv
    const rowbyLocation = {};
    csv.forEach(d => { 
        d.content_count = parseInt(d.count);
        rowbyLocation[d.country] = d; 
    })
    console.log(rowbyLocation)
    
    const srowbyLocation = {};
    standupcsv.forEach(d => { 
        d.standup_count = parseInt(d.count);
        srowbyLocation[d.country] = d; 
    })

    countries = json
    
    // //we are joining the data from the csv into countries
    countries.features.forEach(d => {
        Object.assign(d.properties, rowbyLocation[d.properties.brk_name]);
    });

    countries.features.forEach(d=> {
        Object.assign(d.properties, srowbyLocation[d.properties.brk_name]);
    })

    console.log(countries.features)

    countries.features = countries.features.map(d => {
        d.properties['projection'] = projection(d3.geoCentroid(d));
        return d;
    }); 

    console.log(countries.features)

    update('content_count');
});

// function grouping(property){
//     var group = d3.group(
//         countries.features,
//         d => d.properties[property],
//     );
//     return group;
// }

function update(property) {
    console.log(property)
    var clr = color;
    var strokeclr = 'white';

    if (property == 'economy') {
        var clr = color;
        strokeclr = 'black';
    } else if (property == 'standup_count') {
        var clr = standup_clr;
    } else if (property == 'pop_est') {
        var clr = pop_clr;
    } else if (property == 'content_count') {
        var clr = content_clr;
    }

    console.log(strokeclr)

    const radiusVal = d => d.properties[property];
    const radiusScale = d3.scaleSqrt()
        .domain(d3.extent(countries.features, radiusVal))
        .range([0, 20]);

    countries.features.forEach(d => {
        d.properties['radius'] = radiusScale(radiusVal(d));
    });

    var map = svg.selectAll('path').data(countries.features)
    
    map
        .join(
            enter => {enter.append('path')
                .attr('class', 'country')
                .attr('d', geoGenerator)
                .style('fill', function(d) {
                    console.log(d.properties[property])
                    return clr(d.properties[property]);
                })
                .style("stroke", strokeclr)
                .on('mouseover', handleMouseover)
                .on('mouseout', function(d) {
                    d3.select(this)
                        .style('fill', function(d) {
                            return clr(d.properties[property]);
                        });
                })
                .on('click', clickedFunction)
                .append('title')
                .text(d => d.properties.name); 
                
                enter.selectAll('circle').data(countries.features)
                    .enter()
                    .append('circle')
                    .style('fill', function(d) {return 'white';})
                    .attr('class', 'country-circle')
                    .attr('cx', function(d) {
                        return d.properties.projection[0];
                    })
                    .attr('cy', function(d) {
                        return d.properties.projection[1];
                    })
                    .attr('r', d => d.properties['radius']);
            },
            update => { 
                update.attr('class', 'country')
                .attr('d', geoGenerator)
                .style('fill', function(d) {
                    console.log(d.properties[property])
                    return clr(d.properties[property]);
                })
                .on('mouseover', handleMouseover)
                .on('mouseout', function(d) {
                    d3.select(this)
                        .style('fill', function(d) {
                            return clr(d.properties[property]);
                        });
                })
                .on('click', clickedFunction)
                .append('title')
                .text(d => d.properties.name); 

                update.selectAll('circle').data(countries.features)
                    .enter()
                    .append('circle')
                    .attr('class', 'country-circle')
                    .style('fill', function(d) {return color(d.properties[property]);})
                    .attr('cx', function(d) {
                        // console.log("enter running.....")
                        return d.properties.projection[0];
                    })
                    .attr('cy', function(d) {
                        return d.properties.projection[1];
                    })
                    .attr('r',10);
        },
            exit => exit.remove()
        )

}


var zoom = d3.zoom()
    .scaleExtent([-10, 20])
    .on('zoom', function (event) {
        svg.selectAll('path')
            .attr('transform', event.transform);
        svg.selectAll('circle')
            .attr('transform', event.transform);
    });
svg.call(zoom);