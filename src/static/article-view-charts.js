let resulution = "width:960px; height:540px;"
//let resulution = "width:1920px; height:1080px;"

function hexToRGB(h){
	let r = 0, g = 0, b = 0;

	r = parseInt('0x' + h[1] + h[2], 16);
	g = parseInt('0x' + h[3] + h[4], 16);
	b = parseInt('0x' + h[5] + h[6], 16);

	return [r, g, b];
}

function RGBToHex(r, g, b){

	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);

	if (r.length == 1)
	{
		r = '0' + r;
	}
	if (g.length == 1)
	{
		g = '0' + g;
	}
	if (b.length == 1)
	{
		b = '0' + b;
	}

	return '#' + r + g + b;
}

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
    var myChart = echarts.init(div)

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

function create_text_pie_plot(key, names, mentioned, colour, parentFromChart, article)
{
    while(parentFromChart.firstChild)
    {
        parentFromChart.removeChild(parentFromChart.firstChild);
	}

    let div = document.createElement("div");
    div.setAttribute("id", "plt;pie;" + key);
	div.className = "text-pie-plot";
    div.setAttribute("style", resulution);
    div.setAttribute("article", article)
	
    parentFromChart.appendChild(div);

    // based on prepared DOM, initialize echarts instance
    var myChart = echarts.init(div)

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

// creates the Plot for the entities
function create_treemap(entity_name, /*data_array*/data, colour, parentFromChart)
{
    let div = document.createElement("div");
    div.setAttribute("id", "plt;pie;" + entity_name);
	div.className = "tree-map";
    div.setAttribute("style", resulution);

	let colours = [];
	let rgb = hexToRGB(colour);
	let r = rgb[0];
	let g = rgb[1];
	let b = rgb[2];

	for (let i = 0; i<10; i++)
	{
		if (Math.floor((7 + i) * r / 10) <= 255)
		{
			r = Math.floor((7 + i) * r / 10);
		}
		if (Math.floor((7 + i) * g / 10) <= 255)
		{
			g = Math.floor((7 + i) * g / 10);
		}
		if (Math.floor((7 + i) * b / 10) <= 255)
		{
			b = Math.floor((7 + i) * b / 10);
		}
		
		colours[i] = RGBToHex(r,g,b);
	}

	let j = colours.length;
	for (let i = 0; i < data.length; i++)
	{
		colours[i] = colours[i%j]
		console.log(colours[i])
	}

    while(parentFromChart.firstChild)
    {
        parentFromChart.removeChild(parentFromChart.firstChild);
    }
    parentFromChart.appendChild(div);

    var myChart = echarts.init(div);

    let option = {
        title: {
            text: 'how \'' + entity_name + '\' is mentioned',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        series: [{
            type: 'treemap',
            data: data,
			levels: [{
				color: colours
			}]
        }]
    };

    myChart.setOption(option);

}

function create_bar_plot(key, names, mentioned, colour, parentElement)
{

    console.log(key, names, mentioned, parentElement);
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
			end: 25,
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

export { create_pie_plot, create_text_pie_plot, create_treemap, create_bar_plot, hexToRGB, RGBToHex }
