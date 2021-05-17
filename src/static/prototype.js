'use strict'

async function get_json(file="api")
{
    let data = await fetch("http://127.0.0.1:5000/" + file);
    data = data.json();
    return data
}

// article ist build as follows: string: name_of_josn;name_of_document )
function json_to_text(data, article)
{
    let text_return = '';

    let res = []

    res = article.split(";");

    let counter = 0;
    let document_number = 0;
    data[res[0]].documents.forEach( element => {
        if(element.title == res[1])
        {
            document_number = counter;
        }
        counter ++;
    })

    text = data[res[0]].documents[ document_number ].text;
    text.forEach(element => {
        element.forEach(word => {
            text_return += word['word'];
            text_return += ' ';
        });
    });

    const element = document.getElementById("text");
    element.textContent = text_return;
    return 0;
}

function load_entities(data, article)
{
    let res = article.split(";");
    let div = document.getElementById("entities")
    div.innerHTML = "";

    data[res[0]].entities.forEach( element => {
        let a = document.createElement("a");
        a.appendChild( document.createTextNode(element.name) );
        a.setAttribute("class", "entitie_element");
        a.setAttribute("onclick", "available_entities_click(this); return false");
        a.setAttribute("id", article + ";" + element.name);

        div.appendChild(a);
    })
}


async function print_whole_text(article)
{
    let data = await get_json();
    load_entities(data, article);
    json_to_text(data, article);
}

async function mark_whole_text(article)
{
    let data = await get_json();
    json_to_text(data, article);
}

//refreshes the list with available articles
async function available_articles()
{
    let data = await get_json("api");
    let list = document.getElementById("available_articles")

    for(const [key, value] of Object.entries(data))
    {
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.appendChild(document.createTextNode(key));
        a.setAttribute("id", key);
        a.setAttribute("onclick", "available_articles_click(this); return false");
        li.appendChild(a);
        li.setAttribute("class", "navigation_bar_li");
        list.appendChild(li);

        let ul = document.createElement("ul");
        data[key]["documents"].forEach( element => {
            let li_child = document.createElement("li");
            let a_child = document.createElement("a");
            a_child.appendChild(document.createTextNode(element.title));
            a_child.setAttribute("id", key + ";" + element.title);
            a_child.setAttribute("onclick", "available_articles_click(this); return false");
            li_child.appendChild(a_child);
            li_child.setAttribute("class", "navigation_bar_li");
            ul.appendChild(li_child);
        })
        list.appendChild(ul)
        
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

function available_articles_click(linkElement)
{
    print_whole_text(linkElement.id);
}

function available_entities_click(linkElement)
{
    mark_whole_text(linkElement.id);
}


function onload_function()
{
    available_articles();
}

onload_function()