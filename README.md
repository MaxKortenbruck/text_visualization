# Text Visualization
## Table of contents
* [General Information](#general-information)
* [Motivation](#motivation)
* [Technologies](#technologies)
* [Features](#features)
* [Additions to Articles](#additions-to-articles)
* [Documentation](#documentation)
* [Installation](#installation)
* [How to use the project](#how-to-use-the-project)
* [License](#license)

## General Information
This application enables text analyzation by visualizing coreferential mentions in news articles and drawing up statistics.
For every article you can choose which entities to mark in the text and which statistics you would like to see. You can also choose whether you would like to analyze a single article or to compare multiple articles side by side.

## Motivation
This tool is a product of the course "Key Competences in Computer Science" which was held in the summer semester of 2021 at the University of Wuppertal and is based on the prototype constructed in the master thesis "Automated Identification of Framing by Word Choice and Labeling to Reveal Media Bias in News Articles" by Anastasia Zhukova.

## Technologies
The project is created with:
- ECMAScript 2020
- Python 3.7
- Docker Desktop 3.5.2
- HTML 5.2
- CSS 2.1
- Bootstrap 5.0.1
- ECharts 5.1.2

## Features
This project allows you to compare articles from a range of selected topics with different political orientations.

![Alt text](/src/doc/pictures/main.png)

You can explore specific mentions and their implications in and across articles.

![Alt text](/src/doc/pictures/text_mark.png)

A more sbtract view is provided by different plots, like bar charts or scatter plots to alllow for more general text analysis and cross article compasrison:

![Alt text](/src/doc/pictures/scatter.png)

Each plot concerning entities also provides a treemap with variations of how the selected entity is mentioned 
inside the respective article

![Alt text](/src/doc/pictures/stat_bar.png)

![Alt text](/src/doc/pictures/cross_article.png)


## Additions to articles
The project creates topic and entity objects automaticly, once a JSON file is loaded, by recursivly creating new objects for articles
and entitities for each JSON-FIle, which are read and stored as topics.

![Alt text](/src/doc/pictures/dia_cl.png)

If you want to change the source from where the JSON Files are loaded, you need to change the

>def get_path(article = '')

function in the file 

>src/app.py  

If you run the application on a local server, it suffices to pre-load or copy the data into :
 
>static/ressourcen/jsons

## Documentation

A full documentation is available in the 

>/src/doc/out

directory. It is HTML based and uses JSDOC. You can access it by opening the

>index.html

file in your browser

## Installation

### Clone repository

You first need to make sure, that you use a current git Version on your system.
If you use a Linux, Windows or macOS based distribution, you can check your installation by opening a terminal and typing

>git --version

If you have no output, you need to install git and check your installation by typing the above line again.

After you have installed git, clone the repository to a new or empty existing directory of your choice by typing

>git -C ./path/to/your/workspace -clone https://github.com/MaxKortenbruck/text_visualization

### Start a local server

To test and run the application, you need a local server. In this project, we use the Flask framework. It is python based and we would
advice you to create a new python virtual enviroment for this project to avoid any complications with other installations. 
If you need help creating a virtual enviroment in python, we sugest the following website:
https://docs.python.org/3/library/venv.html

For creating the new server, you have two options:

#### Use docker

To use docker you need to install docker and docker compose. Check your installation by docker -v into your terminal

1. Navigate to the root directory of your machine

2. Build the container by using: 

>docker-compose build

3. Then start the container in the detached mode, so it keeps running in the backgorund after you close your terminal:

>docker-compose up -d

To stop the container simpy use: 

>docker-compose down

#### start app.py direct

To run the app.py you may need to install the flask package.

To run the app.py navigate to the src directory:

>cd ./src

then start the app with: 

>python3 app.py

### Acsess the website

If the server is running correctly you can accsess the site using a brower of your choice.

>http://127.0.0.1:5000


## How to use the project
On the project's start screen you gain some generel information about the project and a short description of how to use it. 

On the left there is an arrow-shaped button where you can open the navigation bar. There you are able to open the page with some information about the project, the article view's page or a page with the developers' contact information.

In the article view there is a list of available topics. When you chose a topic, you can either open the belonging statistics to this topic or you pick one or more article(s) belonging to the topic from the list that will be displayed on the right then. When an article is clicked, a new block will be displayed at the bottom of the screen where you can read the article or look at the statistics. There is one statistic that shows how the entities are distributed all over the text. You can choose whether you would like to see the statistic as a pie plot or as a bar plot. When you click on an entity in the plot another plot will open and show how the entity is mentioned in the text. You can again choose the type of the plot. To mark entities in the texts you can open the entities-list and click on specific entities or on the 'mark all entities'-button. To unmark an entity you can again click on its button or on the 'unmark all entities'-button to unmark all of them.

## License
Licensed under the GNU General Public License v3.0; you may not use text_visualization except in compliance with the License. A copy of the License is included in the project, see the file LICENSE.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License