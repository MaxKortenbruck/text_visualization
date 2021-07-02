'use strict'

module.exports = class Entitiy {
    constructor(data, topic, entity_name, identifier)
    {   
        this._identifier = identifier
        this._name = entity_name;
        this._topic = topic;
        
        let ent = data[topic].entities.find(element => {
            element.name === entity_name;
        });
        this._mentions_map = new Map(); 
        this._mentions_array = [];
        this._phrasing_complexity = ent.phrasing_complexity;       
        this._type = ent.type;        
        this._size = ent.size;
        this._representative = ent.merging_history.representative;
        this.set_mentions(ent);
    }

    set_mentions(entity)
    {
        var Mention = require("mention.js");
        var index = 0;
        entity.mentions.forEach(element => {            
            var m = new Mention(element.sentence, element.text, element.tokens. element.annot_type, index, entity);
            index ++;
            mentions_array.push(m);
            //create map with political direction and its' mentions 
            if(!this._mentions_map.has(m.political_direction))
            {
                this._mentions_map.set(m.political_direction, new Set(m));
            }
            else
            {
                this._mentions_map.get(m.political_direction).add(m);
            }
        });
    }

    get entity_statistics()
    {
        
    }

    get identifier()
    {
        return this._identifier;
    }

    get mentions_map()
    {
        return this._mentions_map;
    }

    get political_mentions(key)
    {
        return this._mentions_map.get(key);
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
}