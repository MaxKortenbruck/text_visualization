'use strict'

class Entity
{
    constructor(data, name)
    {
        this.json_data = data;
        this.name = name;
    }

}

/**
 * Searches the the provided dataset for the requested article's index
 * @param {String} data - Json dataset
 * @param {String} topic - Overall articeltopics
 * @param {String} article_name - Name of the article to be indexed
 * @returns Index of the provided articel
 */

function get_article_index(data, topic, article_name)
{
    var index = 0, counter = 0;
    while( !index && counter < data[topic].documents.length)
    {
        if(data[topic].documents[counter].title == article_name)
        {
            index = counter;
        }
        counter++;
    }
    return index;
}

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

/**
 * Build a text out of the provided Jason dataset
 * @param {json object} data - Json Data
 * @param {String} article - Article id in the format ("topic";"article")
 * @returns null
 */
function json_to_text(data, article)
{
    let text_return = '', text_t;
    let sentence_symbols = [".",",","?","!",";",":","%","€","$","\’","\""];

    // res is the split of the article in topic and the article name
    let res = []
    res = article.split(";");

    // adds local index to article
    let sentence_array_index = 0;
    let sentence_array = [], text_array = [];

    let document_number = get_article_index(data, res[0], res[1]);
    text = data[res[0]].documents[ document_number ].text;
    text.forEach(sentence => {

        sentence.forEach(word[word] => {    
            sentence_array.push(word);    
        });
        text_array.push(sentence_array);
        sentence_array = [];
    });

    console.log(text_array);    
    const element = document.getElementById("text");

    text_array.forEach(sentence => {

        sentence.forEach(word => {
            if(!sentence_symbols.includes(word["word"]))
            {
                sentence_array.push(" ");
            }
        });
    });

    element.textContent = text_return;
    
    return 0;
}

function load_entities(data, article)
{
    let res = article.split(";");
    let div = document.getElementById("entities")
    div.innerHTML = "";
    let sentence_index = 0;

    let articel_index = get_article_index(data, res[0], res[1])

    let index = 0, mention_index = 0;



    data[res[0]].entities.forEach( entity => {

       /* while(index < articel_index && mention_index <= data[res[0]].entities.mentions.length)
        {
            mention_index ++
        }
        data[res[0].entities.mentions.forEach( mention => {
            if
        })]*/
        
        let a = document.createElement("a");
        a.appendChild( document.createTextNode(entity.name) );
        a.setAttribute("class", "entitie_element");
        a.setAttribute("onclick", "available_entities_click(this); return false");
        a.setAttribute("id", article + ";" + entity.name);

        div.appendChild(a);
    })
}


async function print_whole_text(article)
{
    let data = await get_json();
    load_entities(data, article);
    json_to_text(data, article);
}

/**add all availible Topics to html
 */
async function available_topics()
{
    let data = await get_json("api");
    let list = document.getElementById("available_articles")

    for(const [key, value] of Object.entries(data))
    {
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.appendChild(document.createTextNode(key));
        a.setAttribute("id", key);
        a.onclick = function()
        {
            available_topics_click(this);
            return false;
        }
        li.appendChild(a);
        li.setAttribute("class", "navigation_bar_li");
        li.setAttribute("id", key)
        list.appendChild(li);
    }
}

//refreshes the list with available articles
async function available_articles(topic)
{
    let data = await get_json("api");
    let list = document.getElementById(topic);

    if(document.getElementById("div" + topic) == null)
    {
        let div = document.createElement("div");
            div.setAttribute("id", "div" + topic);

            let ul = document.createElement("ul");
            data[topic]["documents"].forEach( element => {
                let li_child = document.createElement("li");
                let a_child = document.createElement("a");
                a_child.appendChild(document.createTextNode(element.title));
                a_child.setAttribute("id", topic + ";" + element.title);
                a_child.onclick = function()
                {
                    available_articles_click(this);
                    return false;
                }
                li_child.appendChild(a_child);
                li_child.setAttribute("class", "navigation_bar_li");
                ul.appendChild(li_child);
            })
        div.appendChild(ul);
        list.appendChild(div);
    }

    else
    {
        list.removeChild(document.getElementById("div"+topic));
    }
    /*data.articles.forEach( element => {
        //add the documents to the navigation bar
        let li = document.createElement("li")
        let a = document.createElement("a")
        a.appendChild(document.createTextNode(element))
        a.setAttribute("id", element)
        a.setAttribute("onclick", "available_articles_click(this); return false")
        li.appendChild(a)
        li.setAttribute("class", "navigation_bar_li")
        list.appendChild(li)
    })*/
}
function available_topics_click(linkElement)
{
    available_articles(linkElement.id);
}

function available_articles_click(linkElement)
{
    print_whole_text(linkElement.id);
}

function available_entities_click(linkElement)
{
    console.log(linkElement.id);
}


function onload_function()
{
    available_topics();
}

onload_function();

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  
  /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  } 
