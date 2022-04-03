// Set dataset
var dataset1 = [
    [0,0], [1,1], [12,20], [24,36],
    [32, 50], [40, 70], [50, 100],
    [55, 106], [65, 123], [73, 130],
    [78, 134], [83, 136], [89, 138],
    [100, 140]
];

var dataset2 = [
    [0,0], [13,38], [23,53],
    [32, 50], [43, 70], [55, 100],
    [62, 106], [65, 123], [76, 130],
    [78, 134], [83, 136], [89, 138],
    [100, 190]
];

Promise.all([
    d3.csv('../data/release_year.csv'),
    d3.csv('../data/standup_by_year.csv'),
    d3.csv('../data/shows_release.csv'),
    d3.csv('../data/movies_release.csv'),
]).then(([csv,standupcsv,ratingcsv]) => {
    csv.forEach(function(d) {
        d.count = parseInt(d.count)
        content.push(d)
    })
    standupcsv.forEach(function(d) {
        d.count = parseInt(d.count)
        standup.push(d)
    })
    ratingcsv.forEach(function(d) {
        d.count = parseInt(d.count)
        rating.push(d)
    })


    top10content = content.slice(0,10)
    top10standup = standup.slice(0,10)

    var x = setX(top10content, "country")
    var y = setY(top10content, "country")

    svg.append("g")
            .attr("transform", "translate(0," + barheight + ")")
            .call(d3.axisBottom(x))
            .attr("class", "bottom");

    svg.append("g")
            .attr("class", "left")
            .call(d3.axisLeft(y));
    
    update(top10content, 'red', "country")
});

// set the dimensions and margins of the graph
const lmargin = {top: 50, right: 50, bottom: 20, left: 30};
const lwidth = 560 - lmargin.left - lmargin.right;
const lheight = 500 - lmargin.top - lmargin.bottom;
// append the svg object to the body of the page
var lsvg = d3.select('.linechart')
.append('div')
.append("svg")
.attr("width", lwidth + lmargin.left + lmargin.right)
.attr("height", lheight + lmargin.top + lmargin.bottom)
.append("g")
.attr("transform", "translate(" + lmargin.left + "," + lmargin.top + ")"); // X axis

var xScale = d3.scaleLinear().domain([0, 100]).range([0, lwidth]),
    yScale = d3.scaleLinear().domain([0, 200]).range([lheight, 0]);

lsvg.append("g")
        .attr("transform", "translate(0," + lheight + ")")
        .call(d3.axisBottom(xScale))
        .attr("class", "lbottom");

lsvg.append("g")
        .attr("class", "lleft")
        .call(d3.axisLeft(yScale));

var line = d3.line()
        .x(function(d) { return xScale(d[0]); }) 
        .y(function(d) { return yScale(d[1]); }) 
        .curve(d3.curveMonotoneX)

var u = lsvg.append("path")
        .datum(dataset1) 
        .attr("class", "line")
        .transition()
        .duration(1000)
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "#CC0000")
        .style("stroke-width", "2");

function update(data) {
    var line = d3.line()
        .x(function(d) { return xScale(d[0]); }) 
        .y(function(d) { return yScale(d[1]); }) 
        .curve(d3.curveMonotoneX)

    var u = lsvg.select(".line")
            .datum(data) 
            .attr("class", "line")
            .transition()
            .duration(1000)
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", "#CC0000")
            .style("stroke-width", "2");
}
update(dataset1);