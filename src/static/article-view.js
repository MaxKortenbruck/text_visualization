import { create_pie_plot, create_text_pie_plot, create_treemap, create_bar_plot, create_scatter_plot } from "./article-view-charts.js";
import {Topic} from "./topic.js"

/* global definitionsfor the script*/
// globally safes plotted articles in the format { formatted_name : [&topic, &articel] } 
var plotted_articles_dict = {}

//saves open topic
let open_topic;

//json data stored in full_data
var json_data = await get_json();
var full_data = []; 

// allocates data from Json in cascade style to Objects:
// Topic -> Document & Entity -> Mention
for(const[key, value] of Object.entries(json_data))
{
    var title = key;
    var name = value.topic;
    var a = new Topic(json_data, title, name);
    full_data.push(a);
}

// asynchronous function to aquire the dataset from the server. The source IP needs to be changed accordingly
async function get_json(file="api")
{
    let ret = await fetch("http://127.0.0.1:5000/" + file);
    let data = ret.json();
    return data;
}

/**
 * Sets the topic selection HTML element
 */
function set_topics() {

  let list = document.getElementById("articel_view;available_topics")
    for(const [i, topic] of full_data.entries()){
      
      let a = document.createElement("a");
      a.className = "list-group-item list-group-item-action"
      a.id = "a;" + topic.formatted_name;
      a.index = i;
      a.onclick = function()
      {
        topic_click(this.index);
        return false;
      }
      a.appendChild(document.createTextNode(topic.formatted_name));
      list.appendChild(a);
    };
}

/**
 * Sets the article selction HTML elements 
 * @param {Integer} index - Index of the topic in the dataset  
 */
function set_articles(index)
{
  //add list with Articles
  let table = document.createElement("table");
  table.className = "table table-hover";

  //create table-head
  let head = document.createElement("thead");
  let tr = document.createElement("tr");

  let first = document.createElement("th");
  first.setAttribute("scope", "col");
  first.appendChild( document.createTextNode("#") );
  
  let second = document.createElement("th");
  second.setAttribute("scope", "col");
  second.appendChild( document.createTextNode("Title"));

  let third = document.createElement("th");
  third.setAttribute("scope", "col");
  third.appendChild( document.createTextNode("Political Orientation") );

  tr.appendChild(first);
  tr.appendChild(second);
  tr.appendChild(third);

  head.appendChild(tr);
  table.appendChild(head);

  //create table body
  let body = document.createElement("tbody");
  var i = 1;

  full_data[index].articles.forEach( article => {
    let trChild = document.createElement("tr");
    trChild.className = "";
    trChild.id = "row;" + article.id;
    trChild.onclick = function()
    {
        if(trChild.className == '')
        {
          trChild.className = 'table-click'
        }
        else
        {
          trChild.className = ""
        }
        article_click(article);
        return false;
    }
  
    let tdNumber = document.createElement("td");
    tdNumber.appendChild( document.createTextNode(i) );
    i++;
        
    let tdTitle = document.createElement("td");
    tdTitle.appendChild( document.createTextNode(article.title));
  
    let thOrientation = document.createElement("td");
    thOrientation.appendChild( document.createTextNode(article.political_direction));
  
    trChild.appendChild( tdNumber );
    trChild.appendChild( tdTitle );
    trChild.appendChild( thOrientation );
  
    body.appendChild( trChild );
  });
  
  table.appendChild(body)
  let div_a_aritcles = document.getElementById("articel_view;available_articles");
  while(div_a_aritcles.firstChild)
  {
    div_a_aritcles.removeChild(div_a_aritcles.firstChild);
  }
  div_a_aritcles.appendChild(table);
}
/**
 * Creates the topic's corresponding statistics and creates their HTML elements
 * @param {INTEGER} index - Index of the topic in the dataset
 */
function set_statistics(index)
{
  //create pie plot
  document.getElementById("statistics_headline").innerHTML = full_data[index].formatted_name;


  let div = document.getElementById("mainChart");
  div.innerHTML = "";
  let dat = full_data[index].statistics_of_entity_types;
  let plot = create_pie_plot(full_data[index].formatted_name, dat.names, dat.numbers, dat.colour, div);

  // handle click event in Charts
  plot.on('click', function(params) {
    entity_in_statistic_click(params);
  })

  document.getElementById("statistics_on_load_warning").style.display="none";
}
/**
 * Creates a clickable button for the entity
 * @param {Object} entity - The correspondiong entity
 * @returns HTML span element
 */
function create_entity_button(entity)
{
	let span = document.createElement("span");
	span.className = "badge badge-secondary";
	span.style = "margin: 5px; background-color: " + entity.colour + " !important;" ;
  span.setAttribute("data-rep", entity.representative);
	span.appendChild(document.createTextNode(entity.formatted_name));
	span.id = "entity_" + entity.identifier;
	span.onclick = function()
	{
		open_entity(entity);
		return false;
	}	
	
	return span;
}
/**
 * Creates and fills a HTML element that shows all the topic's entities
 * @param {Integer} index - Index of the corresponding topic in the dataset
 */
function set_entities(index)
{
	
	document.getElementById("entities_headline").innerHTML = full_data[index].formatted_name;

	let entities_parent = document.getElementById("entities");
		
	while(entities_parent.firstChild)
    {
        entities_parent.removeChild(entities_parent.firstChild);
    }

	for(var entity of full_data[index].entities)
	{
		let span = create_entity_button(entity);
		entities_parent.appendChild(span);
	}
	
	document.getElementById("entities_on_load_warning").style.display="none";
}
// ad click to the maine 
document.getElementById("mainChart;pie").addEventListener("click", set_statistics_pie)
function set_statistics_pie()
{
  set_statistics(open_topic);
}

document.getElementById("mainChart;bar").addEventListener("click", set_statistics_bar)
function set_statistics_bar()
{
  let div = document.getElementById("mainChart");
  let dat = full_data[open_topic].statistics_of_entities;
  let plot = create_bar_plot(full_data[open_topic].formatted_name, dat.names, dat.numbers, dat.colour, div);

  plot.on('click', function(params) {
    entity_in_statistic_click(params);
  })
}

document.getElementById("mainChart;scatter").addEventListener("click", set_statistics_scatter);
function set_statistics_scatter()
{
  let div = document.getElementById("mainChart");
  let dat = full_data[open_topic].statistics_of_entities;
  let plot = create_scatter_plot(full_data[open_topic].formatted_name, dat.names, dat.numbers, dat.colour, dat.phrasing_complexity, div);

  plot.on('click', function(params) {
    entity_in_statistic_click(params);
  })
}

function set_entity_statistics(entity, parent, article_direction)
{
  let data = entity.count_mentions(article_direction);
  console.log(data)
  create_treemap(entity.formatted_name, data, entity.colour, parent);
}

function set_entity_statistics_bar(index)
{
  let res = index.split("spacer");
  let dat = full_data[open_topic].get_statistics_of_article_with_zero(
                                  full_data[open_topic].articles.find(article => article.political_direction == res[2]))
  // let dat = full_data[open_topic].articles.find(article => article.political_direction == res[2]).statistics_of_article;

  let id = "statistic;" + index;
  id = id.slice(0, -13);
  let title = full_data[open_topic].articles.find(article => article.political_direction == res[2]).title
  let div = document.getElementById(id)
  let plot = create_bar_plot(title, dat.names, dat.numbers, dat.colour, div);
  console.log("bar_art: ")
  console.log(dat.numbers)


  plot.on('click', function(params) {
    entity_in_statistic_click(params);
  })
}

function set_entity_statistics_pie(index)
{

  let res = index.split("spacer");

  let id = "statistic;" + index;
  id = id.slice(0, -13);
  let div = document.getElementById(id)

  let title = full_data[open_topic].articles.find(article => article.political_direction == res[2]).title
  let dat = full_data[open_topic].articles.find(article => article.political_direction == res[2]).statistics_of_article;
  let plot = create_pie_plot(title, dat.names, dat.numbers, dat.colour ,div);

  plot.on('click', function(params) {
    entity_in_statistic_click(params);
  })
}

function open_entity(entity)
{
  let parent = document.getElementById("openentities");
  //check if entity is already open
  for(let i=0; i<parent.children.length; i++)
  {
    if(parent.children[i].firstChild.data == entity.formatted_name)
    {
      return;
    }
  }

  update_open_entities(entity);

  //create new open entity
  let span = document.createElement("span");
  span.className = "badge";
  span.style = "margin: 5px; background-color: " + entity.colour + " !important;" ;
  span.appendChild(document.createTextNode(entity.formatted_name));

  //create close-button
  let btn = document.createElement("button");
  btn.type = "button button-secondary";
  btn.className = "btn-close";
  btn.setAttribute("aria-label", "close");
  btn.onclick = function()
  {
    close_entity(this);
    update_open_entities(entity, false, true, false);
    return false;
  }
  span.appendChild(btn);

  parent.appendChild(span);
}


function determine_open_articles()
{
  let row = document.getElementById("articel_view;row")
  let anz = row.childElementCount;
  if(anz > 2){ anz = 2};
  row.className = "row row-cols-" + anz;
}

function close_text(button_element)
{
  let to_close = button_element.parentNode.parentNode.parentNode.parentNode.parentNode;
  console.log(to_close)
  document.getElementById("articel_view;row").removeChild(to_close);
  determine_open_articles();
}

function close_entity(element)
{
  let to_close = element.parentNode;
  document.getElementById("openentities").removeChild(to_close);
}

function display_article(article)
{
    var articel_div_id = "articlespacer" + article.clean_topic + "spacer" + article.political_direction;  
    //check if the article is already open
    if(document.getElementById(articel_div_id))
    {
      document.getElementById("articel_view;row").removeChild(document.getElementById(articel_div_id));
      determine_open_articles();
      return;
    }

    //create div element as container for the article
    let div = document.createElement("div");
    div.className = "col block";
    div.id = articel_div_id;

    let divChild = document.createElement("div");
    divChild.className = "overflow-auto";
    divChild.style = "padding: 20px; height: 500px;";

    //create and append headline
    let headline = article.title;
    let headlineElement = document.createElement("h4");
    headlineElement.style = "line-height: 1.5;";
    headlineElement.appendChild( document.createTextNode(headline));
    divChild.appendChild(headlineElement);

    //create Close Button
    let closeButton = document.createElement("button");
    closeButton.type = "button";
	  closeButton.setAttribute("class", "close-button");
    closeButton.setAttribute("aria-label", "Close");
    closeButton.onclick = function ()
    {
      close_text(this);
      if(plotted_articles_dict.hasOwnProperty(article.title))
      { 
        article.unmark_entity(null, true);
        delete plotted_articles_dict[article.title];
      }
      else {throw Error;}
      return false;
    }

    //add header and close Button side by side
    let topContainer = document.createElement("div");
    topContainer.className = "container"
    let top = document.createElement("div")
    top.className = "row";

    let topfChild = document.createElement("div");
    topfChild.appendChild(headlineElement);
    top.appendChild(topfChild);

    let topsChild = document.createElement("div");
    topsChild.appendChild(closeButton);
    top.appendChild(topsChild)

    topContainer.appendChild(top);
    divChild.appendChild(topContainer);

    //create accordion for text and statistics
    let accordion = document.createElement("div");
    accordion.className = "accordion";
    accordion.id = "accordion" + articel_div_id;

    // accordion item for text
    let accordion_text = document.createElement("div");
    accordion_text.className = "accordion-item acc-text";
  	accordion_text.style = "font-size: 17px;";
    accordion.appendChild(accordion_text)

    //header for text
    let accordion_text_header = document.createElement("h2");
    accordion_text_header.className = "accordion-header";
    accordion_text_header.id = "textHeader" + articel_div_id;
    accordion_text.appendChild(accordion_text_header);

    //button for expansion
    let accordion_text_button = document.createElement("button");
    accordion_text_button.className = "accordion-button";
    accordion_text_button.type = "button";
    accordion_text_button.setAttribute("data-bs-toggle", "collapse");
    accordion_text_button.setAttribute("data-bs-target", "#textCollapse" + articel_div_id);
    accordion_text_button.setAttribute("aria-expanded", "false")
    accordion_text_button.setAttribute("aria-controls", "textCollapse" + articel_div_id);

    accordion_text_button.appendChild(document.createTextNode("Text"));

    accordion_text_header.appendChild(accordion_text_button)
  
    //create collapsible div element 
    let collapse_text = document.createElement("div");
    collapse_text.id = "textCollapse" + articel_div_id;
    collapse_text.className = "accordion-collapse collapse hide";
    collapse_text.setAttribute("aria-labelledby", "textHeader" + articel_div_id);
    collapse_text.setAttribute("data-bs-parent", "#accordion" + articel_div_id);
    accordion_text.appendChild(collapse_text);

    //create accordion body
    let body_text = document.createElement("div");
    body_text.className = "accordion-body";
    collapse_text.appendChild(body_text);

    //create and append text
    let p = document.createElement("p"); 
    p.id = "text;" + articel_div_id;
    text(p, article);
    //p.appendChild(pt);
    body_text.appendChild(p);

    //accordion item for statistics
    let accordion_stat = document.createElement("div");
    accordion_stat.className = "accordion-item acc-stat";
    accordion.appendChild(accordion_stat)

    //header for statistics
    let accordion_stat_header = document.createElement("h2");
    accordion_stat_header.className = "accordion-header";
    accordion_stat_header.id = "statHeader" + articel_div_id;
    accordion_stat.appendChild(accordion_stat_header);

    //button for expansion from the statistics
    let accordion_stat_button = document.createElement("button");
    accordion_stat_button.className = "accordion-button";
    accordion_stat_button.type= "button";
    accordion_stat_button.setAttribute("data-bs-toggle", "collapse");
    accordion_stat_button.setAttribute("data-bs-target", "#statCollapse" + articel_div_id);
    accordion_stat_button.setAttribute("aria-expanded", "false")
    accordion_stat_button.setAttribute("aria-controls", "statCollapse" + articel_div_id);

    accordion_stat_button.appendChild(document.createTextNode("Statistics"));

    accordion_stat_header.appendChild(accordion_stat_button);

    //create collapsible div element for statistics
    let collapse_stat = document.createElement("div");
    collapse_stat.id = "statCollapse" + articel_div_id;
    collapse_stat.className = "accordion-collapse collapse hide";
    collapse_stat.setAttribute("aria-labelledby", "statHeader" + articel_div_id);
    collapse_stat.setAttribute("data-bs-parent", "#accordion" + articel_div_id);
    accordion_stat.appendChild(collapse_stat);

    //create accordion body for the statistics
    let body_stat = document.createElement("div");
    body_stat.className = "accordion-body";
    collapse_stat.appendChild(body_stat);

    //create dropdown for plot kind
    let div_drop = document.createElement("div");
    div_drop.className = "dropdown";
    collapse_stat.appendChild(div_drop);

    //button for dropdown
    let button_drop = document.createElement("button");
    button_drop.type = "button";
    button_drop.className = "btn btn-secondary dropdown-toggle";
    button_drop.id = "dropDownMenuButtonspacer" + articel_div_id;
    button_drop.setAttribute("data-bs-toggle", "dropdown");
    button_drop.setAttribute("aria-expanded", "false");
    button_drop.appendChild( document.createTextNode("Views") )
    div_drop.appendChild(button_drop);

    //dropdown menu list
    let ul_drop = document.createElement("ul");
    ul_drop.className = "dropdown-menu";
    ul_drop.setAttribute("aria-labelledby", "dropDownMenuButtonspacer" + articel_div_id);
    div_drop.appendChild(ul_drop);

    //create an add statistic elements
    //add pie plot
    let li_pie_drop = document.createElement("li");
    ul_drop.appendChild(li_pie_drop);

    let a_pie_drop = document.createElement("a");
    a_pie_drop.className = "dropdown-item";
    a_pie_drop.appendChild( document.createTextNode("Pie Plot") );
    a_pie_drop.id = article.clean_topic + ";pie";
    a_pie_drop.onclick = function()
    {
      set_entity_statistics_pie(articel_div_id + "spacerdroppie");
      return false;
    }
    li_pie_drop.appendChild(a_pie_drop);

    //add bar plot
    let li_bar_drop = document.createElement("li");
    ul_drop.appendChild(li_bar_drop);

    let a_bar_drop = document.createElement("a");
    a_bar_drop.className = "dropdown-item";
    a_bar_drop.appendChild( document.createTextNode("Bar Plot") );
    a_bar_drop.id = article.clean_topic + ";bar";
    a_bar_drop.onclick = function() 
    {
      set_entity_statistics_bar(articel_div_id + "spacerdropbar");
      return false;
    }
    li_bar_drop.appendChild(a_bar_drop);


    // create the div element for the pie plot
    let div_article_statistic = document.createElement("div");
    div_article_statistic.id = "statistic;" + articel_div_id;
    collapse_stat.appendChild(div_article_statistic);

    let dat = article.statistics_of_article;
    let plot = create_text_pie_plot(article.title, dat.names, dat.numbers, dat.colour ,div_article_statistic);
    
    // handle click event in Chart
    // add articel to global dict
    plotted_articles_dict[article.title] = article; 
    plot.on('click', function(params) {
      entity_in_statistic_click(params);
    })
    
    //update article with opened entities
    update_open_entities(false, article, false, false, p);

    //create a div Element for the treemap
    let div_treemap = document.createElement("div")
    div_treemap.id = "treemap;" + article.clean_topic + ";" + article.political_direction;
	console.log(div_treemap.id);
    collapse_stat.appendChild(div_treemap);

    divChild.appendChild(accordion);

    div.appendChild(divChild);
    document.getElementById("articel_view;row").appendChild(div);
    determine_open_articles();
}



document.getElementById("open_all_entities_button").addEventListener("click", open_all_entities);
function open_all_entities()
{
	for (let entity of full_data[open_topic].entities)
	{
		open_entity(entity);
	}
}


document.getElementById("close_all_open_entities_button").addEventListener("click", close_all_open_entities)
function close_all_open_entities()
{
  let div = document.getElementById("openentities");

  while(div.firstChild)
  {
    div.removeChild(div.firstChild);
  }
  update_open_entities(false, false, true, true);
}

/*
function topic_click(element)
{
  let topic = element.split(";")[1];
  set_articles(topic);
  set_statistics(topic);
}
*/

function topic_click(topic)
{
  open_topic = topic;
  setTimeout(function(){set_statistics(topic)}, 1250);
  set_articles(topic);
  set_entities(topic);
}

function article_click(article)
{
  display_article(article);
}

function entity_in_statistic_click(params)
{
  let entity = null;
  let artcl = false;

  if(params.seriesType == "scatter")
  {
    let tpc = full_data[open_topic];
    entity = tpc.entities.find( item => item.formatted_name == params.seriesName);
  }
  else if(params.seriesName in plotted_articles_dict)
  {
    artcl = plotted_articles_dict[params.seriesName];
    entity = artcl.entities.find( item => item.formatted_name == params.name );
  }
  else
  {
    let tpc = full_data[open_topic];
    entity = tpc.entities.find( item => item.formatted_name == params.name);
  }

  set_entity_statistics(entity, document.getElementById("entityChart") );
  open_entity(entity);

  //scan "article_view;row" for open articles and update treemaps
  let open_articles = document.getElementById("articel_view;row").children;
  //console.log(open_articles.length)
  for(let i=0; i<open_articles.length; i++)
  {
    let art_div = document.getElementById("text;" + open_articles[i].id);
    //text(art_div, artcl, entity);
    let res = open_articles[i].id.split("spacer");
    let treemap_parent = document.getElementById("treemap;" + res[1] + ";" + res[2]);
    let article_direction = res[2];
    set_entity_statistics(entity, treemap_parent, article_direction)
  }
}

function on_load() {
  set_topics();
}

/**
 * Function to mark und and unmark entities in all open articles
 * @param {Object} entity - entity class Object that needs to be marked in all open articles
 * @param {Object} article - newly opened article class Object that needs it's entities marked
 * @param {Boolean} dele - true, if entities need to be deleted fro all articles. If an entity is passed as well, only this entity will be unmarked in all articles 
 * @param {Boolean} all - if true as well as dele = true, all open entities are closed
 * @param {Object} node - HTML text node that displays the article text
 * 
 * Example:
 * 
 */
function update_open_entities(entity = false, article = false, dele = false, all = false, node = false)
{
  // mark all open articles in newly opened article
  if(!entity && !dele)
  { 
    //open_articles = document.getElementById("articel_view;row").children;
    let parent = document.getElementById("openentities");
    for(let i=0; i<parent.children.length; i++)
    {
      let ent = article.entities.find(enti => enti.formatted_name === parent.children[i].firstChild.data);
      if(ent)
      {
        article.mark_entity(ent);   
      }
    }
    text(node, article)
  }
  // mark entity in all open articles
  else if(!article && !dele)
  {
    for(title in  plotted_articles_dict)
    {
      var a = plotted_articles_dict[title];
      if(a.entities.includes(entity) && !a.marked_entities.includes(entity))
      {
        a.mark_entity(entity);
        var node_id = "text;" + "articlespacer" + a.clean_topic + "spacer" + a.political_direction;
        var nde = document.getElementById(node_id);
        text(nde, a);
      }
    }
  }
  // delete marked entities
  else if(dele)
  {
    for(title in  plotted_articles_dict)
    {
      var a = plotted_articles_dict[title];
      var node_id = "text;" + "articlespacer" + a.clean_topic + "spacer" + a.political_direction;
      var nde = document.getElementById(node_id);
      if(all)
      {
          a.unmark_entity(entity, all);
          text(nde, a)
      }
      else
      {
        if(a.marked_entities.includes(entity))
        {
          a.unmark_entity(entity);
          text(nde, a);
        }
      }

    }
    
  }
} 

function text(node, article)
{ 
  article.set_text(node);
}

on_load();
