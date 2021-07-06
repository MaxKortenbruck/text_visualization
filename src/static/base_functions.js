import {Topic} from "./topic.js";


async function get_json(file="api")
{
    let ret = await fetch("http://127.0.0.1:5000/" + file);
    let data = ret.json();
    return data;
}

var data = await get_json();
var art = [];

for(const[key, value] of Object.entries(data))
{
    var title = key;
    var name = value.topic;
    var a = new Topic(data, title, name);
    art.push(a);
}


async function get_topics()
{
    let data = await get_json();
    let ret = {};
    for( const [key, value] of Object.entries(data))
    {
        let array = [];
        value.documents.forEach( article => {

            let article_title = article.title;
            article_title += ";" + article.name.split("_")[1];
            array.push(article_title)
        })

        //extract title
        let title = key.substr(0, key.length - 17).split(/[-,_]+/);


        ret[title[title.length-1]] = array;
    }
    console.log(ret);
    return ret;
}

/*
async function get_topics()
{
    var ret = [];
    art.forEach(element => {
        ret.push(element.formatted_name);
    });
    console.log(ret);
    return ret;
}
*/
function get_full_title(data, t)
{
    let topic = "";
    for(const key in data)
    {
        if(key.includes(t))
        {
            topic = key;
            break;
        }
    }
    return topic;
}

/*
async function get_articles(topic)
{
    let data = await get_json();
    
    //search topic
    topic = get_full_title(data, topic);
    
    let articles = [];
    data[topic].documents.forEach( article => {
        let article_title = article.title;
        article_title += ";" + article.name.split("_")[1];
        articles.push(article_title);
    })

    return articles;
}
*/

async function get_articles(topic)
{
    let data = await get_json();
    
    //search topic
    topic = get_full_title(data, topic);
    
    let articles = [];
    data[topic].documents.forEach( article => {
        let article_title = article.title;
        article_title += ";" + article.name.split("_")[1];
        articles.push(article_title);
    })
    console.log(articles);
    return articles;
}

function cleanup_entities(names)
{
    let new_names = [];
    names.forEach( name => {
        let temp = name;
        temp = temp.slice(0, -2);
        temp = temp.replace(/_/g, " ");
        new_names.push(temp);
    })
    return new_names;
}

async function get_statistics(topic)
{
    let data = await get_json();
    topic = get_full_title(data, topic)
    
    data = data[topic];
    let names = []
    let mentiond = []
    data.entities.forEach( entitie => {
        
        let temp_mentions = entitie["mentions"];

        names.push(entitie.name);
        mentiond.push(temp_mentions.length);
        
    })

    names = cleanup_entities(names);

    let ret = [];
    ret.push(names);
    ret.push(mentiond);

    return ret;
}

async function get_entity_statistics(topic, entity_index, article_direction="")
{
    //get data for entity
    let data = await get_json();
    topic = get_full_title(data, topic);
    data = data[topic].entities;

    //create variables for the return
    let mentions_text = [];
    let mentions_number = [];

    //determine if the statistics for a specific article is needed
    let political_direction = ["L", "LL", "M", "R", "RR"];
    if(political_direction.includes(article_direction))
    {
        let entity_array = data[entity_index].mentions;
        let merging_history_array = data[entity_index].merging_history.original.phrases;
        for(let i=0; i<entity_array.length; i++)
        {
            let direction = merging_history_array[i][1].split("_")[1];
            if(direction == article_direction)
            {
                if( mentions_text.includes( entity_array[i].text ) )
                {
                    mentions_number[ mentions_text.indexOf( entity_array[i].text ) ] += 1;
                }
                else
                {
                    mentions_text.push(entity_array[i].text);
                    mentions_number.push(1);
                }
            }

        }
        //iterate through mentions, check the direction and add the Number
        /*data.mentions.forEach( mention => {
            let mention_direction = mention;
            // console.log(mention)
            if( mentions_text.includes( mention.text ) )
            {
                mentions_number[ mentions_text.indexOf(mention.text) ] += 1;
            }
            else
            {
                mentions_text.push(mention.text);
                mentions_number.push(1);
            }
        })*/
    }
    else
    {
        //iterate through mentions and add the Number
        data[entity_index].mentions.forEach( mention => {
            if( mentions_text.includes( mention.text ) )
            {
                mentions_number[ mentions_text.indexOf(mention.text) ] += 1;
            }
            else
            {
                mentions_text.push(mention.text);
                mentions_number.push(1);
            }
        })
    }
    
    
    let ret = [];
    ret.push(mentions_text);
    ret.push(mentions_number);

    return ret;
}

async function get_text(t, article)
{
    let data = await get_json();
    
    //search whole topic
    let topic = ''
    for( const key in data)
    {
        if(key.includes(t))
        {
            topic = key;
        }
    }
    //search text array
    //search index of article
    let index = 0;
    for(let i in data[topic].documents)
    {
        if( data[topic].documents[i].title == article)
        {
            index = i;
            break;
        }
        i ++;
    }
    let text_array = data[topic].documents[index];

    let text = '';
    //conncatenate text
    text_array.text.forEach( sentence => {
        sentence.forEach( word => {
            text += word.word + " ";
        })
    })
    return text;

}

async function get_statistics_of_article(t, article_direction)
{
    let data = await get_json();
    let topic = get_full_title(data, t)

    let mentions = data[topic].entities;

    let dict = {}
    dict["names"] = [];
    dict["mentiond"] = [];

    /*political_direction.forEach( direction => {
        let temp = {};
        temp["names"] = [];
        temp["mentiond"] = [];
        dict[direction] = temp;
    })*/

    mentions.forEach( mention => {
        //in jede liste das Entitie schreiben
        
        dict["names"].push(mention.name);
        dict["mentiond"].push(0);
        

        //durch mention iterieren und politische ausrichtung auslesen
        mention["merging_history"]["original"]["phrases"].forEach( element => {
            let direction_of_mention = element[1].split("_")[1];
            if(direction_of_mention == article_direction)
            {
                let index = dict["names"].length - 1;
                dict["mentiond"][index] += 1;
            }
            // index = dict[direction_of_mention]["names"].length - 1;
            // dict[direction_of_mention]["mentiond"][index] += 1;
        })
    })

    dict["names"] = cleanup_entities(dict["names"]);
    return dict;

}

export { get_topics, get_articles, get_statistics, get_entity_statistics, get_text, get_statistics_of_article }
