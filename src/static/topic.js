'use strict'

import {Entity} from "./entity.js";
import {Document} from "./document.js";

export class Topic
{
    constructor(data, topic_id, topic_name)
    {

        this._identifier = topic_id;
        this._name = topic_name;
        //this.name = this.set_topic_name(topic_name);
        //this.index = this.set_topic_index(data, topic_name);
        this._articles = [];
        this._entities = [];
        this.set_articles(data);
        this.set_entities(data);
        this.entities_to_articles();

    }
    
    /**
     * Returns the internal index of this topic in the json data
     * @param {JSON-Oject} data - JSON data 
     * @param {String} topic_name - Topic Indentificator     
     * @returns - Integer of topic index
     *//*
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
    */
    set_entities(data)
    {
        data[this._identifier].entities.forEach(element => {
            var id = this._identifier + ";" + element.name;
            var en = new Entity(data, this._identifier, element.name, id);
            this.entities.push(en);
        })
    }
    set_articles(data)
    {
        data[this._identifier].documents.forEach(art => {
            let article_name = this._identifier + ";" + art.title;
            var doc = new Document(data, article_name, this._identifier);
            this._articles.push(doc);
        });
    }
    entities_to_articles()
    {
        this._articles.forEach(art => {
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

    get entities()
    {
        return this._entities;
    }

    get articles()
    {
        return this._articles;
    }

    get clean_topic()
    {   
        var ret = this._identifier;
        return ret.slice(0, -17).replace(/[-,_,.,0,1,2,3,4,5,6,7,8,9]/g, "");
    }

    get statistics_of_entities()
    {
        var entity_dict = {
            names : [],
            numbers : []
        }
        this.entities.forEach( ent => {
            entity_dict.names.push(ent.formatted_name);
            entity_dict.numbers.push(ent.mentions_array.length);
        })
        return entity_dict;
    }
}
