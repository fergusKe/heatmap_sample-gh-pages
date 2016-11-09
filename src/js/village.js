// (function($) {

  $(function() {
    getData(setChart);
  });

  /*案件類型直條圖*/
  function setChart(pData, pTaipeiAreaObj) {
    // console.log('pData = ', pData);
    // console.log('pTaipeiAreaObj = ', pTaipeiAreaObj);
    $('.nav-title3-list li').click(function(e) {
      e.preventDefault();
      console.log('aa', $(this).text());
    });

    console.log('pTaipeiAreaObj[全部] = ', pTaipeiAreaObj['全部']);
    var index = 0;
    var village;
    for ( var i = 0; i < TaipeiAreaObj['全部'].length; i++ ) {
        if (pTaipeiAreaObj['全部'][i].properties.Substitute == '西門里') {
          index = i;
        }
        // j_navVillageCont.append( "<li><a href=\"village.html\">" + name + "</a></li>" );
    }
    village = pTaipeiAreaObj['全部'][index];

    console.log('village = ', village);


    var index;
    if (locationType == 'all' || locationType == undefined) {
      for (var i = 0; i < pData.length; i++) {
        if (pData[i]['案件類型'] === '全部案件類型') {
          index = i;
        }
      }
    } else if (locationType == 'old') {
      for (var i = 0; i < pData.length; i++) {
        if (pData[i]['案件類型'] === '老人保護') {
          index = i;
        }
      }
    } else if (locationType == 'children') {
      for (var i = 0; i < pData.length; i++) {
        if (pData[i]['案件類型'] === '兒少保護') {
          index = i;
        }
      }
    } else if (locationType == 'intimate') {
      for (var i = 0; i < pData.length; i++) {
        if (pData[i]['案件類型'] === '親密關係') {
          index = i;
        }
      }
    }

    chartGender(pData[index]);
    chartAge(pData[index]);

  }
  function chartGender(pData) {
    var data = [
      {type: '男', value: +pData['男'].replace("%", "")},
      {type: '女', value: +pData['女'].replace("%", "")}
    ]
    var width = 130,
        height = 140,
        margin = {left: 50, top: 30, right: 30, bottom: 30},
        svg_width = width + margin.left + margin.right,
        svg_height = height + margin.top + margin.bottom;

    var scale = d3.scale.linear()
      .domain([0, d3.max(data, function(d) {return d.value;})])
      .range([height, 0]);

    var scale_x = d3.scale.ordinal()
      .domain(data.map(function(d) {return d.type;}))
      .rangeBands([0, width], 0.5);

    var svg = d3.select(".chart-cont")
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
        return "translate(" + scale_x(d.type) + ", 0)";
      });

    bar.append("rect")
      .attr({
        "y": function(d) {return scale(d.value)},
        "width": scale_x.rangeBand(),
        "height": function(d) {return height - scale(d.value)}
      })
      .style("fill", "#489de4");

    bar.append("text")
      .text(function(d) {return d.value})
      .attr({
        "y": function(d) {return scale(d.value)},
        "x": scale_x.rangeBand()/2,
        "dy": -5,
        "text-anchor": "middle"
      });
  }
  function chartAge(pData) {
      var data = [
        {type: '~18', value: +pData['小於18歲'].replace("%", "")},
        {type: '18~65', value: +pData['18到65歲'].replace("%", "")},
        {type: '65~', value: +pData['大於65歲'].replace("%", "")}
      ];

      var width = 130,
        height = 140,
        margin = {left: 50, top: 30, right: 30, bottom: 30},
        svg_width = width + margin.left + margin.right,
        svg_height = height + margin.top + margin.bottom;

      var scale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {return d.value;})])
        .range([height, 0]);

      var scale_x = d3.scale.ordinal()
        .domain(data.map(function(d) {return d.type;}))
        .rangeBands([0, width], 0.3);

      var svg = d3.select(".chart-cont2")
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
          return "translate(" + scale_x(d.type) + ", 0)";
        });

      bar.append("rect")
        .attr({
          "y": function(d) {return scale(d.value)},
          "width": scale_x.rangeBand(),
          "height": function(d) {return height - scale(d.value)}
        })
        .style("fill", "#489de4");

      bar.append("text")
        .text(function(d) {return d.value})
        .attr({
          "y": function(d) {return scale(d.value)},
          "x": scale_x.rangeBand()/2,
          "dy": -5,
          "text-anchor": "middle"
        });
    }

// })(jQuery)
