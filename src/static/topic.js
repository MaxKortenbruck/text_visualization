'use strict'

import {Entity} from "./entity.js";
import {Document} from "./document.js";

export class Topic
{
    constructor(data, topic_id, topic_name)
    {

        this._identifier = topic_id;
        this._name = topic_name;
        console.log(topic_id);
        console.log(topic_name);
        //this.name = this.set_topic_name(topic_name);
        this.index = this.set_topic_index(data, topic_name);
        this.articles = [];
        this.entities = [];
        this.set_articles(data);
        this.set_entities(data);
        this.entities_to_articles();

    }
    
    /**
     * Returns the internal index of this topic in the json data
     * @param {JSON-Oject} data - JSON data 
     * @param {String} topic_name - Topic Indentificator     
     * @returns - Integer of topic index
     */
    set_topic_index(data, topic_name)
    {
        var index = 0, counter = 0;
        while( counter < data.length)
        {
            if(data[counter].topic == topic_name)
            {
                index = counter;
                break;
            }
            counter++;
        }
        return index;
    }
    set_entities(data)
    {
        data[this._identifier].entities.forEach(element => {
            var id = this._identifier + ";" + element.name;
            
            console.log(element.name)

            var en = new Entity(data, this._identifier, element.name, id);
            this.entities.push(en);
        })
    }
    set_articles(data)
    {
        console.log(this._identifier);
        console.log(data[this._identifier].documents)
        data[this._identifier].documents.forEach(art => {
            let article_name = this._identifier + ";" + art.title;
            var doc = new Document(data, article_name, this._identifier);
            console.log(doc);
            this.articles.push(doc);
        });
    }
    entities_to_articles()
    {
        this.articles.forEach(art => {
            this.entities.forEach(ent => {
                if(ent.mentions.includes(art.political_direction))
                {
                    art.add_entity(ent);
                }
            });
        });
    }

    get identifier()
    {
        return this._identifier;
    }

    get formatted_name()
    {
        let text = this._name.split("_");
        return text[1];
    }
}
