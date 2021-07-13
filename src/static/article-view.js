/** 
 * Created By : Wanja Zemke 
 * On:
 * 
 * Last Change By : Max Kortenbruck
 * On: 09.07.2021
 */

import { get_topics, get_articles, get_statistics, get_entity_statistics, get_text, get_statistics_of_article } from "./base_functions.js";
import { create_pie_plot, create_text_pie_plot, create_treemap } from "./article-view-charts.js";
import {Topic} from "./topic.js"

/* global definitionsfor the script*/
// globally safes plotted articles in the format { formatted_name : [&topic, &articel] } 
var plotted_articles_dict = {}

//json data stored in full_data
var json_data = await get_json();
var full_data = []; 

// allocates data from Json in cascade style to Objects:
// Topic -> Document, Entity -> Mention
for(const[key, value] of Object.entries(json_data))
{
    var title = key;
    var name = value.topic;
    var a = new Topic(json_data, title, name);
    full_data.push(a);
}

async function get_json(file="api")
{
    let ret = await fetch("http://127.0.0.1:5000/" + file);
    let data = ret.json();
    return data;
}

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
      a.appendChild( document.createTextNode(topic.formatted_name) );
      list.appendChild(a);
    };
}

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
    trChild.id = "row;" + article.id;
    trChild.onclick = function()
    {
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

function set_statistics(index)
{
  document.getElementById("statistics_headline").innerHTML = full_data[index].formatted_name;

  let plot_parent = document.getElementById("mainChart");
  let dat = full_data[index].statistics_of_entities;
  let plot = create_pie_plot(full_data[index].formatted_name, dat.names, dat.numbers, dat.colour, plot_parent);

  // handle click event in ChartS
  plot.on('click', function(params) {
      entity_in_statistic_click(params);
  })

  document.getElementById("statistics_on_load_warning").style.display="none";
}

function set_entity_statistics(entity, parent, article_direction)
{
  let data = entity.count_mentions(article_direction)
  create_treemap(entity.formatted_name, data, parent);
}

function open_entity(entity, article)
{
  let parent = document.getElementById("openentitys")
  //check if entity is already open
  for(let i=0; i<parent.children.length; i++)
  {
    if(parent.children[i].firstChild.data == entity.formatted_name)
    {
      return;
    }
  }

  if(article)
  {
    article.mark_entity(entity);
  }

  //create new open entity
  let span = document.createElement("span");
  span.className = "badge bg-primary";
  span.style = "margin: 5px;";
  span.appendChild(document.createTextNode(entity.formatted_name));

  //create close-button
  let btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn-close";
  btn.setAttribute("aria-label", "close");
  btn.onclick = function()
  {
    close_entity(this);
    article.unmark_entity(entity);
    return false;
  }
  span.appendChild(btn);

  parent.appendChild( span );
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
  document.getElementById("articel_view;row").removeChild(to_close);
  determine_open_articles();
}

function close_entity(element)
{
  let to_close = element.parentNode;
  document.getElementById("openentitys").removeChild(to_close);
}

function display_article(article)
{
    var articel_div_id = "articlespacer" + article.clean_topic + "spacer" + article.political_direction;  
    //check if the article is already open
    if(document.getElementById(articel_div_id))
    {
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
      return false;
    }

    //add header and close Button side by side
    let topContainer = document.createElement("div");
    topContainer.className = "container"
    let top = document.createElement("div")
    top.className = "row";

    let topfChild = document.createElement("div");
    topfChild.appendChild(headlineElement);
    top.appendChild(topfChild)

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
    accordion_text.className = "accordion-item";
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
    p.appendChild( document.createTextNode(article.text));
    body_text.appendChild(p);

    //accordion item for statistics
    let accordion_stat = document.createElement("div");
    accordion_stat.className = "accordion-item";
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

    accordion_stat_button.appendChild( document.createTextNode("Statistics"));

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


    //here is the code for the statistics
    // create the div element for the pie plot
    let div_article_statistic = document.createElement("div");
    collapse_stat.appendChild(div_article_statistic);

    let dat = article.statistics_of_article;
    let plot = create_pie_plot(article.title, dat.names, dat.numbers, dat.colour ,div_article_statistic);
    
    // handle click event in Chart
    // add articel to global dict
    plotted_articles_dict[article.title] = article; 
    plot.on('click', function(params) {
      entity_in_statistic_click(params);
    })


    //create a div Element for the treemap
    let div_treemap = document.createElement("div")
    div_treemap.id = "treemap;" + article.clean_topic + ";" + article.political_direction;
    console.log(article.clean_topic);
    collapse_stat.appendChild(div_treemap);

    divChild.appendChild(accordion);

    div.appendChild(divChild);
    document.getElementById("articel_view;row").appendChild(div);
    determine_open_articles();
    
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
  set_articles(topic);
  set_statistics(topic);
}

function article_click(article)
{
  display_article(article);
}

function entity_in_statistic_click(params)
{ 
  let entity = null;
  let artcl = false;

  if(params.seriesName in plotted_articles_dict)
  {
  artcl = plotted_articles_dict[params.seriesName];
  entity = artcl.entities.find( item => item.formatted_name == params.name );
  }
  else
  {
    let tpc = full_data.find(item => item.formatted_name == params.seriesName);
    entity = tpc.entities.find( item => item.formatted_name == params.name);
    console.log(entity);
  }

  set_entity_statistics(entity, document.getElementById("entityChart") );
  open_entity(entity, artcl);

  //scan "article_view;row" for open articles and update treemaps
  let open_articles = document.getElementById("articel_view;row").children;
  //console.log(open_articles.length)
  for(let i=0; i<open_articles.length; i++)
  {
    // console.log(open_articles[i].id.split("0"))
    let res = open_articles[i].id.split("spacer");
    let treemap_parent = document.getElementById("treemap;" + res[1] + ";" + res[2]);
    let article_direction = res[2];
    set_entity_statistics(entity, treemap_parent, article_direction)
  }
}

function on_load() {
  set_topics();
}

on_load();
