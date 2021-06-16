'use strict'

module.exports = class Enitiy {
    constructor(data, topic, entity_name, identifier)
    {   
        this.identifier = identifier
        this.name = entity_name;
        this.topic = topic;
        
        this.title = set_entity_title();
        this.mentions = set_mentions();
        
        let ent = data[topic].entities.find(element => {
            element.name === entity_name;
        });
        this.phrasing_complexity = ent.phrasing_complexity;       
        this.type = ent.type;        
        this.size = ent.size;
        this.representative = ent.merging_history.representative;
    }


    set_entity_title()
    {
        let text = this.identifier.split("_");
        text.pop();
        for(let i = 0; i < text.length()-1; i++)
        {
            text[i] = text[i] + " ";
        }
        return text;
    }


    set_mentions(data, );
}