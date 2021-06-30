import { get_topics, get_articles, get_statistics, get_entity_statistics, get_text, get_statistics_of_article } from "./base_functions.js";
import { create_pie_plot, create_treemap } from "./article-view-charts.js";

async function set_topics() {
  let data = await get_topics();
  let list = document.getElementById("articel_view;available_topics")

  for(const key in data)
  {
    let a = document.createElement("a");
    a.className = "list-group-item list-group-item-action"
    a.id = "a;" + key;
    a.onclick = function()
    {
      topic_click(this.id);
      return false;
    }
    a.appendChild( document.createTextNode(key) );

    list.appendChild(a);
  }
}

async function set_articles(topic)
{
  let data = await get_articles(topic);

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
  let i = 1;
  data.forEach( article => {
    let trChild = document.createElement("tr");
    trChild.id = "row;" + topic + ";" + article;
    trChild.onclick = function()
    {
        article_click(this.id);
        return false;
    }

    let tdNumber = document.createElement("td");
    tdNumber.appendChild( document.createTextNode(i) );
    i++;
    

    let tdTitle = document.createElement("td");
    tdTitle.appendChild( document.createTextNode(article.split(";")[0]));

    let thOrientation = document.createElement("td");
    thOrientation.appendChild( document.createTextNode(article.split(";")[1]));

    trChild.appendChild( tdNumber );
    trChild.appendChild( tdTitle );
    trChild.appendChild( thOrientation );

    body.appendChild( trChild );
  })

  table.appendChild(body)
  let div_a_aritcles = document.getElementById("articel_view;available_articles");
  while(div_a_aritcles.firstChild)
  {
    div_a_aritcles.removeChild(div_a_aritcles.firstChild);
  }
  div_a_aritcles.appendChild(table);
}

async function set_statistics(topic)
{
  let data = await get_statistics(topic);

  document.getElementById("statistics_headline").innerHTML = topic;

  let plot_parent = document.getElementById("mainChart");
  let plot = create_pie_plot(topic, data[0], data[1], plot_parent);

  // handle click event in Chart
  plot.on('click', function(params) {
      entetie_in_statistic_click(params);
  })

  document.getElementById("statistics_on_load_warning").style.display="none";
}

async function set_entity_statistics(topic, entity_index, entity_name)
{
  let data = await get_entity_statistics(topic, entity_index);

  let parent = document.getElementById("entityChart");
  create_treemap(entity_name, data, parent);
}

function determine_open_articles()
{
  let row = document.getElementById("articel_view;row")
  let anz = row.childElementCount;
  if(anz > 3){ anz = 3};
  row.className = "row row-cols-" + anz;
}

function close_text(button_element)
{
  let to_close = button_element.parentNode.parentNode.parentNode.parentNode.parentNode;
  document.getElementById("articel_view;row").removeChild(to_close);
  console.log(to_close);
  determine_open_articles();
}

async function display_article(id)
{
    let res = id.split(";")
    let text = await get_text(res[1],res[2]);

    //check if the article is already open
    let article_id = "article" + res[1] + res[3];
    if(document.getElementById(article_id))
    {
      return;
    }

    //create div element as container for the article
    let div = document.createElement("div");
    div.className = "col";
    div.id = article_id;

    let divChild = document.createElement("div");
    divChild.className = "border bg-light overflow-auto";
    divChild.style = "padding: 20px; height: 500px;"

    //create and append headline
    let headline = res[2];
    let headlineElement = document.createElement("h4");
    headlineElement.appendChild( document.createTextNode(headline))
    divChild.appendChild(headlineElement);

    //create Close Button
    let closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn-close";
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
    topfChild.className = "col";
    topfChild.appendChild(headlineElement);
    top.appendChild( topfChild)

    let topsChild = document.createElement("div");
    topsChild.className = "col-1";
    topsChild.appendChild(closeButton);
    top.appendChild(topsChild)

    topContainer.appendChild(top);
    divChild.appendChild(topContainer);

    //create accordion for text and statistics
    let accordion = document.createElement("div");
    accordion.className = "accordion";
    accordion.id = "accordion" + article_id;

    // accordion item for text
    let accordion_text = document.createElement("div");
    accordion_text.className = "accordion-item";
    accordion.appendChild(accordion_text)

    //header for text
    let accordion_text_header = document.createElement("h2");
    accordion_text_header.className = "accordion-header";
    accordion_text_header.id = "textHeader" + article_id;
    accordion_text.appendChild(accordion_text_header);

    //button for expansion
    let accordion_text_button = document.createElement("button");
    accordion_text_button.className = "accordion-button";
    accordion_text_button.type = "button";
    accordion_text_button.setAttribute("data-bs-toggle", "collapse");
    accordion_text_button.setAttribute("data-bs-target", "#textCollapse" + article_id);
    accordion_text_button.setAttribute("aria-expanded", "false")
    accordion_text_button.setAttribute("aria-controls", "textCollapse" + article_id);

    accordion_text_button.appendChild(document.createTextNode("Text"));

    accordion_text_header.appendChild(accordion_text_button)

    //create collapsible div element 
    let collapse_text = document.createElement("div");
    collapse_text.id = "textCollapse" + article_id;
    collapse_text.className = "accordion-collapse collapse hide";
    collapse_text.setAttribute("aria-labelledby", "textHeader" + article_id);
    collapse_text.setAttribute("data-bs-parent", "#accordion" + article_id);
    accordion_text.appendChild(collapse_text);

    //create accordion body
    let body_text = document.createElement("div");
    body_text.className = "accordion-body";
    collapse_text.appendChild(body_text);

    //create and append text
    let p = document.createElement("p");
    p.appendChild( document.createTextNode(text));
    body_text.appendChild(p);

    //accordion item for statistics
    let accordion_stat = document.createElement("div");
    accordion_stat.className = "accordion-item";
    accordion.appendChild(accordion_stat)

    //header for statistics
    let accordion_stat_header = document.createElement("h2");
    accordion_stat_header.className = "accordion-header";
    accordion_stat_header.id = "statHeader" + article_id;
    accordion_stat.appendChild(accordion_stat_header);

    //button for expansion from the statistics
    let accordion_stat_button = document.createElement("button");
    accordion_stat_button.className = "accordion-button";
    accordion_stat_button.type= "button";
    accordion_stat_button.setAttribute("data-bs-toggle", "collapse");
    accordion_stat_button.setAttribute("data-bs-target", "#statCollapse" + article_id);
    accordion_stat_button.setAttribute("aria-expanded", "false")
    accordion_stat_button.setAttribute("aria-controls", "statCollapse" + article_id);

    accordion_stat_button.appendChild( document.createTextNode("Statistics"));

    accordion_stat_header.appendChild(accordion_stat_button);

    //create collapsible div element for statistics
    let collapse_stat = document.createElement("div");
    collapse_stat.id = "statCollapse" + article_id;
    collapse_stat.className = "accordion-collapse collapse hide";
    collapse_stat.setAttribute("aria-labelledby", "statHeader" + article_id);
    collapse_stat.setAttribute("data-bs-parent", "#accordion" + article_id);
    accordion_stat.appendChild(collapse_stat);

    //create accordion body for the statistics
    let body_stat = document.createElement("div");
    body_stat.className = "accordion-body";
    collapse_stat.appendChild(body_stat);

    //here will be the code for the statistics
    collapse_stat.appendChild(document.createTextNode("dummy"))

    //create the div element for the pie plot
    // let div_article_statistic = document.createElement("div");

    // let data = await get_statistics_of_article(res[1], res[3]);
    // console.log(data);


    divChild.appendChild(accordion);

    div.appendChild(divChild);
    document.getElementById("articel_view;row").appendChild(div);
    determine_open_articles();
    
}

function topic_click(element)
{
  let topic = element.split(";")[1];
  set_articles(topic);
  set_statistics(topic);
}

function article_click(id)
{
  display_article(id);
}

function entetie_in_statistic_click(params)
{
  let topic = params.seriesName;
  let entity_index = params.dataIndex;
  let entity_name = params.name;
  set_entity_statistics(topic, entity_index, entity_name);
}

async function on_load() {
  set_topics();
}

on_load();