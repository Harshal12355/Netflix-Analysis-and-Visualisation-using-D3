const xSize = 700; const ySize = 900;
const margin = 40;
const xMax = xSize - margin*2;
const yMax = ySize - margin*2;
// Append SVG Object to the Page
var piechart = d3.select("#piechartviz .amount_types")
    .append("svg")
    .attr('width', xSize )
    .attr('height', ySize )
    .append("g")
    .attr("transform","translate(" + xSize/2 + "," + ySize/2 + ")");
const radius = Math.min(xSize, ySize) / 2;
var color = d3.scaleOrdinal(['purple','blue']);
var color = d3.scaleOrdinal().range(d3.schemeSet2);

// Generate the pie
var pie = d3.pie();
// Generate the arcs
var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

type=[]
count=[]
genre=[]
genrecount = []

Promise.all([
    d3.csv("amount_types.csv"),
    d3.csv('top10genres.csv'),
]).then(([data, genres]) => {
    for (i in data) {
        type.push(data[i].type)
        count.push(data[i].count)
    }
    type.pop()
    count.pop()
    console.log(type)
    console.log(count)
    for (i in genres) {
        genre.push(genres[i].genre)
        genrecount.push(genres[i].count)
    }
    genre.pop()
    genrecount.pop()
    console.log(genre)
    console.log(genrecount)

    update(type, count)
})

console.log(type)

function update(type, count){
    //Generate groups
    var arcs = piechart.selectAll("arc")
        .data(pie(count))
        .enter()
        .append("g")
        .attr("class", "arc")
        .text(function(d, i){
            console.log(i)
            return d.data;
        });
    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
        return color(d.data);
        })
        .attr("d", arc)
        .attr("stroke", "black")
        .attr("stroke-width", "3px")
        .transition()
        .duration(1000)
        .attrTween("d", function (d) {
            var i = d3.interpolate(d.endAngle, d.startAngle);
            return function (t) {
                d.startAngle = i(t);
                return arc(d);
            }
        });

    arcs.append("text")
        .attr("transform", function(d) { 
            return "translate("+ arc.centroid(d)+")"; 
        }) // arc.centroid function used in order to compute the center of the arc})
        .attr("fill", "white")
        .text(function(d, i){
            console.log(type)
            return type[i];
        });
    
}