//// Create SVG (infoWrapper)
const margin = { top: 0, right: 0, bottom: 30, left: 0 };
const innerWidth = width;
const innerHeight = height - margin.top - margin.bottom;
var portrait = innerHeight > innerWidth ? true : false;
var hateNewShowing = false;
var loveNewShowing = false;

const svg = d3.selectAll(".wrapper").append("svg").attr("width", width).attr("height", height).attr("class", "moodWrapper");

//// Mood of the world

// Axis
const xScale = d3.scaleTime()
    .range([0, innerWidth])
    .nice();
const yScaleHate = d3.scaleLinear()
    .range([0, innerHeight])
    .nice();
const yScaleLove = d3.scaleLinear()
    .range([innerHeight, 0])
    .nice();
const g = d3.selectAll(".moodWrapper").append('g');


// define the area
var areaHateBefore = d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return xScale(d.date); })
    .y0(0)
    .y1(function(d) { return yScaleHate(d.hatetweet *0); });
var areaHateMiddle = d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return xScale(d.date); })
    .y0(0)
    .y1(function(d) { return yScaleHate(d.hatetweet *1.1); });
var areaHateMiddleTwo = d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return xScale(d.date); })
    .y0(0)
    .y1(function(d) { return yScaleHate(d.hatetweet *0.96); });
var areaHate = d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return xScale(d.date); })
    .y0(0)
    .y1(function(d) { return yScaleHate(d.hatetweet); });

var areaLoveBefore = d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return xScale(d.date); })
    .y0(height)
    .y1(function(d) { return yScaleLove(d.lovetweet *0); });
var areaLoveMiddle = d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return xScale(d.date); })
    .y0(height)
    .y1(function(d) { return yScaleLove(d.lovetweet *1.04); });
var areaLove = d3.area()
    .curve(d3.curveBasis)
    .x(function(d) { return xScale(d.date); })
    .y0(height)
    .y1(function(d) { return yScaleLove(d.lovetweet); });

// define the line
var lineHate = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScaleHate(d.hatetweet); });
var lineLove = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScaleLove(d.lovetweet); });

var latestDate = function(d) {return d[0].date;}

///// Render with Data

d3.csv('../csv/mood.csv')
.then(data => {
    data.forEach(d => {
    d.date = new Date(d.date);
    d.hatetweet = +d.hatetweet;
    d.lovetweet = +d.lovetweet;
  })

  // scale the range of the data
//   yScaleHate.domain([0, d3.max(data, function(d) { return d.hatetweet; })]);
//   yScaleLove.domain([0, d3.max(data, function(d) { return d.lovetweet; })]);
xScale.domain(d3.extent(data, function(d) { return d.date; }));
yScaleHate.domain([0, 100]);
yScaleLove.domain([0, 100]);

var formatting = d3.timeFormat("%b %d");
var currentDate = formatting(data[0].date);
var currentHate = data[0].hatetweet;
var currentLove = data[0].lovetweet;

  const hatePool = g.append("g").attr("class","hatePool");
  const lovePool = g.append("g").attr("class","lovePool");

  // add the area
  hatePool.append("path")
       .data([data])
       .attr("d", areaHateBefore)
       .attr('fill', 'rgb(0)')
       .transition()
            .delay(800)
            .duration(2000)
            .attr("d", areaHateMiddle)
            .ease(d3.easeQuadInOut)
            .transition()
                .duration(700)
                .attr("d", areaHateMiddleTwo)
                .ease(d3.easeQuadInOut)
                .transition()
                .duration(500)
                .attr("d", areaHate)
                .ease(d3.easeQuadInOut);

lovePool.append("path")
       .data([data])
       .attr("d", areaLoveBefore)
       .attr('fill', 'rgb(220, 100, 100)')
       .transition()
            .delay(3200)
            .duration(3000)
            .attr("d", areaLoveMiddle)
            .ease(d3.easeQuadInOut)
            .transition()
                .duration(600)
                .attr("d", areaLove)
                .ease(d3.easeQuadInOut);
// add the valueline path
hatePool.append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "rgba(0,0,0,0)")
      .attr("d", lineHate);
lovePool.append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "rgba(0,0,0,0)")
      .attr("d", lineLove);

      hateBubbles(0);
      loveBubbles(1300);

// Hate Tweet number and the counter animation
var hateNumber, loveNumber, selectedDate;
var hateG = d3.selectAll(".wrapper").append("g");
var hateText = hateG.append("text")
      .attr("class", "hateText")
      .text(0)
      .style('opacity',0)
      .on("click", function(){
        // hateBubbles();
        // hateNewTweet();})
        if(!hateNewShowing && !loveNewShowing) {
        hateBubbles(0);
        hateBubbles(1000);
        hateNewTweet();}
    })
      .transition()
        .delay(1000)
        .duration(500)
        .style('opacity',1);
hateText.transition()
    .tween("text", function() {
        var selection = d3.select(this);
        var start = d3.select(this).text();
        var end = currentHate;
        var interpolator = d3.interpolateNumber(start,end);
        return function(t) { selection.text(Math.round(interpolator(t))); };
    })
    .duration(3000);

var hateGAfter = d3.selectAll(".wrapper").append("g");
hateGAfter.append("text")
    .attr("class", "hateTextAfter")
    .text("hate tweets on " + currentDate)
      .style('opacity',0)
      .transition()
        .delay(1000)
        .duration(500)
        .style('opacity',1);

// Love Tweet number and the counter animation
var loveG = d3.selectAll(".wrapper").append("g");
var loveText = loveG.append("text")
      .attr("class", "loveText")
      .text(0)
      .style('opacity',0)
      .on("click", function(){
        if(!hateNewShowing && !loveNewShowing) {
            loveBubbles(0); 
            loveBubbles(1000); 
            loveNewTweet();}
        })
      .transition()
        .delay(4000)
        .duration(500)
        .style('opacity',1);

loveText.transition()
    .tween("text", function() {
        var selection = d3.select(this);
        var start = d3.select(this).text();
        var end = currentLove;
        var interpolator = d3.interpolateNumber(start,end);
        return function(t) { selection.text(Math.round(interpolator(t))); };
    })
    .duration(3000);

var loveGAfter = d3.selectAll(".wrapper").append("g");
loveGAfter.append("text")
    .attr("class", "loveTextAfter")
    .text("love tweets on " + currentDate)
      .style('opacity',0)
      .transition()
        .delay(4000)
        .duration(500)
        .style('opacity',1);

//// Date Handle
var timeHandle = svg.append("rect")
    .attr("class", "timeHandle")
    .attr("x", portrait? innerWidth -40:innerWidth -20)
    .attr("y", 0)
    .attr("fill", "#ddd")
    .style('opacity',0)
    .transition()
      .delay(6000)
      .duration(500)
      .style('opacity',1)
      .transition()
        .delay(1000)
        .duration(400)
        .attr("x", innerWidth -40)
        .ease(d3.easeSinInOut)
        .transition()
            .duration(100)
            .attr("x", innerWidth -25)
            .ease(d3.easeSinInOut)
            .transition()
                .delay(100)
                .duration(300)
                .attr("x", portrait? innerWidth -50:innerWidth -30)
                .ease(d3.easeSinInOut)
                .transition()
                    .duration(200)
                    .attr("x", portrait? innerWidth -40:innerWidth -20)
                    .ease(d3.easeSinInOut)
                    .transition()
                        .delay(500)
                        .duration(500)
                        .style('opacity',portrait? 0.3:0.5);
var deltaX;
var newX;
var dragHandler = d3.drag()
    .on("start", function () {
        var current = d3.select(this);
        deltaX = current.attr("x") - d3.event.x;
    })
    .on("drag", function () {
        newX = d3.event.x + deltaX;
        if(newX < 0) { newX = 0;}
        if(newX > innerWidth - 20) {newX = innerWidth - 20;}
        d3.select(this)
            .attr("x", newX);
    })
    .on("end", function() {
        var location = ((innerWidth - newX)/innerWidth) * data.length,
        item = Math.round(location);
        d1 = data[item-1];
        hateNumber = d1.hatetweet;
        loveNumber = d1.lovetweet;

        selectedDate = formatting(d1.date);
        console.log(selectedDate, hateNumber, loveNumber);
        loveG.selectAll("text").transition()
        .tween("text", function() {
            var selection = loveG.selectAll("text");
            var start = loveG.selectAll("text").text();
            var end = loveNumber;
            var interpolator = d3.interpolateNumber(start,end);
            return function(t) { selection.text(Math.round(interpolator(t))); };
        })
        .duration(1000);
        loveGAfter.selectAll("text")
        .remove();
        loveGAfter.append("text")
        .attr("class", "loveTextAfter")
        .text("love tweets on " + selectedDate);
        hateG.selectAll("text").transition()
        .tween("text", function() {
            var selection = hateG.selectAll("text");
            var start = hateG.selectAll("text").text();
            var end = hateNumber;
            var interpolator = d3.interpolateNumber(start,end);
            return function(t) { selection.text(Math.round(interpolator(t))); };
        })
        .duration(1000);
        hateGAfter.selectAll("text")
        .remove();
        hateGAfter.append("text")
        .attr("class", "hateTextAfter")
        .text("hate tweets on " + selectedDate);
        //Update Sound
        soundUpdate(hateNumber, loveNumber);
        });
    dragHandler(svg.selectAll(".timeHandle"));

//// AXIS
const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15)
    .ticks(6);  
const xAxisG = g.append('g').call(xAxis)
    .attr("class", "x axis")
    .attr('transform', `translate(0,${innerHeight})`);
xAxisG.select('.domain').remove();

////////////////////////////////////
//////////// SOUND /////////////////
////////////////////////////////////

// Hate = hate.mp3 //
const playerHate = new Tone.Player("../sound/hate.mp3").toMaster();
playerHate.loop = true;
const playerLove = new Tone.Player("../sound/love.mp3").toMaster();
playerLove.loop = true;
const playerBigHate = new Tone.Player("../sound/bigHate.mp3").toMaster();
playerBigHate.loop = true;
const playerBigLove = new Tone.Player("../sound/bigLove.mp3").toMaster();
playerBigLove.loop = true;
const playerNewHate = new Tone.Player("../sound/newHate.mp3").toMaster();
const playerNewLove = new Tone.Player("../sound/newLove.mp3").toMaster();
playerNewHate.loop = false;
playerNewLove.loop = false;

/// Mute + Unmute button
var muted = false;
const muteIcon = d3.select(".wrapper").append("div")
    .attr("class", "sound-icon")
    .on('click', function(){
        if(muted){
            playerHate.mute = false;
            playerLove.mute = false;
            playerNewHate.mute = false;
            playerNewLove.mute = false;
            playerBigHate.mute = false;
            playerBigLove.mute = false;
            muted = false;
            muteIcon.style('background', 'url(../images/mute.svg)');
        } else {
            playerHate.mute = true;
            playerLove.mute = true;
            playerNewHate.mute = true;
            playerNewLove.mute = true;
            playerBigHate.mute = true;
            playerBigLove.mute = true;
            muted = true;
            muteIcon.style('background', 'url(../images/unmute.svg)');
        }
    });

/// Start button
const StartBtn = d3.select(".wrapper").append("div")
    .attr("class", "openingModal")
    .style('opacity',1)
    .html('<img src="../images/mute-dark.svg"><p>Listen to the mood of the world</p>')
    .on("mouseover", function(){
        StartBtn.style('opacity', 0.5);
    })
    .on("mouseleave", function(){
        StartBtn.style('opacity', 1);
    })
    .on("click", function() {
        soundStart(currentHate, currentLove);
        StartBtn.transition().style('opacity',0);
        StartBtn.remove();
        muteIcon.style('background', 'url(../images/mute.svg)');
    });

function soundStart(hate, love) {
    var ratio = hate+love;
    ratio = ratio.toFixed(0);
    var ratioHate = (hate / ratio) *15 - 5;
    ratioHate = ratioHate.toFixed(1);
    var valueHate = 1 - (hate / 100);
    valueHate = valueHate.toFixed(1);
    var valueBigHate = hate / 100;
    valueBigHate = valueBigHate.toFixed(1);
    var ratioLove = (love / ratio) *15 - 5;
    ratioLove = ratioLove.toFixed(1);
    var valueBigLove = love / 100;
    valueBigLove = valueBigLove.toFixed(1);

    if(valueBigHate > 0.5) {
        playerBigHate.start();
        playerBigHate.volume.rampTo(valueBigHate*2 -4, 1);
    }
    if(valueBigLove > 0.5) {
        playerBigLove.start();
        playerBigLove.volume.rampTo(2 * valueBigLove, 1);
    }
    playerHate.playbackRate = valueHate;
    playerHate.volume.rampTo(ratioHate, 1);
    playerLove.volume.rampTo(ratioLove, 1);
    Tone.Transport.bpm.rampTo(ratio, 1);
    playerHate.start();
    playerLove.start();
    
    console.log('ratioHate (Volume of Hate) = ' + ratioHate + '\nratioLove (Volume of Love) = ' + ratioLove + '\nvalueHate (Playback Rate of Hate) = ' + valueHate + '\nratio (BPM for the whole) = ' + ratio + '\nvalueBigHate (Volume of BigHate) = ' + valueBigHate + '\nvalueBigLove (Volume of BigLove) = ' + valueBigLove );

}

function soundUpdate(hate, love) {
    var ratio = hate+love;
    ratio = ratio.toFixed(0);
    var ratioHate = (hate / ratio) *15 - 5;
    ratioHate = ratioHate.toFixed(1);
    var valueHate = 1 - (hate / 100);
    valueHate = valueHate.toFixed(1);
    var valueBigHate = hate / 100;
    valueBigHate = valueBigHate.toFixed(1);
    var ratioLove = (love / ratio) *15 - 5;
    ratioLove = ratioLove.toFixed(1);
    var valueBigLove = love / 100;
    valueBigLove = valueBigLove.toFixed(1);

    if(valueBigHate > 0.5) {
        if(playerBigHate.state == 'started') {
            playerBigHate.volume.rampTo(valueBigHate*2 -4, 1);
        } else {
            playerBigHate.start();
            playerBigHate.volume.rampTo(valueBigHate*2 -4, 1);
        }
    } else {
        playerBigHate.fadeOut = 3000;
        playerBigHate.stop();
    }

    if(valueBigLove > 0.5) {
        if(playerBigLove.state == 'started') {
            playerBigLove.volume.rampTo(2 * valueBigLove, 1);
        } else {
            playerBigLove.start();
            playerBigLove.volume.rampTo(2 * valueBigLove, 1);
        }
    } else {
        playerBigLove.fadeOut = 3000;
        playerBigLove.stop();
    }

    if(valueBigHate >= 0.6) {
        d3.selectAll(".moodWrapper")
        .style('background','#222222')
        .style('background-image', 'url("../images/45-degree-fabric-light.png")');
    } else if(valueBigHate >= 0.5) {
        d3.selectAll(".moodWrapper")
        .style('background','#333333')
        .style('background-image', 'url("../images/45-degree-fabric-light.png")');
    } else if(valueBigHate >= 0.4) {
        d3.selectAll(".moodWrapper")
        .style('background','#524141')
        .style('background-image', 'url("../images/45-degree-fabric-light.png")');
    } else if(valueBigHate >= 0.3) {
        d3.selectAll(".moodWrapper")
        .style('background','#725151')
        .style('background-image', 'url("../images/45-degree-fabric-light.png")');
    } else if(valueBigHate < 0.3) {
        d3.selectAll(".moodWrapper")
        .style('background','#955b5b')
        .style('background-image', 'url("../images/45-degree-fabric-light.png")');
    }

    playerHate.playbackRate = valueHate;
    playerLove.playbackRate = 1;
    playerHate.volume.rampTo(ratioHate, 1);
    playerLove.volume.rampTo(ratioLove, 1);
    Tone.Transport.bpm.rampTo(ratio, 1);

    console.log('ratioHate (Volume of Hate) = ' + ratioHate + '\nratioLove (Volume of Love) = ' + ratioLove + '\nvalueHate (Playback Rate of Hate) = ' + valueHate + '\nratio (BPM for the whole) = ' + ratio + '\nvalueBigHate (Volume of BigHate) = ' + valueBigHate + '\nvalueBigLove (Volume of BigLove) = ' + valueBigLove );

}

////////////////////////////////////
/////// Bubbles + New Tweets ///////
////////////////////////////////////

//// Bubble Effects ////
function hateBubbles(dl) {
for(var i=1;i<10;i++){
    var randomCircle = Math.random();
    hatePool.append("circle")
      .attr("r", 5*i)
      .attr("fill", "rgb(0)")
      .attr('transform', `translate(${innerWidth*randomCircle},-100)`)
        .transition()
        .duration(2400)
        .delay(function(){return(dl + i*300*randomCircle)})
        .attr('transform', `translate(${innerWidth*randomCircle},${innerHeight+100})`)
        .ease(d3.easeQuadInOut)
        .remove();
    }
}
function loveBubbles(dl) {
for(var i=1;i<10;i++){
    var randomCircle = Math.random();
    lovePool.append("circle")
      .attr("r", 5*i)
      .attr("fill", "rgb(220, 100, 100)")
      .attr('transform', `translate(${innerWidth*randomCircle},${innerHeight+100})`)
        .transition()
        .duration(4600)
        .delay(function(){return(dl + i*300*randomCircle)})
        .attr('transform', `translate(${innerWidth*randomCircle},-100)`)
        .ease(d3.easeQuadIn)
        .remove();
    }
}

//// New Tweets ////
function hateNewTweet() {
    hateNewShowing = true;
    var twitterString = "hate it when someone tells me to do something when i was about to do it anyway... now i’m not doing it.";
    var twitterUsername = "Nolo"
    var twitterUserId = "farzanainit"
    d3.selectAll(".wrapper").append("div")
    .attr("class", "tweetLabel")
    .html("<img src='../images/hate.svg'/>")
    .style("top", "-50%")
    .style("opacity", 0.4)
    .transition()
        .duration(2600)
        .style("top", "90%")
        .style("opacity",0);
    d3.selectAll(".wrapper").append("div")
    .attr("class", "tweetWrap")
    .html("<h3>" + twitterString + "</h3><p>" + twitterUsername + "<span>@" + twitterUserId + "</span>")
    .style("top", "0%")
    .style("opacity",0)
    .transition()
        .duration(1000)
        .delay(2400)
        .style("top", "50%")
        .style("opacity",1)
        .transition()
            .delay(5000)
            .duration(1000)
            .style("opacity", 0)
            .remove();
    playerNewHate.start();
    setTimeout(function(){hateNewShowing = false}, 10000);
}

function loveNewTweet() {
    loveNewShowing = true;
    var twitterString = "Love the new community of the markets. Let's stick together. Hold strong! Its our time! Hold my drink, I need a spacesuit for this. $GME $Doge";
    var twitterUsername = "Pete Smith"
    var twitterUserId = "bunniesofthayard"
    d3.selectAll(".wrapper").append("div")
    .attr("class", "tweetLabel")
    .html("<img src='../images/love.svg'/>")
    .style("top", "90%")
    .style("opacity",0.5)
    .transition()
        .duration(3000)
        .style("top", "-50%")
        .style("opacity", 0);
    d3.selectAll(".wrapper").append("div")
    .attr("class", "tweetWrap")
    .html("<h3>" + twitterString + "</h3><p>" + twitterUsername + "<span>@" + twitterUserId + "</span>")
    .style("top", "100%")
    .style("opacity",0)
    .transition()
        .duration(1000)
        .delay(2400)
        .style("top", "50%")
        .style("opacity",1)
        .transition()
            .delay(5000)
            .duration(1000)
            .style("opacity", 0)
            .remove();
    playerNewLove.start();
    setTimeout(function(){loveNewShowing = false}, 10000);
}
});
