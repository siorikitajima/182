const margin = { top: 0, right: 0, bottom: 30, left: 0 };
const innerWidth = width;
const innerHeight = height - margin.top - margin.bottom;
var portrait = innerHeight > innerWidth ? true : false;

//// Create SVG (infoWrapper)
const svg = d3.selectAll(".wrapper")
    .append("svg")
    .attr("width", portrait ? width *4 : width*2)
    .attr("height", height)
    .attr("class", "infoWrapper");

//////// Events /////////
const renderEv = datasetEv => {
  const eventLength = datasetEv.length;
    const xValueEv = de => de.date;
    var formatting = d3.timeFormat("%B %d %Y");
    // Axis
    const xScaleEv = d3.scaleTime()
      // .domain(d3.extent(datasetEv, xValueEv))
      .domain([new Date("2016-01-07"), new Date("2020-12-31")])
      .range(portrait? [0, innerWidth *4]:[0, innerWidth*2])
      .nice();
  
    const gEv = d3.selectAll(".infoWrapper").append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    //// X axis for Events preserved for testing ///
    // const xAxisEv = d3.axisBottom(xScaleEv)
    //   .tickSize(-innerHeight)
    //   .tickPadding(15);
    // const xAxisGEv = gEv.append('g').call(xAxisEv)
    //   .attr("class", "x axis")
    //   .attr('transform', `translate(0,${innerHeight})`);
    // xAxisGEv.select('.domain').remove();
    
    // Define the div for the tooltip
    var viewerEv = d3.select("body").append("div")
    .attr("class", "viewerEv")
    .style("height", 0)
    .style("opacity", 0);

    var divEv = d3.select("body").insert("div")	
        .attr("class", "tooltipEv")				
        .style("opacity", 0);

    var prevEv = d3.selectAll(".viewerEv").insert("div")
        .attr("class", "leftArrow")
        .insert("div")
        .attr("class", "prevEv");
    d3.selectAll(".viewerEv").insert("div")
        .attr("class", "viewerLeft");
    d3.selectAll(".viewerEv").insert("div")
        .attr("class", "viewerRight");
    var nextEv = d3.selectAll(".viewerEv").insert("div")
        .attr("class", "rightArrow")
        .insert("div")
        .attr("class", "nextEv");
    d3.selectAll(".rightArrow").insert("div")
        .attr("class", "closeEv")
        .on("click", closeViewer);

    // Draw Events  
        const daysize = innerWidth / 1826; // devided by total days from 1/1/2016 - 12/31/2020
        console.log(daysize);
        const wValue = de => de.duration < 5 ? 5 + 'px' : de.duration * daysize + 'px';
        var evMonth, evYear, evDay;
        gEv.append("g")
        .selectAll("rect")
        .data(datasetEv)
        .enter()
        .append("rect")
        .attr('class', 'events')
        .attr('x', de => xScaleEv(xValueEv(de)))
        .attr('y', 0)
        .attr('stroke', 'none')
        .attr('fill', 'rgb(100, 40, 40)') // Event Color
        .attr('width', wValue)
        .attr('height', '0%')        
        .style('opacity', 0)        
        .on("mouseover", function(de) {	
            // d3.select(this).style("opacity", 1);
          var currentDate = formatting(de.date);

            // evMonth = de.date.getMonth() + 1;
            // evYear = de.date.getYear() - 100;
            // evDay = de.date.getDay() + 1;
          divEv.transition()		
                .duration(200)		
                .style("opacity", 0.7);		
            // divEv.html(evMonth + '/' + evDay + '/' + evYear + '<br/>' + de.name)	
          divEv.html(currentDate + '<br/>' + de.name)	
                .style("top", (d3.event.pageY - 28) + "px")
                .style("left", 0);	
            })
        .on("mousemove", function(de) {
            divEv.style("top", (d3.event.pageY - 28) + "px");	
        })			
        .on("mouseout", function(de) {
            // d3.select(this).style("opacity", 0.8);		
            divEv.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
        .on("click", function(de){
            d3.select(this).style("opacity", 1);
            showViewer(de);
        })
        .transition()
            .duration(300)
            .ease(d3.easeSinOut)
            .attr('height', '100%') 
            .style('opacity', 0.4)
            .delay(function(de,i){return(5000 + i* 50 * Math.random())})
            .transition()
                .style('opacity', 0.8)
                .delay(function(de,i){return(i*10)});
        
    function showViewer(de) {
      var currentDate = formatting(de.date);
      const themedia = function() {
        if(de.media == "img") {
          const theurl = de.mediaurl;
          return ("<img src='../images/events/"+ theurl + "'/>")
        } else {
          return ("<img src='../images/image-placeholder.jpg'/>")
        }
      }
      const viewerLeftHtml = "<p>" + currentDate + '<br/><b>' + de.name + '</b></p>' + "<p>" + de.note + "</p>";
      d3.selectAll(".viewerLeft").html(viewerLeftHtml).attr("num", de.num);
      d3.selectAll(".viewerRight").html(themedia);
        viewerEv.style("height", "auto")
            .style("opacity", 0.7);
            // .append(viewerHtml);
        divEv.transition()		
            .duration(500)		
            .style("opacity", 0);
        nextEv.on("click", nextViewer);
        prevEv.on("click", prevViewer);

        const theID = d3.selectAll(".viewerLeft").attr("num");
        d3.selectAll(".events").style("mix-blend-mode","soft-light");
        d3.select(".events:nth-of-type("+ (+theID+1) + ")").style("mix-blend-mode","exclusion");
    };
    function nextViewer() {
      const theID = d3.selectAll(".viewerLeft").attr("num");
      const nextID = +theID < datasetEv.length-1 ? +theID +1 : 0;
      console.log(nextID);
      var nextDate = formatting(datasetEv[nextID].date);
      d3.select(".events:nth-of-type("+ (+nextID+1) + ")").style("mix-blend-mode","exclusion");
      d3.select(".events:nth-of-type("+ (+theID+1) + ")").style("mix-blend-mode","soft-light");


      const themedia = function() {
      if(datasetEv[nextID].media == "img") {
          const theurl = datasetEv[nextID].mediaurl;
          return ("<img src='../images/events/"+ theurl + "'/>")
        } else {
          return ("<img src='../images/image-placeholder.jpg'/>")
        }
      }
      const viewerLeftHtml = "<p>" + nextDate + '<br/><b>' + datasetEv[nextID].name + '</b></p>' + "<p>" + datasetEv[nextID].note + "</p>";
      d3.selectAll(".viewerLeft").html(viewerLeftHtml);
      d3.selectAll(".viewerRight").html(themedia);  
      d3.selectAll(".viewerLeft").attr("num", datasetEv[nextID].num);
    };
    function prevViewer() {
      const theID = d3.selectAll(".viewerLeft").attr("num");
      const prevID = +theID > 0 ? +theID -1 : datasetEv.length-1;
      console.log(prevID);
      var nextDate = formatting(datasetEv[prevID].date);
      d3.select(".events:nth-of-type("+ (+prevID+1) + ")").style("mix-blend-mode","exclusion");
      d3.select(".events:nth-of-type("+ (+theID+1) + ")").style("mix-blend-mode","soft-light");

      const themedia = function() {
      if(datasetEv[prevID].media == "img") {
          const theurl = datasetEv[prevID].mediaurl;
          return ("<img src='../images/events/"+ theurl + "'/>")
        } else {
          return ("<img src='../images/image-placeholder.jpg'/>")
        }
      }
      const viewerLeftHtml = "<p>" + nextDate + '<br/><b>' + datasetEv[prevID].name + '</b></p>' + "<p>" + datasetEv[prevID].note + "</p>";
      d3.selectAll(".viewerLeft").html(viewerLeftHtml);
      d3.selectAll(".viewerRight").html(themedia);  
      d3.selectAll(".viewerLeft").attr("num", datasetEv[prevID].num);
    };    
    function closeViewer() {
        viewerEv.style("height", 0)
            .style("opacity", 0);
        d3.selectAll(".events")
            .style("opacity", 0.9)
            .style("mix-blend-mode","soft-light");
    };
};

/////// Violence line charts ///////
const render = data => {
    const xValue = d => d.timestamp;
    const yValue = d => d.people;
    const colorValue = d => d.category;
    // Axis
    const xScale = d3.scaleTime()
        // .domain(d3.extent(data, xValue))
        .domain([new Date("2016-01-07"), new Date("2020-12-31")])
        .range(portrait? [0, innerWidth *4]:[0, innerWidth*2])
        .nice();
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 100])
        .nice();
    const g = d3.selectAll(".infoWrapper").append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(15);  
    const xAxisG = g.append('g').call(xAxis)
        .attr("class", "x axis")
        .attr('transform', `translate(0,${innerHeight})`);
    xAxisG.select('.domain').remove();

    // Draw Lines and Area paths
    const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveBasis);
    const areaGenerator = d3.area()
        .curve(d3.curveBasis)
        .x(d => xScale(xValue(d)))
        .y0(yScale(0))
        .y1(d => yScale(yValue(d)));
    const areaGeneratorBefore = d3.area()
        .curve(d3.curveBasis)
        .x(d => xScale(xValue(d)))
        .y0(yScale(0))
        .y1(d => yScale(yValue(d)*0));    
    
    const lastYValue = d =>
        yValue(d.values[d.values.length - 1]);
    
    const nested = d3.nest()
        .key(colorValue)
        .entries(data)
        .sort((a, b) =>
        d3.descending(lastYValue(a), lastYValue(b))
        );
  
    // Gradient color for Area path
    const gradient = g.append("linearGradient")
        .attr("id", "svgGradient")
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "100%");
        gradient.append("stop")
        .attr('class', 'start')
        .attr("offset", "10%")
        .attr("stop-color", "#BBB") // Light
        .attr("stop-opacity", 1);
        gradient.append("stop")
        .attr('class', 'end')
        .attr("offset", "50%")
        .attr("stop-color", "#BBB")
        .attr("stop-opacity", 0.8);
    const gradientTall = g.append("linearGradient")
        .attr("id", "svgGradientTall")
        .attr("x1", "0%")
        .attr("x2", "0%")
        .attr("y1", "0%")
        .attr("y2", "100%");
        gradientTall.append("stop")
        .attr('class', 'start')
        .attr("offset", "40%")
        .attr("stop-color", "#000") // Dark
        .attr("stop-opacity", 1);
        gradientTall.append("stop")
        .attr('class', 'end')
        .attr("offset", "80%")
        .attr("stop-color", "#222")
        .attr("stop-opacity", 0);
    const colorScale = d3.scaleOrdinal()
        .range(['url(#svgGradientTall)', 'url(#svgGradient)', 'url(#svgGradient)']);
        colorScale.domain(nested.map(d => d.key));

    // Line Paths
    g.selectAll('.line-path').data(nested)
    .enter().append('path')
    .attr('class', 'line-path')
    .attr('d', d => lineGenerator(d.values))
    .attr('stroke', 'none')
    .attr('fill', 'none');

    // Area Paths
    g.selectAll('.area-path').data(nested)
    .enter().append('path')
        .attr('class', 'area-path')
        .attr('d', d => areaGeneratorBefore(d.values))
        .attr('stroke', 'none')
        .attr('fill', d => colorScale(d.key))
        .style('opacity', 0)
        .on('mousemove', updateTooltips)
        .on('mouseover', showTooltips)
        .on('mouseout', hideTooltips)
        .transition()
          .style('opacity', 0.6)
          .attr('d', d => areaGenerator(d.values))
          .duration(1500)
          .delay(function(de,i){return(200+ i*2000)})
          .ease(d3.easeSinOut)
        ;

    // Opening Legends
var gunBox = d3.selectAll(".wrapper").append("div")
    .attr('class', 'gunBox')
    .style('opacity', 0)
    .transition()
        .duration(1000)
        .delay(1000)
        .style('opacity', 1);
var crimeBox =  d3.selectAll(".wrapper").append("div")
      .attr('class', 'crimeBox')
      .style('opacity', 0)
      .transition()
          .duration(1000)
          .delay(3000)
          .style('opacity', 1);

    /////// Mouse over effect ///////
    var mouseG = g.append("g")
      .attr("class", "mouse-over-effects");
    mouseG.append("path")
      .attr("class", "mouse-line")
      .style("stroke", "#ddd")
      .style("opacity", "0");
    var lines = document.getElementsByClassName('line-path');
    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(nested)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");
    mousePerLine.append("circle")
      .attr("r", 20)
      .style("fill", "#ddd")
      .style("stroke", "none")
      .style("opacity", "0")
            .append("image")
        .attr("src", function(d) {
          if ( d.key == "Gun") {
              return "../images/gun-icon.svg";
          }
          else if (d.key == "Homicide") {
              return "../images/crime-icon.svg"
          }});
    mousePerLine.append("text")
      .attr("transform", "translate(25,3)")
      .attr("class", "textTT")
      .style("fill", "#ddd")
      .style("opacity", "0");

    function hideTooltips() {
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      };
    function showTooltips() {
        d3.select(".mouse-line")
        .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
            .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
            .style("opacity", "1");
      }
    function updateTooltips() {
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });
        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            var xDate = xScale.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.timestamp; }).left;
                idx = bisect(d.values, xDate);            
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;
            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
              }
            d3.select(this).select('text')
              .text(yScale.invert(pos.y).toFixed(0))
              .attr("font-size", "14px");
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      }
};

//////// Rendering with Data /////////

d3.csv('../csv/events-all.csv')
.then(datasetEv => {
  datasetEv.forEach(de => {
    de.duration = +de.duration;
    de.name = de.name;
    de.note = de.note;
    de.media = de.media;
    de.num = +de.num;
    de.mediaurl = de.mediaurl;
    de.date = new Date(de.date);
  });
  renderEv(datasetEv);
});

d3.csv('../csv/information-violence.csv')
.then(dataset => {
  dataset.forEach(d => {
    d.people = +d.people;
    d.timestamp = new Date(d.timestamp);
  });
  render(dataset);
});


// d3.transition()
//     .delay(5000)
//     .duration(7500)
//     .tween("scroll", scrollTween(document.body.getBoundingClientRect().width - window.innerWidth *2));

// function scrollTween(offset) {
//   return function() {
//     var i = d3.interpolateNumber(window.pageXOffset || d3.svg.scrollLeft, offset);
//     return function(t) { scrollTo(0, i(t)); };
//   };
// }


