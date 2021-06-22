'use strict'

module.exports = class Enitiy {
    constructor(data, topic, entity_name, identifier)
    {   
        this.identifier = identifier
        this.name = entity_name;
        this.topic = topic;
        
        this.title = set_entity_title();
        
        let ent = data[topic].entities.find(element => {
            element.name === entity_name;
        });
        this.mentions = set_mentions(data, topic, ent);
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


    set_mentions(entity)
    {
        var Mention = require("mention.js");
        var mentions = [];
        var index = 0;
        entity.mentions.forEach(element => {            
            var e = new Mention(element.sentence, element.text, element.tokens. element.annot_type, index, entity);
            mentions.push(e);
            index ++; 
        });
        return mentions;
    }
}