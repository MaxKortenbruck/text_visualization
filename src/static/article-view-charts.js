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
	//div.className = "pie-plot";
    div.setAttribute("style", resulution);
    div.setAttribute("article", article)

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

    console.log(key, names, mentioned, parentElement);
    while(parentElement.firstChild)
    {
        parentElement.removeChild(parentElement.firstChild);
    }

    let div = document.createElement("div");
    div.setAttribute("style", resulution);
    parentElement.appendChild( div );

    let myChart = echarts.init(div);
    let option = {
        xAxis: {
            type: 'category',
        },
        yAxis: {
            type: 'value'
        },
        
        series: [{
            color: colour,
            data: mentioned,
            type: 'bar'
        }]
    };

    myChart.setOption(option);


    return myChart;
}

export { create_pie_plot, create_text_pie_plot, create_treemap, create_bar_plot }
