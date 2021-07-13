'use strict'

export class Document {
    constructor(data, article, topic)
    {
        //complete identifier topic;article
        this._identifier = article;

        var tmp = article.split(";");
        
        this._title = tmp[1];
        
        var result = data[tmp[0]].documents.find( art =>{
            return art.title === tmp[1];
        });
        this._name = result.name;
        
        tmp = this._name.split("_");
        this._political_direction = tmp[1];
        
        this._topic = topic;
        this._my_entities = [];
        this._marked_entities = [];
        this._text_array = this.set_article_text(data);
    }

    /**
     * Build a text out of the provided Jason dataset 
     * @param {Object} data - JSON Data 
     * @returns 2-Dimensional array with article text divided in sentences with words
     */
    set_article_text(data)
    {
        let temp_text = "";
        let sentence_symbols = [".",",","?","!",";",":","%","€","$","\’","\""];
        let sentence_array = [], text_array = [];
        
        let article = data[this._topic].documents.find( art => {
            return art.name === this._name;
        })
        let text = article.text;
        text.forEach(sentence => {
            sentence.forEach(word => { 
                if(!sentence_symbols.includes(word["word"]))
                {
                    temp_text += " ";
                }
                temp_text += word["word"];
                sentence_array.push(temp_text);
                temp_text = "";    
            });
        text_array.push(sentence_array);
        sentence_array = [];
        });
        return text_array;
    }
    /**
     * Adds a reference of an Entity Object to the article
     * @param {Object} ent - Entity  
     */
    
    add_entity(ent)
    {
        this._my_entities.push(ent);
    }
    /**
     * Passes an Entity Object to to the article that is to be marked
     * @param {Object} ent - Entity   
     */
    mark_entity(ent)
    {
        this._marked_entities.push(ent.identifier);
    }
    /**
     * 
     * @param {Object} ent 
     */
    unmark_entity(ent)
    {
        this._marked_entities = this._marked_entities.filter(function( ele ){
            return ele.identifier !== ent.identifier;
        })
    }

    get text()
    {
        var text_return = "";
        if(this._marked_entities > 0)
        {
            
        }
        else
        {
            for([i, sentence] of this._text_array.entries())
            {  
                if(!i)
                {
                    continue;
                }  
                sentence.forEach(word => {
                    text_return += word;
                });
            };
        }
        return text_return;
    }
    
    get statistics_of_article()
    {   
        var mention_dict = {
            names : [],
            numbers : []
        }
        var mentions = [];
        this._my_entities.forEach( ent => {
            mention_dict.names.push(ent.formatted_name);
            mentions = ent.get_mentions_for_article(this.political_direction)
            mention_dict.numbers.push(mentions.length);
        })
        return mention_dict;
    }

    get political_direction()
    {
        return this._political_direction;
    }

    get id()
    {
        return this._identifier;
    }

    get name()
    {
        return this._name;
    }

    get topic()
    {
        return this._topic;
    }

    get title()
    {
        return this._title;
    }

    get clean_topic()
    {   
        var ret = this._topic;
        return ret.slice(0, -17).replace(/[-,_,.,0,1,2,3,4,5,6,7,8,9]/g, "");
    }

    get entities()
    {
        return this._my_entities;
    }
}