const margin = { top: 0, right: 0, bottom: 30, left: 0 };
const innerWidth = width;
const innerHeight = height - margin.top - margin.bottom;
var portrait = innerHeight > innerWidth ? true : false;
var hateNewShowing = false;
var loveNewShowing = false;
var muted = false;
var hateColor = 'rgb(0)';
var loveColor = 'rgb(220, 100, 100)';
var visibility = true;

// var mongoSummary = "../csv/totalMood.json";
// var loveApi = "../csv/loveApi.json";
// var hateApi = "../csv/hateApi.json";
var mongoSummary = "https://api182.patternbased.com/api/summary";
var loveApi = "https://api182.patternbased.com/api/love";
var hateApi = "https://api182.patternbased.com/api/hate";

const svg = d3.selectAll(".wrapper").append("svg").attr("width", width).attr("height", height).attr("class", "moodWrapper");

//// Mood of the world

// Axis
const xScale = d3.scaleTime()
    .range([0, innerWidth])
    .nice();
const yScaleHate = d3.scaleLinear()
    .range([40, innerHeight * 0.75])
    .nice();
const yScaleLove = d3.scaleLinear()
    .range([innerHeight, innerHeight * 0.25 - 40])
    .nice();
const g = d3.selectAll(".moodWrapper").append('g');

// define the chart area and opening animation
var areaHateBefore = d3.area()
    .curve(d3.curveBasis)
    .x((d) => { return xScale(d.date); })
    .y0(0)
    .y1((d) => { return yScaleHate(d.hatetweet *0); });
var areaHateMiddle = d3.area()
    .curve(d3.curveBasis)
    .x((d) => { return xScale(d.date); })
    .y0(0)
    .y1((d) => { return yScaleHate(d.hatetweet *1.1); });
var areaHateMiddleTwo = d3.area()
    .curve(d3.curveBasis)
    .x((d) => { return xScale(d.date); })
    .y0(0)
    .y1((d) => { return yScaleHate(d.hatetweet *0.96); });
var areaHate = d3.area()
    .curve(d3.curveBasis)
    .x((d) => { return xScale(d.date); })
    .y0(0)
    .y1((d) => { return yScaleHate(d.hatetweet); });

var areaLoveBefore = d3.area()
    .curve(d3.curveBasis)
    .x((d) => { return xScale(d.date); })
    .y0(height)
    .y1((d) => { return yScaleLove(d.lovetweet *0); });
var areaLoveMiddle = d3.area()
    .curve(d3.curveBasis)
    .x((d) => { return xScale(d.date); })
    .y0(height)
    .y1((d) => { return yScaleLove(d.lovetweet *1.03); });
var areaLoveMiddleTwo = d3.area()
    .curve(d3.curveBasis)
    .x((d) => { return xScale(d.date); })
    .y0(height)
    .y1((d) => { return yScaleLove(d.lovetweet *0.99); });
var areaLove = d3.area()
    .curve(d3.curveBasis)
    .x((d) => { return xScale(d.date); })
    .y0(height)
    .y1((d) => { return yScaleLove(d.lovetweet); });

// define the chart line for Date Handle
var lineHate = d3.line()
    .curve(d3.curveBasis)
    .x((d) => { return xScale(d.date); })
    .y((d) => { return yScaleHate(d.hatetweet); });
var lineLove = d3.line()
    .curve(d3.curveBasis)
    .x((d) => { return xScale(d.date); })
    .y((d) => { return yScaleLove(d.lovetweet); });

////////// Render with Data
d3.json(mongoSummary)
.then(data => {
    data.forEach(d => {
    d.date = new Date(d.timeStamp);
    d.hatetweet = +d.dailyHate;
    d.lovetweet = +d.dailyLove;
  })

// scale the range of the data
//   yScaleHate.domain([d3.min(data, (d) => { return d.hatetweet; }) *0.5, d3.max(data, (d) => { return d.hatetweet; })]);
// yScaleLove.domain([d3.min(data, (d) => { return d.lovetweet; }), d3.max(data, (d) => { return d.lovetweet; })]);
yScaleHate.domain([0, d3.max(data, (d) => { return d.lovetweet; })]);
yScaleLove.domain([0, d3.max(data, (d) => { return d.lovetweet; })]);
xScale.domain(d3.extent(data, (d) => { return new Date(d.date); }));

// Date formattings
var formatting = d3.timeFormat("%b %d");
var reverseDate = data.length -1;
var currentDate = formatting(data[reverseDate].date);
var currentHate = data[reverseDate].hatetweet;
var currentLove = data[reverseDate].lovetweet;

////////////////////////////////////
////////// Area Charts /////////////
////////////////////////////////////
const hatePool = g.append("g").attr("class","hatePool");
const lovePool = g.append("g").attr("class","lovePool");

hatePool.append("path")
       .data([data])
       .attr("d", areaHateBefore)
       .attr('fill', hateColor)
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
       .attr('fill', loveColor)
       .transition()
            .delay(1600)
            .duration(3800)
            .attr("d", areaLoveMiddle)
            .ease(d3.easeQuadInOut)
            .transition()
                .duration(700)
                .attr("d", areaLoveMiddleTwo)
                .ease(d3.easeQuadInOut)
                .transition()
                .duration(500)
                .attr("d", areaLove)
                .ease(d3.easeQuadInOut);

// defining the valueline path
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


// Opening bubble animations
    hateBubbles(0);
    loveBubbles(1000);

////////////////////////////////////
/////////// AXIS Ticks /////////////
////////////////////////////////////

const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d %b"));
    // .tickSize(-innerHeight);  
const xAxisG = g.append('g').call(xAxis)
    .attr("class", "x axis")
    .attr('transform', `translate( 0, ${innerHeight})`)
    .selectAll('text')
        .style('fill', '#dddddd');
xAxisG.select('.domain').remove();

const yHateAxis = d3.axisLeft(yScaleHate).tickFormat(d3.format('.2s'));
const yHateG = g.append('g').call(yHateAxis)
    .attr("class", "y axis hate")
    .attr('transform', `translate(20, 0)`)
    .selectAll('text')
        .style('text-anchor', 'start')
        .style('fill', 'rgba(255,255,255,0.6)');
yHateG.attr('opacity', 0)
        .transition()
        .delay(1000)
        .duration(500)
        .style('opacity',1)
        .transition()
            .delay(2000)
            .duration(500)
            .style('opacity',0.5);
yHateG.on("mouseover", function(){
            yHateG.style('opacity', 1)})
        .on("mouseout", function(){
            yHateG.style('opacity', 0.5)});
yHateG.select('.domain').remove();

const yLoveAxis = d3.axisRight(yScaleLove).tickFormat(d3.format('.2s'));
const yLoveG = g.append('g').call(yLoveAxis)
    .attr("class", "y axis love")
    .attr('transform', `translate(${innerWidth - 20}, 0)`)
    .selectAll('text')
        .style('text-anchor', 'end')
        .style('fill', '#400000');
yLoveG.attr('opacity', 0)
        .transition()
        .delay(4000)
        .duration(500)
        .style('opacity', 1)
        .transition()
            .delay(2000)
            .duration(500)
            .style('opacity', 0.5);
yLoveG.on("mouseover", function(){
            yLoveG.style('opacity', 1)})
        .on("mouseout", function(){
            yLoveG.style('opacity', 0.5)});
yLoveG.select('.domain').remove();

////////////////////////////////////
////////// Hate vs Love ////////////
////////// Tweet Number ////////////
////////////////////////////////////

var hateNumber, loveNumber, selectedDate;
var hateG = d3.selectAll(".wrapper").append("g");
var hateText = hateG.append("text")
      .attr("class", "hateText")
      .text(0)
      .style('opacity',0)
      .on("mouseover", function(){
        yHateG.style('opacity', 1);})
      .on("mouseout", function(){
        yHateG.style('opacity', 0.5);})
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
    .duration(2400);

var hateGAfter = d3.selectAll(".wrapper").append("g");
hateGAfter.append("text")
    .attr("class", "hateTextAfter")
    .text("Hate tweets on " + currentDate)
      .style('opacity',0)
      .transition()
        .delay(1000)
        .duration(500)
        .style('opacity',1);

var loveG = d3.selectAll(".wrapper").append("g");
var loveText = loveG.append("text")
      .attr("class", "loveText")
      .text(0)
      .style('opacity',0)
      .on("mouseover", function(){
        yLoveG.style('opacity', 1);})
      .on("mouseout", function(){
        yLoveG.style('opacity', 0.5);})
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
    .duration(2400);

var loveGAfter = d3.selectAll(".wrapper").append("g");
loveGAfter.append("text")
    .attr("class", "loveTextAfter")
    .text("Love tweets on " + currentDate)
      .style('opacity',0)
      .transition()
        .delay(4000)
        .duration(500)
        .style('opacity',1);

////////////////////////////////////
//////////// Date Handle ///////////
////////////////////////////////////

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
var deltaX, newX;
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
        //Get the location + data
        var location = ((innerWidth - newX)/innerWidth) * (data.length -1);
        var item = Math.round(location);
        var d1 = data[data.length -1 - item];
        hateNumber = d1.hatetweet;
        loveNumber = d1.lovetweet;
        selectedDate = formatting(d1.date);
        console.log(selectedDate, hateNumber, loveNumber);
        //Update Text
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
        .text("Love tweets on " + selectedDate);
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
        .text("Hate tweets on " + selectedDate);
        //Update Sound and Background
        soundUpdate(hateNumber, loveNumber);
        });
    dragHandler(svg.selectAll(".timeHandle"));

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
const muteIcon = d3.select(".wrapper").append("div")
    .attr("class", "sound-icon")
    .on('click', function(){
        if(muted){
            soundUpdate(hateNumber || currentHate, loveNumber || currentLove);
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

////////////////////////////////////
//////////// START BUTTON //////////
////////////////////////////////////

const StartBtn = d3.select(".wrapper").append("div")
    .attr("class", "openingModal")
    .style('opacity',1)
    .html('<img src="../images/mute-dark.svg"><p>START</p>')
    .on("mouseover", function() {
        StartBtn.style('opacity', 0.5);
    })
    .on("mouseleave", function() {
        StartBtn.style('opacity', 1);
    })
    .on("click", function() {
        soundStart(currentHate, currentLove);
        StartBtn.transition().style('opacity',0);
        StartBtn.remove();
        muteIcon.style('background', 'url(../images/mute.svg)');
        
        showNewTweets();
    });

////////////////////////////////////
/////////// SOUND CONTROL //////////
////////////////////////////////////

function soundStart(hate, love) {
    var ratio = hate+love;
    ratio = ratio.toFixed(0);
    var maxHateValue = d3.max(data, (d) => { return d.hatetweet; });
    var maxLoveValue = d3.max(data, (d) => { return d.lovetweet; });
    var minHateValue = d3.min(data, (d) => { return d.hatetweet; });
    var minLoveValue = d3.min(data, (d) => { return d.lovetweet; });
    var totalHateRange = maxHateValue - minHateValue;
    var totalLoveRange = maxLoveValue - minLoveValue;
    var uniqueHateRange = hate - minHateValue;
    var uniqueLoveRange = love - minLoveValue;
    var uniqueHatePosition = uniqueHateRange / totalHateRange;
    var uniqueLovePosition = uniqueLoveRange / totalLoveRange;
    
    var ratioHate = (hate / ratio) *30 - 30; //Volume of Hate (in range of 0 to -30)
    ratioHate = ratioHate.toFixed(1);
    var ratioLove = (love / ratio) *30 - 30; //Volume of Love (in range of 0 to -30)
    ratioLove = ratioLove.toFixed(1);

    var valueHate = 1 - (hate / maxHateValue);
    valueHate = valueHate.toFixed(1);
    var valueBigHate = uniqueHatePosition *30 -30; //Volume of Big Hate
    valueBigHate = valueBigHate.toFixed(1);
    var valueBigLove = uniqueLovePosition *30 -30; //Volume of Big Love
    valueBigLove = valueBigLove.toFixed(1);

    playerBigHate.start();
    playerBigHate.volume.rampTo(-Infinity, 1);
    playerBigLove.start();
    playerBigLove.volume.rampTo(-Infinity, 1);

    if(uniqueHatePosition > 0.5) {
        playerBigHate.volume.rampTo(1 * valueBigHate, 1);
    }
    if(uniqueLovePosition > 0.5) {
        playerBigLove.volume.rampTo(1 * valueBigLove, 1);
    }
    playerHate.playbackRate = valueHate *2;
    playerHate.volume.rampTo(ratioHate, 1);
    playerLove.volume.rampTo(ratioLove, 1);
    playerHate.start();
    playerLove.start();
    
    // bGColor(uniqueHatePosition, maxHateValue, minHateValue, uniqueLovePosition, maxLoveValue, minLoveValue);
    bGColor(uniqueHatePosition, uniqueLovePosition);
        
    console.log('ratioHate (Volume of Hate) = ' + ratioHate + '\nratioLove (Volume of Love) = ' + ratioLove + '\nvalueHate (Playback Rate of Hate) = ' + valueHate + '\nvalueBigHate (Volume of BigHate) = ' + valueBigHate + '\nvalueBigLove (Volume of BigLove) = ' + valueBigLove );

}

function soundUpdate(hate, love) {
    var ratio = hate+love;
    ratio = ratio.toFixed(0);
    var maxHateValue = d3.max(data, (d) => { return d.hatetweet; });
    var maxLoveValue = d3.max(data, (d) => { return d.lovetweet; });
    var minHateValue = d3.min(data, (d) => { return d.hatetweet; });
    var minLoveValue = d3.min(data, (d) => { return d.lovetweet; });
    var totalHateRange = maxHateValue - minHateValue;
    var totalLoveRange = maxLoveValue - minLoveValue;
    var uniqueHateRange = hate - minHateValue;
    var uniqueLoveRange = love - minLoveValue;
    var uniqueHatePosition = uniqueHateRange / totalHateRange;
    var uniqueLovePosition = uniqueLoveRange / totalLoveRange;

    var ratioHate = (hate / ratio) *30 - 30; //Volume of Hate (in range of 0 to -30)
    ratioHate = ratioHate.toFixed(1);
    var ratioLove = (love / ratio) *30 - 30; //Volume of Love (in range of 0 to -30)
    ratioLove = ratioLove.toFixed(1);

    var valueHate = 1 - (hate / maxHateValue);
    valueHate = valueHate.toFixed(1);
    var valueBigHate = uniqueHatePosition *30 -30; //Volume of Big Hate
    valueBigHate = valueBigHate.toFixed(1);
    var valueBigLove = uniqueLovePosition *30 -30; //Volume of Big Love
    valueBigLove = valueBigLove.toFixed(1);

    if(!muted) {
        if(uniqueHatePosition > 0.5) {
                playerBigHate.volume.rampTo(1 * valueBigHate, 3);
        } else {
            playerBigHate.volume.rampTo(-Infinity, 2);
        }

        if(uniqueLovePosition > 0.5) {
                playerBigLove.volume.rampTo(1 * valueBigLove, 3);
        } else {
            playerBigLove.volume.rampTo(-Infinity, 2);
        }

        playerHate.playbackRate = valueHate *2;
        // playerLove.playbackRate = 1;
        playerHate.volume.rampTo(ratioHate, 1);
        playerLove.volume.rampTo(ratioLove, 1);
        // Tone.Transport.bpm.rampTo(ratio, 1);
    } else {}
    bGColor(uniqueHatePosition, uniqueLovePosition);

    console.log('ratioHate (Volume of Hate) = ' + ratioHate + '\nratioLove (Volume of Love) = ' + ratioLove + '\nvalueHate (Playback Rate of Hate) = ' + valueHate + '\nvalueBigHate (Volume of BigHate) = ' + valueBigHate + '\nvalueBigLove (Volume of BigLove) = ' + valueBigLove );
}

////////////////////////////////////
//////// BACKGROUND COLOR //////////
////////////////////////////////////

function bGColor(hate, love) {
    var hateRGB = scale(hate, 0, 1, 100, 30);
    var loveR = scale(hate, 0, 1, 85, 135);
    var loveGB = scale(hate, 0, 1, -20, 50);
    var thisR = scale(love, 0, 1, hateRGB, (hateRGB + loveR));
    var thisGB = scale(love, 0, 1, hateRGB, (hateRGB + loveGB));
    var thisBGColor = "rgb(" + thisR + "," + thisGB + "," + thisGB + ")";
    d3.selectAll(".moodWrapper")
        .style('background', thisBGColor)
        .style('background-image', 'url("../images/45-degree-fabric-light.png")');
        console.log("rgb(" + thisR + "," + thisGB + "," + thisGB + ")");
};

function scale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
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
      .attr("fill", hateColor)
      .attr('transform', `translate(${innerWidth*randomCircle}, -100)`)
        .transition()
        .duration(2400)
        .delay(function(){return(dl + i*300*randomCircle)})
        .attr('transform', `translate(${innerWidth*randomCircle},${innerHeight+100})`)
        .ease(d3.easeLinear)
        .remove();
    }
}
function loveBubbles(dl) {
for(var i=1;i<10;i++){
    var randomCircle = Math.random();
    lovePool.append("circle")
      .attr("r", 5*i)
      .attr("fill", loveColor)
      .attr('transform', `translate(${innerWidth*randomCircle},${innerHeight+100})`)
        .transition()
        .duration(4600)
        .delay(function(){return(dl + i*300*randomCircle)})
        .attr('transform', `translate(${innerWidth*randomCircle}, -100)`)
        .ease(d3.easeQuadIn)
        .remove();
    }
}
function miniHateBubbles(max) {
    for(var i=1;i<10;i++){
        var randomCircle = Math.random();
        var bubbleX = scale(randomCircle, 0, 1, (max - 40), (max + 60));
        hatePool.append("circle")
          .attr("r", 2*i)
          .attr("fill", hateColor)
          .attr('transform', `translate(${bubbleX}, -100)`)
            .transition()
            .duration(3600)
            .delay(function(){return(i*600*randomCircle)})
            .attr('transform', `translate(${bubbleX},${innerHeight+100})`)
            .ease(d3.easeLinear)
            .remove();
        }
    }
function miniLoveBubbles(max) {
        for(var i=1;i<10;i++){
            var randomCircle = Math.random();
            var bubbleX = scale(randomCircle, 0, 1, (max - 30), (max + 70));
            lovePool.append("circle")
              .attr("r", 2*i)
              .attr("fill", loveColor)
              .attr('transform', `translate(${bubbleX},${innerHeight+100})`)
                .transition()
                .duration(4800)
                .delay(function(){return(i*770*randomCircle)})
                .attr('transform', `translate(${bubbleX}, -100)`)
                .ease(d3.easeQuadInOut)
                .remove();
            }
        }

//// New Tweets ////
var randomtiming;

function showNewTweets() {
    // The first tweets
    fetch(loveApi)
    .then(loveTweets => {return loveTweets.json()})
    .then(res => {
        var lastNumber = res.length -1;
        var latestLove = res[lastNumber].tweet;
        var latestLoveUser = res[lastNumber].twitter_handle;
        console.log(latestLove, latestLoveUser);
        loveBubbles(0); 
        loveBubbles(1000); 
        loveNewTweet(latestLove, latestLoveUser);
    })
    .then(callbackHateNewTweet())
    .catch(err => {console.log(err)});

    // The second and repeat
    setInterval(function() {
    fetch(loveApi)
    .then(loveTweets => {return loveTweets.json()})
    .then(res => {
        var lastNumber = res.length -1;
        var latestLove = res[lastNumber].tweet;
        var latestLoveUser = res[lastNumber].twitter_handle;
        console.log(latestLove, latestLoveUser);
        loveBubbles(0); 
        loveBubbles(1000); 
        loveNewTweet(latestLove, latestLoveUser);
    })
    .then(callbackHateNewTweet())
    .catch(err => {console.log(err)});
    }, 30000);

    // Hate tweet after Love tweet
    function callbackHateNewTweet() {
        randomtiming = Math.random() * 2000 - 1000;
        console.log(randomtiming);
    setTimeout(function() {
        fetch(hateApi)
        .then(hateTweets => {return hateTweets.json()})
        .then(res => {
            var lastNumber = res.length -1;
            var latestHate = res[lastNumber].tweet;
            var latestHateUser = res[lastNumber].twitter_handle;
            console.log(latestHate, latestHateUser);
            hateBubbles(0); 
            hateBubbles(1000); 
            hateNewTweet(latestHate, latestHateUser);
        })
        .catch(err => {console.log(err)});
        }, 15000 + randomtiming);
}}

function hateNewTweet(tweet, username) {
    var twitterString = tweet;
    var twitterUsername = username;
    d3.selectAll(".wrapper").append("div")
    .attr("class", "tweetLabel")
    .html("<img src='../images/hate.svg'/>")
    .style("top", "-50%")
    .style("opacity", 0.5)
    .transition()
        .duration(2600)
        .style("top", "100%")
        .style("opacity",0.1);
    d3.selectAll(".wrapper").append("div")
    .attr("class", "tweetWrap")
    .html("<h3>" + twitterString + "</h3><p><span>@" + twitterUsername + "</span>")
    .style("top", "0%")
    .style("opacity",0)
    .transition()
        .duration(1200)
        .delay(1000)
        .style("top", "50%")
        .style("opacity",1)
        .transition()
            .delay(4000)
            .duration(500)
            .style("opacity", 0)
            .remove();
    playerNewHate.start();
};

function loveNewTweet(tweet, username) {
    var twitterString = tweet;
    var twitterUsername = username;
    d3.selectAll(".wrapper").append("div")
    .attr("class", "tweetLabel")
    .html("<img src='../images/love.svg'/>")
    .style("top", "100%")
    .style("opacity",0.5)
    .transition()
        .duration(2600)
        .style("top", "-50%")
        .style("opacity", 0);
    d3.selectAll(".wrapper").append("div")
    .attr("class", "tweetWrap")
    .html("<h3>" + twitterString + "</h3><p><span>@" + twitterUsername + "</span>")
    .style("top", "100%")
    .style("opacity",0)
    .transition()
        .duration(1200)
        .delay(1000)
        .style("top", "50%")
        .style("opacity",1)
        .transition()
            .delay(4000)
            .duration(500)
            .style("opacity", 0)
            .remove();
    playerNewLove.start();
};

        setInterval(function() {
            var maxHAll = d3.max(data, (d) => { return d.hatetweet; });
            var posObj = data.filter(e => e.hatetweet===maxHAll);
            var pos = d3.selectAll(".hatePool").append("circle")
            .attr("height", 2)
            .attr("width", 2)
            .attr("cx", xScale(posObj[0].date));
            var posX = pos._groups[0][0].cx.animVal.value
        
            miniHateBubbles(posX);
            }, 11111);
        
        setInterval(function() {
            var maxLAll = d3.max(data, (d) => { return d.lovetweet; });
            var posObj = data.filter(e => e.lovetweet===maxLAll);
            var pos = d3.selectAll(".lovePool").append("circle")
            .attr("height", 2)
            .attr("width", 2)
            .attr("cx", xScale(posObj[0].date));
            var posX = pos._groups[0][0].cx.animVal.value
        
            miniLoveBubbles(posX);
            }, 7777); 

});
