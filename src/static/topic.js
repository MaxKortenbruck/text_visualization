'use strict'

import {Entity} from "./entity.js";
import {Document} from "./document.js";


function random_colour()
{
    let rand_string = Math.floor(Math.random()*16777215).toString(16);
    // ensures a valid colour code by padding the string with a 0, if it is shorter the 6 characters
    const rand_colour = "#" + rand_string.padStart(6, "0");
    return rand_colour;
}

function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}


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
        this.set_colours();
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

    set_colours()
    {
        for(const [i , element] of this._entities.entries())
        {
            element.add_colour(rainbow(this._entities.length, i+1));
        }
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
