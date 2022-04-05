// set the dimensions and margins of the graph
const barmargin = {top: 60, right: 30, bottom: 70, left: 60}; 
const barwidth = 700 - barmargin.left - barmargin.right;
const barheight = 600 - barmargin.top - barmargin.bottom;

    // append the svg object to the body of the page 
var svg = d3.select(".barchart")
    .append("div") 
    .append("svg")
    .attr("width", barwidth + barmargin.left + barmargin.right)
    .attr("height", barheight + barmargin.top + barmargin.bottom) 
    .append("g")
    .attr("transform","translate(" + barmargin.left + "," + barmargin.top + ")");

content = []
standup = []
rating = []
        //load data
Promise.all([
    d3.csv('countries.csv'),
    d3.csv('standup_by_country.csv'),
    d3.csv('ratingstypes.csv'),
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

function setX(data, group){
    var x = d3.scaleBand()
        .range([ 0, barwidth ])
        .domain(data.map(function(d) { return d[group]; }))
        .padding(0.2);
        return x;
}
    
function setY(data){
    var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.count; })])
    .range([ barheight, 0]);
    return y;
}

function update(data, colour, group) {
    s = setX(data, group);
    z = setY(data);

    // console.log(data)
    
    svg.select(".bottom")
            .attr("transform", "translate(0," + barheight + ")")
            .attr("color", "white")
            .call(d3.axisBottom(s));

    svg.select(".left")
    .attr("color", "white")
            .call(d3.axisLeft(z));

    var u = svg.selectAll("rect")
        .data(data);
    u 
        .enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(1000)
        .attr("x", function(d) { 
            console.log("drawn")
            return s(d[group]); 
        })
        .attr("y", function(d) { 
            return z(d.count); 
        })
        .attr("width", s.bandwidth())
        .attr("height", function(d) { return barheight - z(d.count); })
        .attr("fill", colour);
    
        u.exit().remove();
        
}