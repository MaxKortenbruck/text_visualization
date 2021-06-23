
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

async function get_articles(topic)
{
    let data = await get_json();
    
    //search topic
    let full_topic = ''
    for(const key in data)
    {
        if(key.includes(topic))
        {
            full_topic = key;
            break;
        }
    }
    
    let articles = [];
    data[full_topic].documents.forEach( article => {
        articles.push(article.title);
    })

    return articles;
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



export { get_topics, get_articles, get_text }

