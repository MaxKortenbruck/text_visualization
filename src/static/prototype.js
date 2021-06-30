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
 * @param {JSON-Object} data - JSON Data
 * @param {String} article - Article id in the format ("topic";"article")
 * @returns null
 */
function json_to_text(data, article)
{
    let temp_text = "";
    let sentence_symbols = [".",",","?","!",";",":","%","€","$","\’","\""];

    // res is the split of the article in topic and the article name
    let res = []
    res = article.split(";");

    // adds local index to article    
    let sentence_array = [], text_array = [];

    let document_number = get_article_index(data, res[0], res[1]);
    let text = data[res[0]].documents[ document_number ].text;
    text.forEach(sentence => {

        sentence.forEach(word => { 
            if(!sentence_symbols.includes(word["word"]))
            {
                temp_text += " ";
            }
            temp_text += word["word"];
            sentence_array.push(temp_text);
            temp_text = "";    
        });
        text_array.push(sentence_array);
        sentence_array = [];
    });

   // write_article_text("text", text_array);
/*
    console.log(text_array);    
    const element = document.getElementById("text");
    //element.setAttribute('style', 'white-space: pre;');

    text_array.forEach(sentence => {

        sentence.forEach(word => {
         if(sentence_array_index == 0)
         {
            headline += word;
         }
         else
         {
             text_return += word;
         }            
        });
        sentence_array_index++;
    });

    element.innerHTML ="<font size = 20 vmin; >" + headline + "</font><br/><br/>" + text_return;
  */  
    return text_array;
}


/**
 * Writes articel text into html element
 * @param {String} text_element - ID of a html element 
 * @param {Array[]} text_array - 2 Dimensional Array of the article's sentences and words
 */
function write_article_text(text_element, text_array, headline_id)
{
    let text_return = "", headline = ""; 
    let sentence_array_index = 0;
    const element = document.getElementById(text_element);
    
    text_array.forEach(sentence => {

        sentence.forEach(word => {
         if(sentence_array_index == 0)
         {
            headline += word;
         }
         else
         {
             text_return += word;
         }            
        });
        sentence_array_index++;
    });
    // element.innerHTML ="<font size = 20 vmin; >" + headline + "</font><br/><br/>" + text_return;
    create_text_div(headline, text_return, headline_id)
}


/**
 * 
 * @param {JSON-Object} data - JSON data  
 * @param {String} article - Article id in the format ("topic";"article")
 * @param {String} entity - Entity to be marked in the format ("topic";"article";"entity")
 * @param {Array[]} text_array - 2 Dimensional Array of the article's sentences annd words
 * @param {String} text_element - ID of a html element 
 */
function mark_entities_in_text(data, article, entity, text_element)
{   
    let res = article.split(";");
    let ent = entity.split(";");
    let my_article_index = get_article_index(data, res[0], res[1]);
    let last_sentence_index = -1, actual_articel_index = 0; 
    let text_array = json_to_text(data, article);

    if(ent[2] == "all"){
        data[res[0]].entities.forEach( entity => {
            entity.mentions.forEach( mention => {
                
                if(mention.sentence == 0 && last_sentence_index > 0)
                {
                    actual_articel_index += 1;
                    last_sentence_index = 0;
                    
                }
                if(actual_articel_index == my_article_index)
                {
                    for(var x = 0; x < mention["tokens"].length; x++)
                    {
                        let temp_text = "<mark>" + text_array[mention.sentence][mention.tokens[x]] + "</mark>";
                        text_array[mention.sentence][mention.tokens[x]] = temp_text;
                    }
                }   
                
                last_sentence_index = mention.sentence;
                
                if(actual_articel_index > my_article_index)
                {   
                    last_sentence_index = -1;
                    return;
                }            
            });
        });
    }
    else 
    {
        data[res[0]].entities.forEach( entity => {

            if(entity.name == ent[2])
            {
                entity.mentions.forEach( mention =>{
                    if(mention.sentence == 0 && last_sentence_index > 0)
                    {
                        actual_articel_index += 1;
                        last_sentence_index = 0;
                    }
                    if(actual_articel_index == my_article_index)
                    {
                        for(var x = 0; x < mention["tokens"].length; x++)
                        {
                            let temp_text = "<mark>" + text_array[mention.sentence][mention.tokens[x]] + "</mark>";
                            text_array[mention.sentence][mention.tokens[x]] = temp_text;
                        }
                    }   
                    last_sentence_index = mention.sentence;
                    if(actual_articel_index > my_article_index)
                    {   
                        last_sentence_index = -1;
                        return;
                    }               
                })
                return;
            }
        })
    } 
    write_article_text(text_element, text_array, res[1]);   
}

function closeArticle(element)
{
	let headline = "div" + element.id.split(";")[1]
	document.getElementById("text").removeChild(document.getElementById(headline))
}



function create_text_div(headline, marked_text, headline_id)
{
    let text_div = document.getElementById("div" + headline_id);
	if(text_div == null)
    {
        let text_div = document.createElement("div")
        let close_button = document.createElement("button")
		let title = document.createElement("h2")
		
		
        let text = document.createElement("div")

        let a = document.createElement("p")
        let b = document.createElement("p")

		close_button.setAttribute("id", "btn;" + headline_id)
		close_button.setAttribute("class", "close-button")
		close_button.setAttribute("aria-label", "Close alert")
		close_button.setAttribute("type", "button")

		let button = document.createTextNode("x")
		close_button.appendChild(button)
		close_button.onclick = function() {
			closeArticle(this)
			return false;
		}
		

        a.innerHTML = headline
        b.innerHTML = marked_text

        title.appendChild(a)
        text.appendChild(b)

        text_div.setAttribute("class", "text_theme")
        text_div.setAttribute("id", "div" + headline_id)

        text_div.appendChild(title)
		text_div.appendChild(close_button)
        text_div.appendChild(text)

        document.getElementById("text").appendChild(text_div);
    }
    else
    {
        document.getElementById("text").removeChild(text_div);
    }
    console.log(text_div);

}

function load_entities(data, article)
{
    let res = article.split(";");
	console.log(res)
    let div = document.getElementById("entities")
    div.innerHTML = "";

    let all = document.createElement("all");
    all.appendChild( document.createTextNode("Mark all entities in text") );
    all.setAttribute("class", "entitie_element");
    //all.setAttribute("onclick", "mark; return false");
    all.onclick = function()
        {
            mark_entities_in_text(data, article, this.id, "text");
            return false;
        }
    all.setAttribute("id", article + ";all");
    div.appendChild(all);

    data[res[0]].entities.forEach( entity => {

        let a = document.createElement("a");
        a.appendChild( document.createTextNode(entity.name) );
        a.setAttribute("class", "entitie_element");
        //a.setAttribute("onclick", "available_entities_click(this); return false");
        a.onclick = function()
        {
            mark_entities_in_text(data, article, this.id, "text");
            return false;
        }
        a.setAttribute("id", article + ";" + entity.name);

        div.appendChild(a);
    })    
}


async function print_whole_text(article)
{
    //console.log(article)
    let data = await get_json()
    let text_array = json_to_text(data, article)

	// first sentence of text -> headline
	let headline_array = text_array[0]
	let headline = ""
	headline_array.forEach(
		word => {
			headline += word
		}
	)

	// text_array to text
	text_array.shift()
	let text = ""
	text_array.forEach(
		sentence => {
			sentence.forEach(
				word => {
					text += word
				}
			)
		}
	)

	let res = article.split(";")

	
	load_entities(data, article);
    create_text_div(headline, text, res[1]);
    
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
    console.log("");
}


function onload_function()
{
    available_topics();
}

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() 
{
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}
  
  /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() 
{
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

function show(id)
{
    let element = document.getElementById(id);
    if(element != null)
    {
        element.style.display = (element.style.display=='block'?'none':'block'); 
    }
}

onload_function();
