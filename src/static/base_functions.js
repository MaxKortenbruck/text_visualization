
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
            array.push(article.title)
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
        articles.push(article.title);
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
    
    console.log(data);
    return 0;
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
        console.log( data[topic].documents[i].title, article);
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



export { get_topics, get_articles, get_statistics, get_entity_statistics, get_text }

