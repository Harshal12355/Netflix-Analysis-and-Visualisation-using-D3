// Set Dimensions
const xSize = 700; const ySize = 600;
const margin = 50;
const xMax = xSize - margin*2;
const yMax = ySize - margin*2;

// Get the 'limits' of the data - the full extent (mins and max)
// so the plotted data fits perfectly
function lineGraph(data, data2, data3, data4) {
    console.log(data2)
    // var xExtent = d3.extent( data, d=>{ return d.x } );
    // // var yExtent = d3.extent( data, d=>{ console.log(d) 
    // //     return d.y } );
    // // console.log(yExtent)
    // // console.log(yExtent.reverse())
    // yMaxVal = d3.max(data, d=>{ 
    //     console.log(d)
    //     return d.y 
    // });
    // ymax = parseInt(yMaxVal);
    // console.log(ymax+200)
    yExtent = [1000, 0];
    // Append SVG Object to the Page
    const svg = d3.select(".linechart")
        .append("svg")
        .attr('width', xSize )
        .attr('height', ySize )
        .append("g")
        .attr("transform","translate(" + margin + "," + margin + ")");
    
    function setX(data, group){
        var x = d3.scaleBand()
            .range([ 0, xMax ])
            .domain(data.map(function(d) { return d[group]; }))
            .padding(0.2);
            return x;
    }
        
    function setY(data){
        var y = d3.scaleLinear()
        .domain([yExtent[1], yExtent[0]])
        .range([ yMax, 0]);
        return y;
    }
    
    // X Axis
    const x = setX(data, 'x');

    // bottom
    svg.append("g")
        .attr("transform", "translate(0," + yMax + ")")
        .call(d3.axisBottom(x))
        .attr('color', 'white'); // make bottom axis green

    // Y Axis
    const y = setY(data)

    // left y axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .attr('color', 'white');


    // Add the line for general releases
    var u1 = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { 
            console.log("general: " + d.x)
            return x(d.x) 
        })
        .y(function(d) {
            console.log(d.y)
            return y(d.y) 
        }));
    
    // Adding the line for standup
    var u2 = svg.append("path")
        .datum(data2)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { 
            console.log("standup: " + d.x)
            return x(d.x) 
        })
        .y(function(d) {
            console.log(d.y)
            return y(d.y) 
        }));

    // Adding the line for shows
    var u3 = svg.append("path")
        .datum(data3)
        .attr("fill", "none")
        .attr("stroke", "orange")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { 
            console.log("shows " + d.x)
            return x(d.x) 
        })
        .y(function(d) {
            console.log(d.y)
            return y(d.y) 
        }));
    
    // Adding the line for movies
    var u4 = svg.append("path")
        .datum(data4)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { 
            console.log("movies: " + d.x)
            return x(d.x) 
        })
        .y(function(d) {
            console.log(d.y)
            return y(d.y) 
        }));
}
// releases = [];
// d3.csv('release_year.csv', function(data) {
//         releases.push({x: data.year, y: data.count});
//     }).then(() => {
//         lineGraph(releases);
//     });

release = [] 
standup = []
shows = []
movies = []
Promise.all([
    d3.csv('release_year.csv'),
    d3.csv('standup_by_year.csv'),
    d3.csv('shows_release.csv'),
    d3.csv('movies_release.csv'),
]).then(([releasecsv, standupcsv, showscsv, moviescsv]) => {
    releasecsv.forEach(function(d) {
        d.count = parseInt(d.count)
        release.push({x: d.year, y: d.count});
    })
    standupcsv.forEach(function(d) {
        d.count = parseInt(d.count)
        standup.push({x: d.year, y: d.count});
    })
    showscsv.forEach(function(d) {
        d.count = parseInt(d.count)
        shows.push({x: d.year, y: d.count});
    })
    moviescsv.forEach(function(d) {
        d.count = parseInt(d.count)
        movies.push({x: d.year, y: d.count});
    })
    // console.log(release)
    // console.log(standup)
    // console.log(shows)
    // console.log(movies)
    // console.log(shows)
    lineGraph(release, shows, standup, movies);
});