/**
 * reads json from server
 * @param {string} file - Specifies the json we want to get
 * @returns - Returns the requested json
 */
async function get_json(file="api")
{
    let data = await fetch("http://127.0.0.1:5000/" + file);
    data = data.json();
    return data;
}

async function get_dictionary()
{
    let data = await get_json();
    console.log(data);
}

function dummy()
{
    // based on prepared DOM, initialize echarts instance
    var myChart = echarts.init(document.getElementById('chart'));

    // specify chart configuration item and data
    var option = {
        title: {
            text: 'Enteties'
        },
        xAxis: {
            data: ["shirt","cardign","chiffon shirt","pants","heels","socks"]
        },
        yAxis: {},
        series: [{
            name: 'Sales',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    // use configuration item and data specified to show chart
    myChart.setOption(option);
}

function onload()
{
    get_dictionary()
}

onload()