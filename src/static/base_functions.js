
async function get_json(file="api")
{
    let ret = await fetch("http://127.0.0.1:5000/" + file);
    let data = ret.json();
    return data;
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
    return ret;

}

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

async function get_entity_statistics(topic, entity_index)
{
    let data = await get_json();
    topic = get_full_title(data, topic);
    data = data[topic].entities[entity_index];

    let mentions_text = [];
    let mentions_number = [];

    data.mentions.forEach( mention => {
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

    mentions = data[topic].entities;


    ////////////work on it
    let political_direction = ["L", "LL", "M", "R", "RR"];
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

    /////////till here
    return(0)

}
export { get_topics, get_articles, get_statistics, get_entity_statistics, get_text, get_statistics_of_article }

