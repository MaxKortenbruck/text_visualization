'use strict'

import {Mention} from "./mention.js";

export class Entity {
    constructor(data, topic, entity_name, identifier, number)
    {   
        var self = this;
        this._identifier = identifier
        this._name = entity_name;
        this._topic = topic;
        this._number = number;

        var ent = data[topic].entities.find(item => item.name === entity_name);
      
        this._all_political_mentions = []
        this._mentions_array = [];
        this._phrasing_complexity = ent.phrasing_complexity;       
        this._type = ent.type;        
        this._size = ent.size;
        this._representative = ent.merging_history.representative;
        this._colour = null;
        this.set_mentions(ent);
       // console.log(this._all_political_mentions);
    }

    //mentions nach ll und L un R mit Object ordnen
    set_mentions(entity)
    {
        var index = 0;
        entity.mentions.forEach(element => {            
            var m = new Mention(element.sentence, element.text, element.tokens, element.annot_type, index, entity);
            index ++;
            this.mentions_array.push(m);
            if(!this._all_political_mentions.includes(m.political_direction_of_article))
            {
                this._all_political_mentions.push(m.political_direction_of_article);
            }
        })
    }

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
        ent.forEach( ment => {
            if(!names.includes(ment.normalized_text))
            {
                names.push(ment.normalized_text);
                index = names.indexOf(ment.normalized_text);
                values[index] = 1;
            }
            else
            {
                index = names.indexOf(ment.normalized_text);
                values[index] += 1;
            }
        })
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
            console.log(ret_array);
            return ret_array;
        }
    }

    add_colour(colour)
    {
        this._colour = colour;
    }

    get mentions_array()
    {
        return this._mentions_array;
    }

    get type()
    {
        return this._type;
    }

    get size()
    {
        return this._size;
    }

    get representative()
    {
        return this._representative;
    }

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

    get identifier()
    {
        return this._identifier;
    }

    get mentions()
    {
        return this._all_political_mentions;
    }

    get formatted_name()
    {
        var ret = this._name;
        ret = ret.slice(0, -2);
        ret = ret.replace(/_/g, " ");
        return ret;
    }

    get colour()
    {
        return this._colour;
    }

    get id_number()
    {
        return this._number;
    }

    mentions_in_sentence(sentence)
    {   
        let ret = [];
        for(let i = 0; i < this._mentions_array.length; i ++)
        {
            if(this._mentions_array[i].sentence == sentence)
            {
                ret.push(this._mentions_array[i])
            }
            else if(this._mentions_array[i].sentence > sentence)
            {
                break;
            }
        }
        return ret;
    }






    //Deprecated

   setValue(map, key, value) 
   {
        if (!map.has(key)) 
        {
            map.set(key, new Set(value));
            return;
        }
        map.get(key).add(value);
    }

    is_name(entity)
    {
        return entity.name === self._name;
    }


}