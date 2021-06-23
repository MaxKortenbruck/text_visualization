let resulution = "width:960px; height:540px;"

// returns div element with plot in it
function create_pie_plot(key, names, mentiond, parentFromChart)
{
    let div = document.createElement("div");
    div.setAttribute("id", "plt;pie;" + key);
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
        dict["value"] = mentiond[i];
        dict["name"] = name;
        i++;
        array.push(dict);
    })

    // specify chart configuration item and data
    var option = {
        title: {
            text: 'Enteties from ' + key,
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
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: array
            }
        ]
    };
    // use configuration item and data specified to show chart
    myChart.setOption(option);

    return myChart;
}

export { create_pie_plot }