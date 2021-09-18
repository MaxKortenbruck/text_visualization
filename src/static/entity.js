'use strict'

import {Mention} from "./mention.js";

/**
 * The entity class. A new object of the entity class can be created by
 * calling the cosntructor:
 * >>> var entity = new Entity(entity, topic, entity_name, identifier, number)
 * The entity class also instantiates each of its' mentions.
 */
export class Entity {
    /** 
     * @param {Object} entity - Reference to the entity data in the JSON object 
     * @param {Object} topic - Reference to the topic Object the entity belongs to
     * @param {String} entity_name - Compact name of the entity 
     * @param {String} identifier - Unique identifier of the entity
     * @param {*} number - Index of the Entity in the dataset
     */
    constructor(entity, topic, entity_name, identifier, number)
    {   
        this._identifier = identifier
        this._name = entity_name;
        this._topic = topic;
        this._number = number;

        //var ent = data[topic].entities.find(item => item.name === entity_name);
      
        this._mentions_array = [];
        this._phrasing_complexity = entity.phrasing_complexity;       
        this._type = entity.type;        
        this._size = entity.size;
        this._representative = entity.merging_history.original.representative;
        this._colour = null;
        this._political_mentions_dict = {
            directions : []
        };
        this.set_mentions(entity);
    }

   /**
    * Maps all mentions of the entity to their political directions.
    * The result is a two dimensional array Object where you can access all mentions 
    * of the political spectrum by calling entity.political_mentions_dict['LL'].
    * @param {Object} entity - Reference to the entity data in the JSON object
    */
    set_mentions(entity)
    {
        var index = 0;
        entity.mentions.forEach(element => {            
            let pol = entity.merging_history.original.phrases[index][1].split("_");
            var m = new Mention(element.sentence, element.text, element.tokens, element.annot_type, element.head_token_index,
                                element.head_toke_word, index, pol[1]);
            index ++;
            this._mentions_array.push(m);
            // map the entities to their types like person -> person-nn
            if(!this._political_mentions_dict.directions.includes(pol[1]))
            {
                this._political_mentions_dict.directions.push(pol[1]);
                this._political_mentions_dict[pol[1]] = [m];
            }
            else
            {
                this._political_mentions_dict[pol[1]].push(m);
            }
        })
    }
    /**
     * Counts the mentions of the entity and returns the names and numbers. 
     * The default returns the numbers for all mentions. Or one can pass an article
     * for counting only the entity's mentions in the passed article.
     * @param {Object} key - Reference of article to count the number of mentions from. Default is "all"
     * @returns Array Object with the numbers amd names.
     */
    count_mentions(key = "all")
    {
        var ent = [], names = [], values = [];
        var index = 0;
        if(key == "all")
        {
            ent = this._mentions_array;
        }
        else
        {
            ent = this.get_mentions_for_article(key);

        } 
        console.log(ent)
        ent.forEach( ment => {
            if(!names.includes(ment.text))
            {
                names.push(ment.text);
                index = names.indexOf(ment.text);
                values[index] = 1;
            }
            else
            {
                index = names.indexOf(ment.text);
                values[index] += 1;
            }
        })
        console.log(names)
        console.log(values)
        if(names.length != values.length){throw Error};
        var ent = [];
        for(let i = 0; i < names.length; i++)
        {
            let tmp_obj = {};
            tmp_obj.name = names[i];
            tmp_obj.value = values[i];
            ent.push(tmp_obj);
        }
        return ent;
    }
    /**
     * Returns all the mentions of a specific article. If no article is provided,
     * all mentions of the entity are returned.
     * @param {Object} key - Refernce to the article Object 
     * @returns Arrax of mentions
     */
    get_mentions_for_article(key = "all")
    {   
        
        if(key == "all")
        {
            return this._mentions_array;
        }
        else
        {
            var ret_array = [];
            this._mentions_array.forEach(element => {
                if(element.political_direction_of_article == key)
                {
                    ret_array.push(element);
                }
            }); 
            return ret_array;
        }
    }
    /**
     * Adds a colour as HEX code like #AABBCC to the entity
     * @param {String} colour - HEX code of the colour
     */
    add_colour(colour)
    {
        this._colour = colour;
    }
    /** 
     * @returns Array with all the entity's mentions
     */
    get mentions_array()
    {
        return this._mentions_array;
    }
    /**
     * @returns The entity type
     */
    get type()
    {
        return this._type;
    }
    /**
     * @returns The entity size
     */
    get size() 
    {
        return this._size;
    }
    /**
     * @returns The entity representative
     */
    get representative()
    {
        return this._representative;
    }
    /**
     * @returns The title without any special characters
     */
    get title()
    {
        let text = this._identifier.split("_");
        text.pop();
        for(let i = 0; i < text.length()-1; i++)
        {
            text[i] = text[i] + " ";
        }
        return text;
    }
    /**
     * @returns The unique identifier 
     */
    get identifier() 
    {
        return this._identifier;
    }
    /**
     * @returns A two dimensional array Object where you can access all mentions 
     *   of the political spectrum by calling your_object['LL'].
     */
    get mentions() 
    {
        return this._political_mentions_dict.directions;
    }
    /**
     * @returns The nomalized name without numbers
     */
    get formatted_name() 
    {
        var ret = this._name;
        ret = ret.slice(0, -2);
        ret = ret.replace(/[_,0,1,2,3,4,5,6,7,8,9]/g, " ");
        return ret;
    }
    /**
     * @returns The HEX code of the colour
     */
    get colour()
    {
        return this._colour;
    }
    /**
     * @returns The index (id) number
     */
    get id_number()
    {
        return this._number;
    }
    /**
     * @returns The phrasing complexity
     */
    get phrasing_complexity()
    {
        return this._phrasing_complexity;
    }
    /**
     * Returns references to all the mentions of this entity from a specific
     * sentence and from specified political spectrum
     * @param {Integer} sentence - Number of the sentence 
     * @param {String} direction - Political direction
     * @returns Array with mentins
     */
    mentions_in_sentence(sentence, direction)
    {   
        let ret = [];
        for(let i = 0; i < this._political_mentions_dict[direction].length; i ++)
        {
            if(this._political_mentions_dict[direction][i].sentence == sentence)
            {
                ret.push(this._political_mentions_dict[direction][i])
            }
            else if(this._political_mentions_dict[direction][i].sentence > sentence)
            {
                break;
            }
        }
        return ret;
    }
}