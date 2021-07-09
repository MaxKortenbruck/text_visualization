'use strict'

import {Mention} from "./mention.js";

export class Entity {
    constructor(data, topic, entity_name, identifier)
    {   
        var self = this;
        this._identifier = identifier
        this._name = entity_name;
        this._topic = topic;

        var ent = data[topic].entities.find(item => item.name === entity_name);
      
        this._all_political_mentions = []
        this._mentions_array = [];
        this._phrasing_complexity = ent.phrasing_complexity;       
        this._type = ent.type;        
        this._size = ent.size;
        this._representative = ent.merging_history.representative;
        this.set_mentions(ent);
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

    get entity_statistics()
    {
        
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

    count_mentions(key = "all")
    {
        var ent = [];
        var index = 0;
        var ent_dict = {
            "name" : [],
            "value" : []
        }
        if(key == "all")
        {
            ent = this._mentions_array;
        }
        else
        {
            ent = this.get_mentions_for_article(key);

        } 
        ent.forEach( ment => {
            if(!ent_dict.name.includes(ment.text))
            {
                ent_dict.name.push(ment.text);
                index = ent_dict.name.indexOf(ment.text);
                ent_dict.value[index] = 1;
            }
            else
            {
                index = ent_dict.name.indexOf(ment.text);
                ent_dict.value[index] += 1;
            }
        })
        ent = [];
        for(e in ent_dict)
        {
            ent.push(e);
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
            return ret_array;
        }
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