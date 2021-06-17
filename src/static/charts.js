let resulution = "width:1280px; height:720px;"

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

function create_pie_plot(key, names, mentiond, parentFromChart)
{
    let div = document.createElement("div");
    div.setAttribute("id", "plt;pie;" + key);
    div.setAttribute("style", resulution);

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
}

function create_bar_plot(key, names, mentiond)
{
    let div = document.createElement("div");
    div.setAttribute("id", "plt;bar;" + key)
    div.setAttribute("style", resulution)

    document.getElementById("mainChart").appendChild(div)
    // based on prepared DOM, initialize echarts instance
    var myChart = echarts.init(div);

    // specify chart configuration item and data
    var option = {
        title: {
            text: key
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            data: names
        },
        yAxis: {},
        series: [{
            type: 'bar',
            data: mentiond
        }]
    };
    // use configuration item and data specified to show chart
    myChart.setOption(option);

    
}

function create_fuenf_pie_plots(key, dataset, articleNames)
{
    let div = document.createElement("div");
    div.setAttribute("id", "plt;barextend;" + key)
    div.setAttribute("style", resulution)

    document.getElementById("mainChart").appendChild(div)
    // based on prepared DOM, initialize echarts instance
    var myChart = echarts.init(div);

    var option = {
        title: [{
            subtext: articleNames[0],
            left: '20%',
            top: '10%',
            textAlign: 'center'
        },{
            subtext: articleNames[1],
            left: '50%',
            top: '5%',
            textAlign: 'center'
        },{
            subtext: articleNames[2],
            left: '80%',
            top: '10%',
            textAlign: 'center'
        },{
            subtext: articleNames[3],
            left: '35%',
            top: '55%',
            textAlign: 'center'
        },{
            subtext: articleNames[4],
            left: '65%',
            top: '50%',
            textAlign: 'center'
        }],
        legend: {
            show: false
        },
        tooltip: {
        },
        dataset: dataset,
        series: [{
            type: 'pie',
            label: {
                show: false,
                position: 'center'
            },
            radius: '25%',
            center: ['20%', '30%']
            // No encode specified, by default, it is '2012'.
        }, {
            type: 'pie',
            label: {
                show: false,
                position: 'center'
            },
            radius: '25%',
            center: ['50%', '30%'],
            encode: {
                itemName: 'political_direction',
                value: 'LL'
            }
        }, {
            type: 'pie',
            label: {
                show: false,
                position: 'center'
            },
            radius: '25%',
            center: ['80%', '30%'],
            encode: {
                itemName: 'political_direction',
                value: 'M'
            }
        }, {
            type: 'pie',
            label: {
                show: false,
                position: 'center'
            },
            radius: '25%',
            center: ['35%', '75%'],
            encode: {
                itemName: 'political_direction',
                value: 'R'
            }
        }, {
            type: 'pie',
            label: {
                show: false,
                position: 'center'
            },
            radius: '25%',
            center: ['65%', '75%'],
            encode: {
                itemName: 'political_direction',
                value: 'RR'
            }
        }]
    };
    
    myChart.setOption(option);
}

function break_down_to_article(mentions)
{
    let political_direction = ["L", "LL", "M", "R", "RR"];
    let dict = {}
    political_direction.forEach( direction => {
        let temp = {};
        temp["names"] = [];
        temp["mentiond"] = [];
        dict[direction] = temp;
    })

    mentions.forEach( mention => {
        //in jede liste das Entitie schreiben
        political_direction.forEach( direction => {
            dict[direction]["names"].push(mention.name);
            dict[direction]["mentiond"].push(0);
        })

        //durch mention iterieren und politische ausrichtung auslesen
        mention["merging_history"]["original"]["phrases"].forEach( element => {
            let direction_of_mention = element[1].split("_")[1];
            index = dict[direction_of_mention]["names"].length - 1;
            dict[direction_of_mention]["mentiond"][index] += 1;
        })
    })
    //datenset für vergleichenden Plot erstellen
    let dataset = {};

    //itemName einfügen
    let directions = [];
    directions[0] = 'political_direction'
    political_direction.forEach( element => {
        directions.push(element);
    })

    let datasetList = []
    datasetList.push(directions)

    // einfügen aller entities und dabei arrays erstellen
    for(let i=0; i<dict['L']['names'].length; i++)
    {
        let newList = []
        newList.push(dict['L']['names'][i]);
        datasetList.push(newList);
    }
    
    //entities einfügen listen, wo an erster stelle die political direction steht und danach in der gleichen reihenfolge die Anzahl der mentions
    let lauf = 0;
    for(let i=1; i<=dict['L']['names'].length; i++)
     {

        political_direction.forEach( key =>
        {
            datasetList[i].push( dict[key]['mentiond'][lauf] )
        })
        lauf = lauf + 1;
    }
    dataset["source"] = datasetList;

    console.log(dict)
    console.log(dataset)

    return dataset;

}

async function get_dictionary()
{
    let data = await get_json();
    for( const [key, value] of Object.entries(data))
    {
        
        let names = []
        let mentiond = []
        value["entities"].forEach( entitie => {
            
            let temp_mentions = entitie["mentions"]

            names.push(entitie["name"]);
            mentiond.push(temp_mentions.length);
            
        })

        create_bar_plot(key, names, mentiond);
        create_pie_plot(key, names, mentiond, document.getElementById('mainChart'));

        //Namen der Artickel
        let articleNames = [];
        value['documents'].forEach( element => {
            articleNames.push(element.title + ' ' + element.name)
        })
        
        let dataset = break_down_to_article(value["entities"]);
        create_fuenf_pie_plots(key, dataset, articleNames);
    }
}


function onload()
{
    get_dictionary()
}

onload()