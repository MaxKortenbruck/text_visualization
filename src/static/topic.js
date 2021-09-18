'use strict'

import {Entity} from "./entity.js";
import {Document} from "./document.js";

/**
 * Create entity colours based on their type. 
 * The function creates a hsl colour encoding and changes it to hsl in order
 * to be read by css
 * @param {Integer} num_types 
 * @param {Array} num_sub_types 
 * @returns 2-Dimensional Array with colours for the entity
 */
function create_colour(num_types, num_sub_types )
{
   // Define an Intervall fpr each entity type, so the colours do not match
   const intervall = Math.floor(360/num_types);
   const max = Math.max(...num_sub_types);
   var colour_intervalls = [];
   var mult = 10;
   if(max * 10 >= intervall)
   {
       while(mult * max >= intervall - 5)
       {
            mult -= 2;
       }
   }
   for(let i = 0; i < num_types; i++)
   {
        colour_intervalls.push(create_hsl(num_sub_types[i], i*intervall, 95, 60, mult))
   }
   return colour_intervalls;
}
/**
 * Creates the actual hsl-encoding for the colour gradient used by the entities with the same overall entity type
 * @param {Integer} num - Number of colour variations based on the entity subtypes
 * @param {Integer} h - Value from 0 to 360
 * @param {Integer} s - Saturation
 * @param {Integer} l - Lightness
 * @param {Integer} mult - The multiplicator for creating the colour gradient 
 * @returns An Array with the colours in HEX code
 */
function create_hsl(num, h, s, l, mult)
{
    var col_arr_hex = []
    for (let i = 0; i < num; i++)
    {
        col_arr_hex.push(to_hex(h+i*mult, s-i*1.1, l));
    }
    return col_arr_hex;
}
/**
 * Turns a given hsl encoding to HEX
 * @param {Integer} h - Value from 0 to 360
 * @param {Integer} s - Saturation
 * @param {Integer} l - Lightness
 * @returns String of the hsl colour in HEX
 */
function to_hex(h, s, l)
{
    l /= 100;
    const i = s * Math.min(l, 1-l) / 100;
    var f = function(x){
        const k = (x + h / 30) % 12;
        const colour = l - i * Math.max(Math.min(k-3, 9-k, 1), -1);
        return Math.round(255*colour).toString(16).padStart(2, "0");
    };
    return "#"+f(0)+f(8)+f(4);
}

/**
 * The Topic class. A new topic object can be created by calling the
 * constructor 
 * >>> var topic = new Topic(data, topic_id, topic_name) 
 * The Topic class also instantiates its' articles and entities.
 */
export class Topic
{
    /**
     * @constructor
     * @param {Object} data - JSON Data Object with the Information about the topic, entitys and article 
     * @param {String} topic_id -  Unique topic id 
     * @param {String} topic_name - Compact topic name
     * @param {Integer} idn - Index of the topic in the data structure
     */
    constructor(data, topic_id, topic_name, idn)
    {

        this._identifier = topic_id;
        this._name = topic_name;
        this._index = idn;
        this._articles = [];
        this._entities = [];
        this._entities_type = {};
        this._entity_type_clear_dict = {
            'person-ne' : 'Single, named person',
            'person-nes' : 'Multiple, named persons',
            'group-ne' : 'Organization',
            'country-ne' : 'Named country',
            'person-nn' : 'Describing noun for a single person',
            'person-nns': 'Describing noun for multiple persons',
            'group' : 'A Group of people or a place',
            'country' : 'A general Location',
            'misc' : 'Abstract concept'

        }
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
            var article = new Document(doc, data, article_name, this._identifier, this._index ,i);
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
        var num_types = 0, count = 0; 
        var num_sub_types = [];
        Object.entries(this._entities_type).forEach(([s,o]) =>{
            num_types ++;
            Object.entries(o).forEach(([k, v]) => {
                count ++;
            })
            num_sub_types.push(count);
            count = 0;
        });
        var colour_arr = create_colour(num_types, num_sub_types)
        var i = 0;
        for (const [o, element] of Object.entries(this._entities_type))
        {  
            var j = 0;
            for(const [p, entity_arr] of Object.entries(element))
            {
                entity_arr.forEach(pol =>{
                    pol.add_colour(colour_arr[i][j]);
                });
                j++;
            }
            i++;
        }           
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
    /**
     * @returns String of the topic name
     */
    get clean_topic()
    {   
        var ret = this._identifier;
        return ret.slice(0, -17).replace(/[-,_,.,0,1,2,3,4,5,6,7,8,9]/g, "");
    }
    /**
     * @returns Index of the current topic in the data structure
     */
    get index()
    {
        return this.index;
    }
    /**
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
    /**
     * Returns a dict of names, numbers and colour of the entitytype attribute.
     * The data of one entity is found at the same index across all three arrays.
     */
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
                type_dict.names.push(this._entity_type_clear_dict[p]);
                type_dict.numbers.push(entity_arr.length);
                type_dict.colour.push(entity_arr[0].colour);
            }
            
        }
        return type_dict;
    }
}
