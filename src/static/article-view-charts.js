let resulution = "width:960px; height:540px;"
//let resulution = "width:1920px; height:1080px;"


// returns chart
function create_pie_plot(key, names, mentioned, colour, parentFromChart, article)
{
    while(parentFromChart.firstChild)
    {
        parentFromChart.removeChild(parentFromChart.firstChild);
    }

    let div = document.createElement("div");
    div.setAttribute("id", "plt;pie;" + key);
	div.className = "pie-plot";
    div.setAttribute("style", resulution);
    div.setAttribute("article", article)

    parentFromChart.appendChild(div);

    // based on prepared DOM, initialize echarts instance
    var myChart = echarts.init(div);

    // myChart.resize(width="960px", height="540px")

    let array = [];
    let i = 0;
    names.forEach( name => {
        let dict = {};
        dict["value"] = mentioned[i];
        dict["name"] = name;
        i++;
        array.push(dict);
    })

    // specify chart configuration item and data
    let option = {
        title: {
            text: 'Entities from ' + key,
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            show: false,
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: key,
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold',
                        color: '#000'
                    }
                },
                labelLine: {
                    show: false
                },
                color: colour,
                data: array
            }
        ],
		responsive: true,
		maintainAspectRatio: false
    };
    // use configuration item and data specified to show chart
    myChart.setOption(option);

    return myChart;
}

function create_text_pie_plot(key, names, mentioned, parentFromChart)
{
    let div = document.createElement("div");
    div.setAttribute("id", "plt;pie;" + key);
	div.className = "text-pie-plot";
    div.setAttribute("style", resulution);

    while(parentFromChart.firstChild)
    {
        parentFromChart.removeChild(parentFromChart.firstChild);
    }
    parentFromChart.appendChild(div);
    // based on prepared DOM, initialize echarts instance
    var myChart = echarts.init(div);

    let array = [];
    let i = 0;
    names.forEach( name => {
        let dict = {};
        dict["value"] = mentioned[i];
        dict["name"] = name;
        i++;
        array.push(dict);
    })

    // specify chart configuration item and data
    let option = {
        title: {
            text: 'Entities from ' + key,
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            show: false,
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: key,
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: array
            }
        ],
		responsive: true,
		maintainAspectRatio: false
    };
    // use configuration item and data specified to show chart
    myChart.setOption(option);

    return myChart;
}

// creates the Plot for the entities
function create_treemap(entity_name, /*data_array*/data, parentFromChart)
{
    let div = document.createElement("div");
    div.setAttribute("id", "plt;pie;" + entity_name);
	div.className = "tree-map";
    div.setAttribute("style", resulution);

    while(parentFromChart.firstChild)
    {
        parentFromChart.removeChild(parentFromChart.firstChild);
    }
    parentFromChart.appendChild(div);

    var myChart = echarts.init(div);

    let option = {
        title: {
            text: 'how ' + entity_name + ' is mentioned',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        series: [{
            type: 'treemap',
            data: data
        }]
    };

    myChart.setOption(option);

}

function create_bar_plot(key, names, mentioned, colour, parentElement)
{
    while(parentElement.firstChild)
    {
        parentElement.removeChild(parentElement.firstChild);
    }

    let div = document.createElement("div");
    div.className = "bar-plot";
	div.setAttribute("style", resulution);
    parentElement.appendChild(div);
	

    let myChart = echarts.init(div);
	let data = [];
	for (let [i, mention] of mentioned.entries())
	{
		let entry = {
			value: mention,
			itemStyle: {color: colour[i]}
		}
		data.push(entry);
	}
    let option = {
        title: {
            text: key,
            left: 'center'
        },
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		animation: false,
		dataZoom: [{
			type: 'slider',
			xAxisIndex: 0,
			zoomLock: true,
			start: 0,
			end: 35,
			handleSize: 0,
			height: 10
		}],
        xAxis: {
            type: 'category',
			data: names,
			axisLabel: {
				interval: 0,
				rotate: 25
			},
			axisTick: {
				alignWithLabel: true
			}
        },
        yAxis: {
            type: 'value'
        },
        series: [{
			data: data,
            type: 'bar'
        }]
    };
    myChart.setOption(option);


    return myChart;
}

function create_scatter_plot(key, names, mentioned, colour, phrasing_complexity, parentElement)
{
    let series = [];
    for(let i in names)
    {
        let dict = {};
        dict["name"] = names[i];
        dict["type"] = "scatter";
        dict["symbolSize"] = 20;
        dict["data"] = [[Math.sqrt(mentioned[i]), Math.sqrt(phrasing_complexity[i])]];
        dict["itemStyle"] =  {color: colour[i]}
        
        series.push(dict);
    }

    console.log(series);

    while(parentElement.firstChild)
    {
        parentElement.removeChild(parentElement.firstChild);
    }

    let div = document.createElement("div");
    div.className = "bar-plot";
	div.setAttribute("style", resulution);
    parentElement.appendChild(div);
	

    let myChart = echarts.init(div);

    let option = {
        tooltip: {
            position: 'top',
            formatter: function(obj)
            {
                var m = Math.round(obj.value[0] * obj.value[0]);
                var c = Math.round(obj.value[1] * obj.value[1] * 1000) / 1000;
                var dot = "<span style='display: inline-block; margin-right: 5px; border-radius: 10px; width: 10px; height: 10px; background-color: " + obj.color + "'></span>";
                return "Complexity: " + c + "<br>" + dot + m;
            }

        },
        xAxis: {
            name: "mentioned"
        },
        yAxis: {
            name: "phrasing_complexity"
        },
        series: series
    };

    myChart.setOption(option);

    return myChart;
}

export { create_pie_plot, create_text_pie_plot, create_treemap, create_bar_plot, create_scatter_plot,  }
