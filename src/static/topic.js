'use strict'

import {Entity} from "./entity.js";
import {Document} from "./document.js";

var colour_array = ['#00008b', '#1e008a', '#2d008a', '#39008a', '#43008b', '#4c008c', '#55008d', '#5d008f', '#650092', '#6d0094', '#750097', '#7d009b', '#86009f', '#8e00a3', '#9600a8', '#9f00ae', '#a700b4', '#b000ba', '#b900c1', '#c300c8', '#cc00d0', '#d600d8', '#e000e1', '#ea00eb', '#f400f5', '#ff00ff', '#ff00ec', '#ff00d9', '#ff00c8', '#ff01b8', '#ff0da9', '#ff189b', '#ff218d', '#ff2981', '#ff3176', '#ff396b', '#ff4061', '#ff4758', '#ff4e4f', '#ff5547', '#ff5c3f', '#ff6337', '#ff6a30', '#ff7129', '#ff7822', '#ff7f1b', '#ff8614', '#ff8e0c', '#ff9505', '#ff9d01', '#ffac00', '#ffb302', '#ffba06', '#ffc00b', '#fec611', '#fccb17', '#fbd01d', '#f8d523', '#f6d929', '#f3dd2f', '#f0e035', '#ece43c', '#e8e742', '#e4e948', '#dfeb4e', '#daed55', '#d4ef5b', '#cef062', '#c7f068', '#c0f16f', '#b8f175', '#aff17c', '#a6f082', '#9bef89', '#90ee90', '#8ced95', '#89eb9b', '#86e8a0', '#83e5a5', '#81e1ab', '#7fddb0', '#7dd8b5', '#7bd3ba', '#79cdbf', '#78c7c4', '#76c0c8', '#75b9cd', '#73b1d1', '#71a8d6', '#6f9fda', '#6d96de', '#6a8ce3', '#6681e7', '#6175ea', '#5c69ee', '#545cf2', '#4b4df5', '#3f3df9', '#2d28fc', '#0000ff']

function random_colour(number, total)
{
    
    //let rand_string = Math.floor(Math.random()*16777215).toString(16);
    // ensures a valid colour code by padding the string with a 0, if it is shorter the 6 characters
    //const rand_colour = "#" + rand_string.padStart(6, "0");
    //return rand_colour;
    
	// hsl format
	if (total < 1) total = 1; // defaults to one color - avoid divide by zero
	
	const h = number * (360 / total) % 360;
	const s = 1
	const l = 0.5
	
	// convert to hex
	const a = s * Math.min(l, 1-l);
	const f = n => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color).toString(16).padStart(2, '0');
	};
	return '#${f(0)}${f(8)}${f(4)}';
}

function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step/ numOfSteps;
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
