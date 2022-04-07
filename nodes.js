// set the dimensions and margins of the graph
const width = 1000
const height = 1000

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
.append("svg")
    .attr("width", width)
    .attr("height", height)

content = []
standup = []
rating = []
data = []
Promise.all([
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/11_SevCatOneNumNestedOneObsPerGroup.csv"),
    d3.csv('countries.csv'),
    d3.csv('standup_by_country.csv'),
    d3.csv('ratingstypes.csv'),
    d3.csv("longest_duration_nodes.csv"),
]).then(([data,csv,standupcsv,ratingcsv, longest]) => {
    csv.forEach(function(d) {
        d['value'] = parseInt(d.count)
        content.push(d)
    })
    standupcsv.forEach(function(d) {
        d['value'] = parseInt(d.count)
        standup.push(d)
    })
    ratingcsv.forEach(function(d) {
        d['value'] = parseInt(d.count)
        rating.push(d)
    })
    data.forEach(d => {
        d['value'] = parseInt(d.value)
    });
    longest.forEach(d => {
        d['value'] = parseInt(d.duration)
    });
    console.log(data)
    console.log(csv)
    console.log(standupcsv)
    console.log(ratingcsv)
    console.log(longest)
    // update(data,'region')
    // update(standup,'country')
    // update(content,'country')
    // update(rating,'rating')
    update(longest,'title')
    
    
});

function update(data,variable) {

    // Color palette
    const color = d3.scaleOrdinal().range(d3.schemeSet1);
    // Size scale for countries
    function setSize(data){
        const size = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([7,30])  // circle will be between 7 and 55 px wide
        
        return size
    }
    
    const size = setSize(data);

    // create a tooltip
    const Tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        // .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "2px")
        .style("margin-right", "400px")
        .style("margin-left", "400px")
        .style('color', 'white')
       
    
    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function(event, d) {
        Tooltip
        .style("opacity", 1)
    }

    const mousemove = function(event, d) {
        Tooltip
        .html('<u>' + d[variable] + '</u>' + "<br>" + d.value)
        .style("left", (event.x/2+20) + "px")
        .style("top", (event.y/2-30) + "px")
    }
    var mouseleave = function(event, d) {
        Tooltip
        .style("opacity", 0)
    }
    
    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", "node")
        .attr("r", d => size(d.value))
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", d => color(d[variable]))
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .call(d3.drag() // call specific function when circle is dragged
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    
    // Features of the forces applied to the nodes:
    const simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.value)+3) }).iterations(1)) // Force that avoids circle overlapping
    
    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
        });
    
    // What happens when a circle is dragged?
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    }

}