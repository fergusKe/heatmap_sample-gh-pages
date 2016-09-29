(function($) {
  $(function() {
    var w = 500;
    var h = 700;
    var TaipeiAreaArr = ["士林區", "文山區", "內湖區", "北投區", "中山區", "大安區", "信義區", "萬華區", "松山區", "大同區", "南港區", "中正區"];

    var svg = d3.select(".map")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    //Define map projection
    var projection = d3.geoMercator()
                      .center([121.6602,25.12112])
                      .scale(130000); // 座標變換函式

    //Define path generator
    var path = d3.geo.path()
             .projection(projection);

    var color = d3.scale.linear().domain([0,100]).range(["#090","#f00"]);

    var tooltip = d3.select('.tooltip');
    
    d3.json("data/county.json", function(topodata) {
      d3.csv("data/mapInfo.csv", function(mapInfo) {
        // console.log('mapInfo = ', mapInfo);
        var result = {};
        var caseCategory = "各里總案件數";
        var TaipeiVillageArr = [];
        var village;
        var temp = [];
        for (var i = 0 ; i < mapInfo.length - 1; i++) {
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
            // if ( village.substring(village.indexOf('市') + 1, village.indexOf('區') + 1) == '萬華區' ) {
            //   // villageArr.push(result[village])
            //   console.log('village = ', village);
            //   temp.push(village);
            //   console.log('temp.length = ', temp.length);
            // }
          }
        }
        // console.log('result = ', result);
        // console.log('village = ', village);
        
        var villageTopojson = topojson.feature(topodata, topodata.objects["Village_NLSC_121_1050715"]);
        var features = villageTopojson.features;
        // console.log('features = ', features);
        
        features = features.map(function(f) {
          // if (f.properties.T_Name == TaipeiAreaArr) {
          //   temp.push(f.properties.V_Name);
          // }
          // mapInfo[i]["里"]
          
          // console.log('f.T_Name = ', f.properties.T_Name);
          // if ( village.substring(village.indexOf('市') + 1, village.indexOf('區') + 1) == '中正區' ) {

          // }
          if ( f.properties.C_Name === "臺北市" && checkAvailability(TaipeiAreaArr, f.properties.T_Name) ) {
            TaipeiVillageArr.push(f);
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
          }
          
        });
        // console.log('TaipeiVillageArr = ', TaipeiVillageArr);
        // console.log('TaipeiVillageArr.length = ', TaipeiVillageArr.length);
        features = TaipeiVillageArr;
        villageTopojson.features = TaipeiVillageArr;
        console.log('TaipeiVillageArr = ', TaipeiVillageArr);
        console.log('villageTopojson = ', villageTopojson);

        var taipeiStatesData = topojson.feature(topodata, topodata.objects["Village_NLSC_121_1050715"]);

        // console.log('statesData = ', statesData);
        // console.log('taipeiStatesData = ', taipeiStatesData);

      // var map = L.map('map').setView([37.8, -96], 4);
      var map = L.map('map').setView([25.09112, 121.5502], 11);

      // https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamluZ3RhaSIsImEiOiJjaXRqaWo4aHAwOG8zMm9ta2VreXZndGF3In0.hyQPm7h5ntK-AlLJuYKYhw
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.light'
      }).addTo(map);


      // control that shows state info on hover
      var info = L.control();

      info.onAdd = function (map) {
       this._div = L.DomUtil.create('div', 'info');
       this.update();
       return this._div;
      };

      info.update = function (props) {
        console.log('props = ', props);
       this._div.innerHTML = '<h4>台北市熱區地圖</h4>' +  (props ?
         '<b>台北市 ' + props.properties.V_Name + '</b><br />' + '案件數：' + props.thisValue
         : 'Hover over a state');
      };

      info.addTo(map);

      /*切換行政區*/
      $(".caseCategory").change(function() {
        // console.log('value = ', $(this).val());
        caseCategory = $(this).val();
        if ( caseCategory == '案件類型') return;
        // typeOfCases = "全部";
        // style(features, caseCategory);
        // updateMap(caseCategory);
        // console.log('features = ', features);
        // geojson.resetStyle(villageTopojson);
        // geojson.setStyle();
        // geojson = L.geoJson(villageTopojson, {
        //   style: style,
        //   onEachFeature: onEachFeature
        // });
        // $('.leaflet-pane.leaflet-overlay-pane *').remove();
        // geojson = L.geoJson(villageTopojson, {
        //   style: function (feature) {
        //     console.log('feature = ', feature);
        //       return {
        //         weight: 2,
        //         opacity: 1,
        //         color: 'white',
        //         dashArray: '3',
        //         fillOpacity: 0.7,
        //         fillColor: getColor(feature["親密關係"])
        //       };
        //   },
        //   onEachFeature: onEachFeature
        // }).addTo(map);
      });


      // get color depending on population density value
      function getColor(d) {
        return d > 80 ? '#a50f15' :
               d > 60  ? '#de2d26' :
               d > 40  ? '#fb6a4a' :
               d > 20  ? '#fcae91' :
                          '#fee5d9';
      }
      // typeOfCases = "全部";
      function style(features, typeOfCases) {
        // console.log('style = ', features);
        // console.log('typeOfCases = ', typeOfCases);
        if (typeOfCases == undefined) {
          features.thisValue = +features["各里總案件數"];
        } else {
          features.thisValue = +features[typeOfCases];
        }
        
        // console.log('typeOfCases = ', typeOfCases);
        
        return {
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7,
          fillColor: getColor(features.thisValue)
        };
      }

      function highlightFeature(e) {
       var layer = e.target;

       layer.setStyle({
         weight: 5,
         color: '#666',
         dashArray: '',
         fillOpacity: 0.7
       });

       if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
         layer.bringToFront();
       }
       console.log('layer.feature = ', layer.feature);
       // layer.feature.thisValue = +layer.feature["兒少保護"];
       info.update(layer.feature);
      }

      var geojson;

      function resetHighlight(e) {
        console.log('e.target = ', e.target);
       geojson.resetStyle(e.target);
       info.update();
      }

      function zoomToFeature(e) {
       map.fitBounds(e.target.getBounds());
      }

      function onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
        });
      }

      // geojson = L.geoJson(villageTopojson, {
      //   style: style,
      //   onEachFeature: onEachFeature
      // }).addTo(map);

      // geojson = L.geoJson(villageTopojson, {
      //   style: function (feature) {
      //     console.log('feature = ', feature);
      //       return {
      //         weight: 2,
      //         opacity: 1,
      //         color: 'white',
      //         dashArray: '3',
      //         fillOpacity: 0.7,
      //         fillColor: getColor(feature["各里總案件數"])
      //       };
      //   },
      //   onEachFeature: onEachFeature
      // }).addTo(map);

      map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


      var legend = L.control({position: 'bottomright'});

      legend.onAdd = function (map) {

       var div = L.DomUtil.create('div', 'info legend'),
         grades = [0, 20, 40, 60, 80, 100],
         labels = [],
         from, to;

       for (var i = 0; i < grades.length - 1; i++) {
         from = grades[i];
         to = grades[i + 1];

         labels.push(
           '<i style="background:' + getColor(from + 1) + '"></i> ' +
           from + (to ? '&ndash;' + to : '+'));
       }

       div.innerHTML = labels.join('<br>');
       return div;
      };

      legend.addTo(map);

      });


    });

    function checkAvailability(arr, val) {
      return arr.some(function(arrVal) {
        return val === arrVal;
      });
    }

    // Statistics Chart
    d3.csv("data/statistics.csv", stringToNum, function(data) {
      // console.log(data)
      var width = 400,
          height = 160,
          margin = {left: 50, top: 30, right: 30, bottom: 30},
          svg_width = width + margin.left + margin.right,
          svg_height = height + margin.top + margin.bottom;
          // svg_width = 450,
          // svg_height = 250

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

        // type2
        var width = 300,
          height = 400,
          margin = {left: 110, top: 30, right: 30, bottom: 30},
          svg_width = width + margin.left + margin.right,
          svg_height = height + margin.top + margin.bottom;

      var scale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {return d.value;})])
        .range([0, width]);

      var scale_y = d3.scale.ordinal()
        .domain(data.map(function(d) {return d.type;}))  // 影片有錯，是year，不是population
        .rangeBands([0, height], 0.1);

      var svg = d3.select(".distribution-Statistics2")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height);

      var chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      // var x_axis = d3.svg.axis().scale(scale_x);
      //   y_axis = d3.svg.axis().scale(scale).orient("left").ticks(5);
      var x_axis = d3.svg.axis().scale(scale).ticks(5);
        y_axis = d3.svg.axis().scale(scale_y).orient("left");

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
          return "translate(0, " + scale_y(d.type) + ")";
        });

      bar.append("rect")
        .attr({
          // "y": function(d) {return scale(d.value)},
          "width": function(d) {return scale(d.value)},
          "height": scale_y.rangeBand()
        })
        .style("fill", "steelblue");

      // bar.append("text")
      //   .text(function(d) {return d.value})
      //   .attr({
      //     "x": function(d) {return scale(d.value)},
      //     "y": scale_y.rangeBand()/2,
      //     "dy": 7,
      //     "text-anchor": "end"
      //   })
    });
    function stringToNum(d) {
      d.value = +d.value;
      return d;
    }


    /*nav*/
    $('.nav-sub').on('mouseenter', function() {
      var index = $(this).index();
      console.log('index = ', index);
      $('.nav-list').css({
        display: 'none'
      });
      $('.nav-list').eq(index).css({
        display: 'block'
      })
    });
    $('.nav-sub').on('mouseout', function() {
      $('.nav-list').css({
        display: 'none'
      });
    });
  });
})(jQuery)