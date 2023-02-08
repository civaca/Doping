document.addEventListener("DOMContentLoaded",()=>{

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
.then(result=>result.json())
.then(x=> {const dataset=x;
//creating SVG
const w=1000;
const h=500;
const padding=40;
const r=7;

const svg=d3.select("body")
            .append("svg")
            .attr("width",w)
            .attr("height",h)
            .style("background-color","acua")
//scales
const xScale=d3.scaleTime()
    .domain([d3.timeParse("%Y")("1993"), d3.max(dataset, d=>d3.timeParse("%Y")(d["Year"]))])
    .range([padding,w-padding])
const yScale=d3.scaleTime()
    .domain([d3.min(dataset, d=>d3.timeParse("%M:%S")(d["Time"])), d3.max(dataset, d=>d3.timeParse("%M:%S")(d["Time"]))])
    .range([padding,h-padding-r])
//tooltip
const tooltip=d3.select("body")
                    .append("div")
                    .attr("id","tooltip")

//axis 
const xAxis=d3.axisBottom(xScale);
const yAxis=d3.axisLeft(yScale).tickFormat((d)=> d3.timeFormat("%M"+":"+"%S")(d))
console.log(dataset[dataset.length-1]["Doping"])

//scatterplot
        svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx",(d)=>xScale(d3.timeParse("%Y")(d["Year"])))
        .attr("cy",d=>yScale(d3.timeParse("%M:%S")(d["Time"])))
        .attr("r",r)
        .attr("class","dot")
        .attr("data-xvalue",(d)=>d3.timeParse("%Y")(d["Year"]))
        .attr("data-yvalue", d=>d3.timeParse("%M:%S")(d["Time"]))
        .attr("fill",(d)=>{
            if(d["Doping"]==""){
                return "rgba(239, 131, 84,0.9)"
            } else{
                return "rgba(25, 100, 126,0.5)"
            }
        })
        
        .on("mouseover",(event,d)=>{
        tooltip.transition().duration(100)
        .style("visibility","visible")
        .style("top",event.clientY+"px")
        .style("left",event.clientX+"px")
        .attr("data-year",d3.timeParse("%Y")(d["Year"]))
        .text(d["Name"]+" "+d["Doping"])           
        })
        .on("mouseout",(event,d)=>{
            tooltip.style("visibility","hidden")
        })
//Axis
        svg.append("g")
        .attr("transform","translate(0,"+(h-padding)+")")
        .call(xAxis)
        .attr("id","x-axis")

        svg.append("g")
        .attr("transform", "translate("+padding+",0)")
        .call(yAxis)
        .attr("id","y-axis")
//legend
       let leg= d3.select("body")
        .append("div")
        .attr("id","legend")

       let leg1=leg.append("div").attr("class","leg")
       leg1.append("div").attr("class","colors").attr("id","doping")
       leg1.append("div").attr("class","legs").text("Riders with doping allegations")

       let leg2=leg.append("div").attr("class","leg")
       leg2.append("div").attr("class","colors").attr("id","noDoping")
       leg2.append("div").attr("class","legs").text("No doping allegations")    
     
    })//Closing fetching
})//Closing ContentLoaded