'use strict'

import {Entity} from "./entity.js";
import {Document} from "./document.js";

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

function RGB2Color(r,g,b)
{
  return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function byte2Hex(n)
  {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }

function makeColorGradient(frequency1, frequency2, frequency3,
    phase1, phase2, phase3,
    center, width, len)
{
    var c_arr = [];
    if (center == undefined)   center = 128;
    if (width == undefined)    width = 127;
    if (len == undefined)      len = 50;

    for (var i = 0; i < len; ++i)
    {
        var r = Math.sin(frequency1*i + phase1) * width + center;
        var g = Math.sin(frequency2*i + phase2) * width + center;
        var b = Math.sin(frequency3*i + phase3) * width + center;
        var c = RGB2Color(r,g,b)
        c_arr.push(c)
    }
    return c_arr;
}

export class Topic
{
    constructor(data, topic_id, topic_name)
    {

        this._identifier = topic_id;
        this._name = topic_name;
        this._articles = [];
        this._entities = [];
        this._entities_type = {};
        this.set_articles(data);
        this.set_entities(data);
        this.entities_to_articles();
        this.set_colours();
    }
    
    /**
     * Returns the internal index of this topic in the json data
     * @param {Oject} data - JSON data 
     * @param {String} topic_name - Topic Indentificator     
     * @returns Integer of topic index
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

    /**
     * Creates all Entity class Objects belonging to this topic.
     * @param {Objet} data - JSON Data 
     */
    set_entities(data)
    {
        for(const  [i, ent] of data[this._identifier].entities.entries())
        {
            var id = this._identifier + ";" + ent.name;
            var entity = new Entity(ent, this._identifier, ent.name, id, i);

            var an = entity.type.split('-');
            if(!(this._entities_type[an[0]]))
            {
                this._entities_type[an[0]] = {};
            }
            if(!(this._entities_type[an[0]][entity.type]))
            {
                this._entities_type[an[0]][entity.type] = [];
            }
            this._entities_type[an[0]][entity.type].push(entity);
            this._entities.push(entity);
        }
    }
    /**
     * Creates all Document class Objects belonging to this topic. 
     * @param {Objet} data - JSON Data
     */
    set_articles(data)
    {
        for(const [i, doc] of data[this._identifier].documents.entries())
        {
            let article_name = this._identifier + ";" + doc.title;
            var article = new Document(doc, data, article_name, this._identifier, i);
            this._articles.push(article);
        }
    }
    /**
     * Assings each Article a refrence to their respective Entity class Object  
     */
    entities_to_articles()
    {
        this._articles.forEach(art => {
            this._entities.forEach(ent => {
                if(ent.mentions.includes(art.political_direction))
                {
                    art.add_entity(ent);
                }
            });
        });
    }
    /**
     * Sets the colour scheme for the entities from an array.
     * If the number of entities exceeds the size of the array, a random colour is picked.
     */
    set_colours()
    {	
        var fr = 1;
        var f1, f2, f3;
        var i = 0;
        var col_arr = [];
        console.log(this._entities_type);
        for (const [o, element] of Object.entries(this._entities_type))
        {  
            if( i % 5 == 0 )
            {   
                console.log(fr)
                console.log('switch  ' + i)    
                switch (fr) {
                    case 1:
                        f1 = .1
                        f2 = .1
                        f3 = .1
                        break;
                    case 2:
                        f1 = .15
                        f2 = .1
                        f3 = .1
                        break;
                    case 3:
                        f1 = .1
                        f2 = .15
                        f3 = .1
                        break;
                    case 4:
                        var f1 = .1
                        var f2 = .1
                        var f3 = .15
                    default:
                        break;
                }
                console.log(f1)
                console.log(f2)
                console.log(f3)
                col_arr = makeColorGradient(f1,f2,f3,0,2,4, 170,75, 125);
                fr++;
                i++;
            }
            for(const [p, entity_arr] of Object.entries(element))
            {
                var j = 0;
                entity_arr.forEach(pol =>{
                    // console.log(pol + '  ' + col_arr[((i-1) * 8 + j)]);
                    pol.add_colour(col_arr[((i-1)*8 + j)]);
                    j+=2;
                });        
            }
        i+=1;
        // console.log(i)
        
        };

        // for(const [i , element] of this._entities.entries())
        // {	
        //     //element.add_colour(rainbow(this._entities.length, i+1));
        //     //element.add_colour(random_colour(this._entities.length, i+1));
		// 	if ( i >= colour_array.length)
		// 	{
		// 		element.add_colour(random_colour());
		// 	}
		// 	else
		// 	{
		// 		element.add_colour(colour_array[i]);
		// 	}		
        // }
    }
    /**
     * @returns {String} Indentifier of the topic
     */
    get identifier()
    {
        return this._identifier;
    }
    /**
     * @returns {String} The topics' name without any special caracters
     */
    get formatted_name()
    {
        let text = this._name.split("_");
        return text[1];
    }
    /**
     * @returns {Array} Returns Array with all the topics' entities
     */
    get entities()
    {
        return this._entities;
    }
    /**
     * @returns {Array} Returns Array with all the topics' articles
     */
    get articles()
    {
        return this._articles;
    }

    get clean_topic()
    {   
        var ret = this._identifier;
        return ret.slice(0, -17).replace(/[-,_,.,0,1,2,3,4,5,6,7,8,9]/g, "");
    }
    /**
     * @returns 
     *              Dictionary style Object where the three keys 
     *                  < names, numbers, colour, phrasing_complexity >
     *              each hold an array with the attributes of the articles' entities.
     *              The arrays are initialiased, so names[k], numbers[k] and colour[k] each
     *              reference the same entity.
     */
    get statistics_of_entities()
    {
        var entity_dict = {
            names : [],
            numbers : [],
            colour : [],
            phrasing_complexity : []
        }
        this.entities.forEach( ent => {
            entity_dict.names.push(ent.formatted_name);
            entity_dict.numbers.push(ent.mentions_array.length);
            entity_dict.colour.push(ent.colour);
            entity_dict.phrasing_complexity.push(ent.phrasing_complexity);
        });
        return entity_dict;
    }
    /**
     * 
     * @param {Object} article - Object of the Article class  
     * @returns {Object} Dictionary style Object where the three keys 
     *                      < names, numbers, colour >
     *                   each hold an array with the attributes of the articles' entities.
     *                   The arrays are initialiased, so names[k], numbers[k] and colour[k] each
     *                   reference the same entity.
     */
    get_statistics_of_article_with_zero(article)
    {
        var entity_dict = article.statistics_of_article;
        this.entities.forEach( ent => {
            if(!(ent.formatted_name in entity_dict.names))
            {
                entity_dict.names.push(ent.formatted_name);
                entity_dict.numbers.push(0);
                entity_dict.colour.push(ent.colour);
            }
        });
        return entity_dict;

    }
    get statistics_of_entity_types()
    {
        var type_dict = {
            names : [],
            numbers : [],
            colour : []
        }

        for (const [o, element] of Object.entries(this._entities_type))
        {
            for(const [p, entity_arr] of Object.entries(element))
            {
                type_dict.names.push(p);
                type_dict.numbers.push(entity_arr.length);
                type_dict.colour.push(entity_arr[0].colour);
            }
            
        }
        return type_dict;
    }
}
