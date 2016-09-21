(function($) {
  $(function() {
    var w = 800;
    var h = 600;
    // var value = {
    //   "臺北市": 9952.60,
    //   "嘉義市": 4512.66,
    //   "新竹市": 4151.27,
    //   "基隆市": 2809.27,
    //   "新北市": 1932.91,
    //   "桃園市": 1692.09,
    //   "臺中市": 1229.62,
    //   "彰化縣": 1201.65,
    //   "高雄市": 942.97,
    //   "臺南市": 860.02,
    //   "金門縣": 847.16,
    //   "澎湖縣": 802.83,
    //   "雲林縣": 545.57,
    //   "連江縣": 435.21,
    //   "新竹縣": 376.86,
    //   "苗栗縣": 311.49,
    //   "屏東縣": 305.03,
    //   "嘉義縣": 275.18,
    //   "宜蘭縣": 213.89,
    //   "南投縣": 125.10,
    //   "花蓮縣": 71.96,
    //   "臺東縣": 63.75
    // };


    var svg = d3.select(".map")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    //Define map projection
    var projection = d3.geoMercator()
                      .center([121.5902,25.08112])
                      .scale(130000); // 座標變換函式

    //Define path generator
    var path = d3.geo.path()
             .projection(projection);

    var color = d3.scale.linear().domain([0,100]).range(["#090","#f00"]);

    var tooltip = d3.select('.tooltip');
    
    d3.json("county.json", function(topodata) {
      d3.csv("mapInfo.csv", function(mapInfo) {
        // console.log('mapInfo = ', mapInfo);
        var result = {};
        var caseCategory = "各里總案件數";
        var TaipeiVillageArr = [];
        var village;

        for(var i = 0 ; i < mapInfo.length - 1; i++){
          village = mapInfo[i]["里"];
          if(village){
            // console.log('village = ', village);
            village = village.replace("台","臺");
            result[village] = result[village] || {};
            result[village]["兄弟姊妹間暴力"] = mapInfo[i]["兄弟姊妹間暴力"].replace("%", "") || 0;
            result[village]["老人保護"] = mapInfo[i]["老人保護"].replace("%", "") || 0;
            result[village]["兒少保護"] = mapInfo[i]["兒少保護"].replace("%", "") || 0;
            result[village]["親密關係"] = mapInfo[i]["親密關係"].replace("%", "") || 0;
            result[village]["其他家虐"] = mapInfo[i]["其他家虐"].replace("%", "") || 0;
            result[village]["低收"] = mapInfo[i]["低收"].replace("%", "") || 0;
            result[village]["障礙"] = mapInfo[i]["障礙"].replace("%", "") || 0;
            result[village]["各里總案件數"] = mapInfo[i]["各里總案件數"].replace("%", "") || 0;
            // if ( village.substring(village.indexOf('市') + 1, village.indexOf('區') + 1) == '大安區' ) {
              // villageArr.push(result[village])
              // console.log('dd = ', result[village]);
            // }
          }
        }
        // console.log('result = ', result);
        // console.log('village = ', village);

        var features = topojson.feature(topodata, topodata.objects["Village_NLSC_121_1050715"]).features;
        // console.log('features = ', features);
        d3.select("svg")
          .selectAll("path")
          .data(features)
          .enter()
          .append("path")
          .attr("d",path);

        

        features = features.map(function(f) {
          if(result[f.properties.C_Name + f.properties.T_Name + f.properties.V_Name]) {
            // console.log('result = ', result[f.properties.C_Name + f.properties.T_Name + f.properties.V_Name]["兄弟姊妹間暴力"]);
            f["兄弟姊妹間暴力"] = result[f.properties.C_Name + f.properties.T_Name + f.properties.V_Name]["兄弟姊妹間暴力"] || 0;
            f["老人保護"] = result[f.properties.C_Name + f.properties.T_Name + f.properties.V_Name]["老人保護"] || 0;
            f["兒少保護"] = result[f.properties.C_Name + f.properties.T_Name + f.properties.V_Name]["兒少保護"] || 0;
            f["親密關係"] = result[f.properties.C_Name + f.properties.T_Name + f.properties.V_Name]["親密關係"] || 0;
            f["其他家虐"] = result[f.properties.C_Name + f.properties.T_Name + f.properties.V_Name]["其他家虐"] || 0;
            f["低收"] = result[f.properties.C_Name + f.properties.T_Name + f.properties.V_Name]["低收"] || 0;
            f["障礙"] = result[f.properties.C_Name + f.properties.T_Name + f.properties.V_Name]["障礙"] || 0;
            f["各里總案件數"] = result[f.properties.C_Name + f.properties.T_Name + f.properties.V_Name]["各里總案件數"] || 0;
            TaipeiVillageArr.push(f);
          } else {
            f["兄弟姊妹間暴力"] = 0;
            f["老人保護"] = 0;
            f["兒少保護"] = 0;
            f["親密關係"] = 0; 
            f["其他家虐"] = 0;
            f["低收"] = 0;
            f["障礙"] = 0;
            f["各里總案件數"] = 0;      
          }
        });
        // console.log('features2 = ', features);
        console.log('TaipeiVillageArr = ', TaipeiVillageArr);
        // var TaipeiVillage = features.map(function(f) {
        // C_Name
        // for( idx = features.length - 1; idx >= 0; idx-- ) {
        //   // features[idx].value = mapInfo[features[idx]]["里"];
        //   console.log('mapInfo[idx] = ', mapInfo[idx]["里"]);
        // }

        updateMap(caseCategory);

        $(".caseCategory").change(function() {
          // console.log('value = ', $(this).val());
          caseCategory = $(this).val();
          if ( caseCategory == '案件類型') return;
          updateMap(caseCategory);
        });
        $(".area").change(function() {
          console.log('value = ', $(this).val());
          // caseCategory = $(this).val();
          // updateMap(caseCategory);
        });
      });
      

      function updateMap(caseCategory) {
        d3.select("svg")
          .selectAll("path")
          // .transition()
          .attr({
          // "d": path,
          "fill": function (d) { 
            // console.log('d = ', d);
            return color(d[caseCategory]); 
          }
        })
        .on("mouseover", function(d) {
          $("#area").text(d.properties.T_Name + " " + d.properties.V_Name);
          if (caseCategory == "各里總案件數") {
            $("#value").text("總案件數 " + d[caseCategory] + "件");
          } else {
            $("#value").text(d[caseCategory] + "%");
          }

          var mouse = d3.mouse(svg.node()).map(function(d) {
              return parseInt(d);
          });
          tooltip.classed('hidden', false)
                .attr('style', 'left:' + (mouse[0] + 10) +
                        'px; top:' + (mouse[1] + 30) + 'px');
        }).on('mouseout', function() {
          tooltip.classed('hidden', true);
        });
      }
      // d3.selectAll("path")
      //   .data(topodata.features)
      //   .enter()
      //   .append("path")
      //   .attr("d", path);

        
        // d3.select(".area svg").selectAll("path").data(features)
        //   .enter().append("path").attr("d",path).attr("fill",function(d) {
        //     return color(d.value);
        //   })
        //   .attr("d", path )  
        //   .on("mouseover",function(d, i){ 
        //       $(".name").text(d.properties.T_Name);
        //       $(".value").text(d.value);
        //       d3.select(this)  
        //         .attr("fill","#0864AD");

        //       //Get this bar's x/y values, then augment for the tooltip
        //       var xPosition = parseFloat(d3.select(this).attr("x"));
        //       var yPosition = parseFloat(d3.select(this).attr("y"));

        //       //Update the tooltip position and value
        //       d3.select(".tooltip")
        //         .style("left", 300 + "px")
        //         .style("top", 30 + "px")           
        //         .select("#value")
        //         .text(d);
             
        //       //Show the tooltip
        //       d3.select(".tooltip").classed("hidden", false);
        //   })  
        //   .on("mouseout",function(d,i){  
        //       d3.select(this)  
        //         .attr("fill",function(d) {
        //           return color(d.value);
        //         })
        //       //Hide the tooltip
        //       d3.select(".tooltip").classed("hidden", true);
        //   });

          //Load in cities data
          // d3.csv("TaipeiPoliceDepartment.csv", function(data) {
          //   // console.log('data = ', data);
          //   d3.select(".area svg").selectAll("circle")
          //      .data(data)
          //      .enter()
          //      .append("circle")
          //      .attr("cx", function(d) {
          //        d.lat_lon = d.lat_lon.split(',');
          //        return projection([d.lat_lon[1], d.lat_lon[0]])[0];
          //      })
          //      .attr("cy", function(d) {
          //        return projection([d.lat_lon[1], d.lat_lon[0]])[1];
          //      })
          //      .attr("r", function(d) {
          //       return 2;
          //      })
          //      .style("fill", "yellow")
          //      .style("opacity", 0.75);
          // });
    });

    // Statistics Chart
    d3.csv("statistics.csv", type, function(data) {
      console.log(data)
      var width = 400,
          height = 160,
          margin = {left: 50, top: 30, right: 30, bottom: 30},
          // svg_width = width + margin.left + margin.right,
          // svg_height = height + margin.top + margin.bottom,
          svg_width = 450,
          svg_height = 250
          ;

      var scale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {return d.value;})])
        .range([height, 0]);

      var scale_x = d3.scale.ordinal()
        .domain(data.map(function(d) {return d.type;}))  // 影片有錯，是year，不是population
        .rangeBands([0, width], 0.1);

      var svg = d3.select(".distribution-Statistics")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height);

      var chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      var x_axis = d3.svg.axis().scale(scale_x);
        y_axis = d3.svg.axis().scale(scale).orient("left").ticks(5);

      chart.append("g")
        .call(x_axis)
        .attr("transform", "translate(0, " + height + ")");
      chart.append("g")
        .call(y_axis);

      var bar = chart.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) {
          // console.log('scale_x(d.type) = ', scale_x(d.type));
          return "translate(" + scale_x(d.type) + ", 0)";
        });

      bar.append("rect")
        .attr({
          "y": function(d) {return scale(d.value)},
          "width": scale_x.rangeBand(),
          "height": function(d) {return height - scale(d.value)}
        })
        .style("fill", "steelblue");

      bar.append("text")
        .text(function(d) {return d.value})
        .attr({
          "y": function(d) {return scale(d.value)},
          "x": scale_x.rangeBand()/2,
          "dy": -5,
          "text-anchor": "middle"
        })



      // tempppppp
      var svg = d3.select(".distribution-Statistics2")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height);

      var chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      var x_axis = d3.svg.axis().scale(scale_x);
        y_axis = d3.svg.axis().scale(scale).orient("left").ticks(5);

      chart.append("g")
        .call(x_axis)
        .attr("transform", "translate(0, " + height + ")");
      chart.append("g")
        .call(y_axis);

      var bar = chart.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) {
          // console.log('scale_x(d.type) = ', scale_x(d.type));
          return "translate(" + scale_x(d.type) + ", 0)";
        });

      bar.append("rect")
        .attr({
          "y": function(d) {return scale(d.value)},
          "width": scale_x.rangeBand(),
          "height": function(d) {return height - scale(d.value)}
        })
        .style("fill", "steelblue");

      // bar.append("text")
      //   .text(function(d) {return d.value})
      //   .attr({
      //     "y": function(d) {return scale(d.value)},
      //     "x": scale_x.rangeBand()/2,
      //     "dy": -5,
      //     "text-anchor": "middle"
      //   })




        // type2
      //   var width = 400,
      //     height = 160,
      //     margin = {left: 50, top: 30, right: 30, bottom: 30},
      //     // svg_width = width + margin.left + margin.right,
      //     // svg_height = height + margin.top + margin.bottom,
      //     svg_width = 200,
      //     svg_height = 450
      //     ;

      // var scale = d3.scale.linear()
      //   .domain([0, d3.max(data, function(d) {return d.value;})])
      //   .range([0, width]);

      // var scale_y = d3.scale.ordinal()
      //   .domain(data.map(function(d) {return d.type;}))  // 影片有錯，是year，不是population
      //   .rangeBands([0, height], 0.1);

      // var svg = d3.select(".distribution-Statistics2")
      //   .append("svg")
      //   .attr("width", svg_width)
      //   .attr("height", svg_height);

      // var chart = svg.append("g")
      //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      // // var x_axis = d3.svg.axis().scale(scale_x);
      // //   y_axis = d3.svg.axis().scale(scale).orient("left").ticks(5);
      // var x_axis = d3.svg.axis().scale(scale).ticks(5);
      //   y_axis = d3.svg.axis().scale(scale_y);

      // chart.append("g")
      //   .call(x_axis);
      //   // .attr("transform", "translate(0, " + height + ")")
      // chart.append("g")
      //   .call(y_axis);

      // var bar = chart.selectAll(".bar")
      //   .data(data)
      //   .enter()
      //   .append("g")
      //   .attr("class", "bar")
      //   .attr("transform", function(d, i) {
      //     // console.log('scale_x(d.type) = ', scale_x(d.type));
      //     return "translate(0, " + scale_y(d.type) + ")";
      //   });

      // bar.append("rect")
      //   .attr({
      //     // "y": function(d) {return scale(d.value)},
      //     "width": function(d) {return height - scale(d.value)},
      //     "height": scale_y.rangeBand()
      //   })
      //   .style("fill", "steelblue");

      // bar.append("text")
      //   .text(function(d) {return d.value})
      //   .attr({
      //     "y": function(d) {return scale(d.value)},
      //     "x": scale_x.rangeBand()/2,
      //     "dy": -5,
      //     "text-anchor": "middle"
      //   })



    });
    function type(d) {
      d.value = +d.value;
      return d;
    }


    // Radar Chart
    RadarChart.defaultConfig.color = function() {};
    RadarChart.defaultConfig.radius = 3;
    var data = [
      {
        className: 'village', // optional can be used for styling
        axes: [
          {axis: "兄弟姊妹間暴力", value: 13}, 
          {axis: "老人保護", value: 6}, 
          {axis: "兒少保護", value: 5},  
          {axis: "親密關係", value: 9},  
          {axis: "其它", value: 2}
        ]
      },
      {
        className: 'average',
        axes: [
          {axis: "兄弟姊妹間暴力", value: 6}, 
          {axis: "老人保護", value: 7}, 
          {axis: "兒少保護", value: 10},  
          {axis: "親密關係", value: 13},  
          {axis: "其它", value: 9}
        ]
      }
    ];
    function randomDataset() {
      return data.map(function(d) {
        return {
          className: d.className,
          axes: d.axes.map(function(axis) {
            return {axis: axis.axis, value: Math.ceil(Math.random() * 100)};
          })
        };
      });
    }
    // var chart = RadarChart.chart();
    // var cfg = chart.config({w: 268, h: 268}); // retrieve default config
    // var svg = d3.select('.panel-body div.chart').append('svg')
    //   .attr('width', 268)
    //   .attr('height', 268);
    // svg.append('g').classed('single', 1).datum(randomDataset()).call(chart);
  });
})(jQuery)