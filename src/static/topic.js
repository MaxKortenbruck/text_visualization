'use strict'

const Enitiy = require("./entity");

module.exports = class Topic
{
    constructor(data, topic_name)
    {

        this._identifier = topic_name;
        //this.name = this.set_topic_name(topic_name);
        //this.index = this.set_topic_index(data, topic_name);
        this.articles = null;
        this.entities = null;
        this.set_articles(data);
        this.set_entities(data);
        this.entities_to_articles();

    }
    /*
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
    }*/
    set_entities(data)
    {
        var Entity = require("entity.js");
        data[this._identifier].entities.forEach(element => {
            let id = this._identifier + ";" + element.name;
            let en = new Entity(data, this._identifier, element.name, id);
            this.entities.push(en);
        })
    }
    set_articles(data)
    {
        var Document = require("document.js");
        data[this._identifier].document.forEach(art => {
            let article_name = this._identifier + ";" + art.title;
            var doc = new Document(data, article_name, this._identifier);
            this.articles.push(doc);
        });
    }
    entities_to_articles()
    {
        this.articles.forEach(art => {
            this.entities.forEach(ent => {
                for (let ment of ent.mentions)
                {
                    if(art.political_direction == ment.political_direction)
                    {
                        art.add_entity(ent);
                        break;
                    }
                }
            });
        });
    }

    get identifier()
    {
        return this._identifier;
    }

    get name()
    {
        let temp = this._identifier.split[";"];
        let text = temp[0].split("_");
        return text[1];
    }
}
