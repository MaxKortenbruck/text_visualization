import { get_topics, get_articles, get_statistics, get_entity_statistics, get_text } from "./base_functions.js";
import { create_pie_plot } from "./article-view-charts.js";

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

  let body = document.createElement("tbody");
  let i = 1;
  data.forEach( article => {
    let trChild = document.createElement("tr");
    trChild.id = "row;" + topic + ";" + article;
    trChild.onclick = function()
    {
        display_article(this.id);
        return false;
    }

    let tdNumber = document.createElement("td");
    tdNumber.appendChild( document.createTextNode(i) );
    i++;
    

    let tdTitle = document.createElement("td");
    tdTitle.appendChild( document.createTextNode(article));

    let thOrientation = document.createElement("td");
    thOrientation.appendChild( document.createTextNode("dummy"));

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

async function set_entity_statistics(topic, entity)
{
  let data = await get_entity_statistics(topic, entity);
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

    let div = document.createElement("div");
    div.className = "col";

    let divChild = document.createElement("div");
    divChild.className = "border bg-light";
    divChild.style = "padding: 20px"

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

    
    //create and append text
    let p = document.createElement("p");
    p.appendChild( document.createTextNode(text));
    divChild.appendChild(p);


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

function entetie_in_statistic_click(params)
{
  let topic = params.seriesName;
  let entity_index = params.dataIndex;
  console.log(params)
  set_entity_statistics(topic, entity_index);
}

async function on_load() {
  set_topics();
}

on_load();
