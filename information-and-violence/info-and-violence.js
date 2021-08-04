const margin = { top: 0, right: 0, bottom: 30, left: 0 };
const innerWidth = width;
const innerHeight = height - margin.top - margin.bottom;
var portrait = innerHeight > innerWidth ? true : false;

const svg = d3.selectAll(".wrapper")
    .append("svg")
    .attr("width", portrait ? width *4 : width*2)
    .attr("height", height)
    .attr("class", "infoWrapper");

////////////////////////////////////
////////////// Events //////////////
////////////////////////////////////
const renderEv = datasetEv => {
const eventLength = datasetEv.length;
const xValueEv = de => de.date;
var formatting = d3.timeFormat("%B %d %Y");
  
  // Axis
    const xScaleEv = d3.scaleTime()
      // .domain(d3.extent(datasetEv, xValueEv))
      .domain([new Date("2016-01-07"), new Date("2021-01-31")])
      .range(portrait? [0, innerWidth *4]:[0, innerWidth*2]);
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
    
    ////////////////////////////////////
    /////////// Event Tooltip //////////
    ////////////////////////////////////
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

    ////////////////////////////////////
    /////////// Draw Events /////////////
    //////////////////////////////////// 
        const thechartWidth = portrait? innerWidth *4:innerWidth*2;
        const daysize = thechartWidth / 1840; // total days from 1/1/2016 - 1/20/2021
        const wValue = de => de.duration < 5 ? 5 + 'px' : de.duration * daysize + 'px';
        gEv.append("g")
        .selectAll("rect")
        .data(datasetEv)
        .enter()
        .append("rect")
        .attr('class', 'events')
        .attr('x', de => xScaleEv(xValueEv(de)))
        .attr('y', 0)
        .attr('stroke', 'none')
        //.attr('fill', 'rgb(160, 40, 40)') // Event Color
        .attr('width', wValue)
        .attr('height', '0%')
        // .style("mix-blend-mode","soft-light")     
        .style('opacity', 0)
        .transition()
            .duration(300)
            .ease(d3.easeSinOut)
            .attr('height', '100%') 
            .style('opacity', 0.3)
            .delay(function(de,i){return(4000 + i* 30 * Math.random())})
            .transition()
                .style('opacity', 0.5)
                .delay(function(de,i){return(i*10)});

        var events = d3.selectAll(".events");
        eventHoverEffect();
        
        function eventHoverEffect() {
          events.on("mouseover", function(de) {
          d3.select(this).style("mix-blend-mode","color-dodge").style('opacity',1);
          var eventDate = formatting(de.date);
          divEv.transition()		
                .duration(200)		
                .style("opacity", 1);		
          divEv.html(eventDate + '<br/>' + de.name)	
                .style("top", (d3.event.pageY - 28) + "px")
                .style("left", 0);	
            })
        .on("mousemove", function(de) {
            divEv.style("top", (d3.event.pageY - 28) + "px");	
        })			
        .on("mouseout", function(de) {
          d3.select(this).style("mix-blend-mode","soft-light").style('opacity',0.8);
            divEv.transition()		
                .duration(500)		
                .style("opacity", 0);	
        })
        .on("click", function(de){
            d3.select(this).style("mix-blend-mode","color-dodge").style('opacity',1);
            showViewer(de);
          });
      };
  
  ////////////////////////////////////
  /////////// Event Viewer ///////////
  ////////////////////////////////////
    function showViewer(de) {
      var eventDate = formatting(de.date);
      setTimeout(function(){
        d3.select(".events:nth-of-type("+ (+de.num+1) + ")").style("mix-blend-mode","color-dodge").style('opacity', 1);
      }, 100);
      console.log(de.num);
      const viewerLeftHtml = "<p class='evDate'>" + eventDate + "<br/><b class='evName'>" + de.name + "</b></p>" + "<p class='evNote'>" + de.note + "</p><a href='" + de.link + "' target='_blank'><div class='evLink'> >> Read More at the Source</div></a>";
      d3.selectAll(".viewerLeft").html(viewerLeftHtml).attr("num", de.num);
      d3.selectAll(".viewerRight").html(themedia(de));
        viewerEv.style("height", "auto")
            .style("opacity", 1)
            .style("pointer-events", "unset");
        divEv.transition()		
            .duration(500)		
            .style("opacity", 0);
        
        nextEv.on("click", nextViewer);
        prevEv.on("click", prevViewer);
    };

    function nextViewer() {
      const theID = d3.selectAll(".viewerLeft").attr("num");
      const nextID = +theID < eventLength-1 ? +theID +1 : 0;
      // console.log(nextID);
      var nextDate = formatting(datasetEv[nextID].date);
      d3.selectAll(".events").style("mix-blend-mode","soft-light").style('opacity', 0.8);
      d3.select(".events:nth-of-type("+ (+nextID+1) + ")").style("mix-blend-mode","color-dodge").style('opacity', 1);
      const viewerLeftHtml = "<p class='evDate'>" + nextDate + "<br/><b class='evName'>" + datasetEv[nextID].name + "</b></p>" + "<p class='evNote'>" + datasetEv[nextID].note + "</p><a href='" + datasetEv[nextID].link + "' target='_blank'><div class='evLink'> >> Read More at the Source</div></a>";
      d3.selectAll(".viewerLeft").html(viewerLeftHtml);
      d3.selectAll(".viewerRight").html(themedia(datasetEv[nextID]));  
      d3.selectAll(".viewerLeft").attr("num", datasetEv[nextID].num);
      const thisEv = d3.select(".events:nth-of-type("+ (+nextID+1) + ")").node();
      const spaces = thisEv.getBoundingClientRect();
      if(spaces.x + spaces.width > innerWidth || spaces.x < 0) {
        seamless.elementScrollIntoView(thisEv, {
          behavior: 'smooth',
        })
        // thisEv.scrollIntoView();
      }
    };

    function prevViewer() {
      const theID = d3.selectAll(".viewerLeft").attr("num");
      const prevID = +theID > 0 ? +theID -1 : eventLength-1;
      // console.log(prevID);
      var prevDate = formatting(datasetEv[prevID].date);

      d3.selectAll(".events").style("mix-blend-mode","soft-light").style('opacity', 0.8);
      d3.select(".events:nth-of-type("+ (+prevID+1) + ")").style("mix-blend-mode","color-dodge").style('opacity', 1);

      const viewerLeftHtml = "<p class='evDate'>" + prevDate + "<br/><b class='evName'>" + datasetEv[prevID].name + "</b></p>" + "<p class='evNote'>" + datasetEv[prevID].note + "</p><a href='" + datasetEv[prevID].link + "' target='_blank'><div class='evLink'> >> Read More at the Source</div></a>";
      d3.selectAll(".viewerLeft").html(viewerLeftHtml);
      d3.selectAll(".viewerRight").html(themedia(datasetEv[prevID]));  
      d3.selectAll(".viewerLeft").attr("num", datasetEv[prevID].num);

      const thisEv = d3.select(".events:nth-of-type("+ (+prevID+1) + ")").node();
      const spaces = thisEv.getBoundingClientRect();
      if(spaces.x > innerWidth || spaces.x < 0) {
        seamless.elementScrollIntoView(thisEv, {
          behavior: 'smooth',
        })
        // thisEv.scrollIntoView();
      }
    };    

    function closeViewer() {
        viewerEv.style("height", 0)
            .style("opacity", 0)
            .style("pointer-events", "none");
        d3.selectAll(".events")
            .style("opacity", 0.8)
            .style("mix-blend-mode","soft-light");
        eventHoverEffect();
    };

    function themedia(de) {
      if(de.media == "img") {
        const theurl = de.mediaurl;
        return ("<img src='../images/events/"+ theurl + "'/>" + "<p class='evCaption'>" + de.caption + " (<a href='" + de.crediturl + "' target='_blank'>" + de.credit + "</a>)" + "</p>")
      } else if(de.media == "shooting") {
        return ("<img src='../images/events/shooting.jpg'/>" + "<p class='evCaption'>Image representing Gun Violence <a href='https://unsplash.com/photos/ugdKmhDg1m8' target='_blank'>Photo by Max Kleinen on Unsplash</a></p>")
      } else if(de.media == "police") {
        return ("<img src='../images/events/police.jpg'/>" + "<p class='evCaption'>Image representing Police Brutality <a href='https://unsplash.com/photos/aZ-TRPezwt0' target='_blank'>Photo by AJ Colores on Unsplash</a></p>")
      } else if(de.media == "gun-control") {
        return ("<img src='../images/events/gun-control.jpg'/>" + "<p class='evCaption'>Image representing Gun Control <a href='https://unsplash.com/photos/XWC5q9_Xp0o' target='_blank'>Photo by Maria Lysenko on Unsplash</a></p>")
      } else if(de.media == "incident") {
        return ("<img src='../images/events/incident.jpg'/>" + "<p class='evCaption'>Image representing Violent Incidents <a href='https://unsplash.com/photos/yXAXya621Po' target='_blank'>Photo by Kyle Johnson on Unsplash</a></p>")
      } else if(de.media == "covid") {
        return ("<img src='../images/events/covid.jpg'/>" + "<p class='evCaption'>Image representing Covid-19 <a href='https://unsplash.com/photos/rnr8D3FNUNY' target='_blank'>Photo by Fusion Medical Animation on Unsplash</a></p>")
      } else if(de.media == "fire") {
        return ("<img src='../images/events/fire.jpg'/>" + "<p class='evCaption'>Image representing Wild Fires <a href='https://unsplash.com/photos/AJmFY5SM_v4' target='_blank'>Photo by Malachi Brooks on Unsplash</a></p>")
      } else if(de.media == "politic") {
        return ("<img src='../images/events/politics.jpg'/>" + "<p class='evCaption'>Image representing Political Events <a href='https://unsplash.com/photos/wqLGlhjr6Og' target='_blank'>Photo by Marco Oriolesi on Unsplash</a></p>")
      } else if(de.media == "stats") {
        return ("<img src='../images/events/stats.jpg'/>" + "<p class='evCaption'>Image representing Display of Statistics <a href='https://unsplash.com/photos/dBI_My696Rk' target='_blank'>Photo by Chris Liverani on Unsplash</a></p>")
      } else if(de.media == "video") {
        const theurl = de.mediaurl;
        return ('<iframe width="300" height="300" src="' + theurl + '"  frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen"></iframe>' + "<p class='evCaption'>" + de.caption + "</p>")
      } else {
        return ("<img src='../images/image-placeholder.jpg'/>")
      }}
};

////////////////////////////////////
///////  Violence line charts  /////
////////////////////////////////////
    const render = data => {
    const xValue = d => d.timestamp;
    const yValue = d => d.people;
    const colorValue = d => d.category;

    ////////////////////////////////////
    /////////// AXIS Ticks /////////////
    ////////////////////////////////////

    const xScale = d3.scaleTime()
        .domain([new Date("2016-01-07"), new Date("2021-01-31")])
        .range(portrait? [0, innerWidth *4]:[0, innerWidth*2]);
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 100])
        .nice();
    const g = d3.selectAll(".infoWrapper").append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    ////////////////////////////////////
    //////  Lines and Area paths  //////
    ////////////////////////////////////
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
        .attr("stop-color", "#DDD") // Light
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
        .attr("offset", "30%")
        .attr("stop-color", "#000") // Dark
        .attr("stop-opacity", 1);
        gradientTall.append("stop")
        .attr('class', 'end')
        .attr("offset", "90%")
        .attr("stop-color", "#111")
        .attr("stop-opacity", 0);
    const colorScale = d3.scaleOrdinal()
        .range(['url(#svgGradientTall)', 'url(#svgGradient)', 'url(#svgGradient)']);
        colorScale.domain(nested.map(d => d.key));
    var iconColor = d3.scaleOrdinal()
        .domain(nested.map(d => d.key))
        .range(["#222222", "#dddddd"]);
    var iconImg = d3.scaleOrdinal()
        .domain(nested.map(d => d.key))
        .range(["../images/homicide-icon.svg", "../images/gun-icon.svg"]);

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
          .ease(d3.easeSinOut);

    ////////////////////////////////////
    ///////////  Axis Ticks  ///////////
    ////////////////////////////////////

      const xAxis = d3.axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickPadding(15);  
      const xAxisG = g.append('g').call(xAxis)
          .attr("class", "x axis")
          .attr('transform', `translate(0, 5)`);
      xAxisG.select('.domain').remove();
  
      const yAxis = d3.axisLeft(yScale).tickFormat(d3.format('.2s'));
      const yAxisG = g.append('g').call(yAxis)
      .attr("class", "y axis info")
      .attr('transform', `translate(20, 0)`)
      .selectAll('text')
          .style('text-anchor', 'start');
      yAxisG.attr('opacity', 0)
          .transition()
              .delay(1000)
              .duration(500)
              .style('opacity',1);
      yAxisG.select('.domain').remove();

    ////////////////////////////////////
    //////////  Chart Tooltip  /////////
    ////////////////////////////////////
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
      .style("fill", d => iconColor(d.key))
      .style("stroke", "#ddd")
      .style("opacity", "0");
    mousePerLine.append("image")
      .attr("class", "mouse-circle-img")
      .attr("width", 40).attr("height", 40)
      .attr("xlink:href", d => iconImg(d.key))
      .style("opacity", "0");
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
        d3.selectAll(".mouse-circle-img")
          .style("opacity", "0");
      };
    function showTooltips() {
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
        d3.selectAll(".mouse-circle-img")
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
              .text(d.key + " :: " + yScale.invert(pos.y).toFixed(0))
              .attr("font-size", "14px");
            return "translate(" + mouse[0] + "," + pos.y +")";
          });

          var mouseX = mouse[0];
          var enoughXspace = innerWidth - mouseX;
          if (enoughXspace < 190) {
          d3.selectAll('.textTT').attr("transform", "translate(-165,3)");
          } else {
          d3.selectAll('.textTT').attr("transform", "translate(25,3)");
          }
      }

      // const lastEv = d3.select(".events:last-of-type").node();
      // d3.timeout(() => {
      //   lastEv.scrollIntoView({behavior: 'smooth'});
      // }, 5000)
};

////////////////////////////////////
//////  Rendering with Data  ///////
////////////////////////////////////
d3.csv('../csv/events-all.csv')
.then(datasetEv => {
  datasetEv.forEach(de => {
    de.duration = +de.duration;
    de.name = de.name;
    de.note = de.note;
    de.link = de.link;
    de.media = de.media;
    de.num = +de.num;
    de.mediaurl = de.mediaurl;
    de.credit = de.credit;
    de.crediturl = de.crediturl;
    de.caption = de.caption;
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

    ////////////////////////////////////
    ////////  Legend Animated  /////////
    ////////////////////////////////////
    var homLetter = d3.select('svg').append("g")
    .attr('transform', `translate( ${innerWidth<400 ? 70 : 100}, 100)`)
    .attr('class', 'homLetter')
    .append("text")
    .style('opacity', 0)
    .text('HOMICIDES')
    .transition()
      .style('opacity', 1)
      .duration(800)
      .delay(200)
      .transition()
        .style('opacity', 0)
        .duration(800)
        .delay(3000);
    var middleH = innerHeight/3*2;
    var gunLetter = d3.select('svg').append("g")
    .attr('transform', `translate( ${innerWidth<400 ? 70 : 100}, ${middleH})`)
    .attr('class', 'gunLetter')
    .append("text")
    .style('opacity', 0)
    .text('GUN SALES')
    .transition()
      .style('opacity', 1)
      .duration(800)
      .delay(2200)
      .transition()
        .style('opacity', 0)
        .duration(800)
        .delay(1000);
