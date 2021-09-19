# Text Visualization

## Hier entsteht DAS BESTE tool aller Zeiten.

### Branching

Bitte alle Teilprojekte in seperaten branch aufteilen

Github free erlaubt leider keine Merge requests, also falls ihr auf den master merged, bitte keine force-pushes durchführen!

Und natürlich nur mergen, wenn ihr euch absolut sicher seid.

### Git Hub mit vs code

Für vs code gibt es eine Version Control extension, die passenderweise auch github pull requests heisst, dann muss man die Versionskontrolle nicht über das terminal machen. 
Ist das addon installiert, könnt ihr in der Commandpalette (Ctrl+Shift+P)  *Git: Clone*  eingeben und dann die URL  *https://github.com/MaxKortenbruck/text_visualization*  einfügen und Enter hauen. 
Da es sich um ein privates repo handelt, müsst ihr euch noch mit euren github daten einloggen, da wird man von vscode aber durchgeführt. 


Hinweise zum Programmieren:

Das css File wird in firefox durch strg+F5 mit neu geladen, sonst wird es im Cache gespeichert und nicht immer neu geladen.

# Text Visualization
## Table of contents
* [General Information](#general-information)
* [Motivation](#motivation)
* [Technologies](#technologies)
* [Features](#features)
* [Code examples](#code-examples)
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
What makes your project stand out? Include screenshots, code snippets, logos, etc.
- TBD

## Code examples
Include very short code examples that show what the project does as concisely as possible. Developers should be able to figure out how your project solves their problem by looking at the code examples. Make sure the API you are showing off is intuitive, and that your code is short and concise. See the news-please project for example.
- TBD

## Installation
Provide step-by-step examples and descriptions of how to set up a development environment.

You can use your favorite code editor.

To run the Webserver on your machine you can ether use docker or run the app.py directly.

### Use docker

To use docker you need to install docker on your machine. On Linux you aditionaly need docker compose aditionaly.

1. Navigate to the root directory of your machine

2. Build the container by using: 

>docker-compose build

3. then start the container:

>docker-compose up -d

To stop the container simpy use: 

>docker-compose down

### start app.py direct

To run the app.py directly you need to have installed the latest python version. Aditionally you need to have installed flask.

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