'use strict'

module.exports = class Document {
    constructor(data, article, topic)
    {
        //complete identifier topic;article
        this._identifier = article;
        this._name = this.set_document_name(data, article);
        this._political_direction = set_political_direction();
        this._topic = topic;
        this._my_entities = null;
        this._marked_entities = null;
        this._text_array = this.set_article_text(data);
    }

    /**
     * Set the article name from JSON data
     * @param {JSON-Object} data - JSON dataset
     * @returns String with article name
     */
    set_document_name(data, article)
    {
        let identif = article.split(";");
        let result = data[identif[0]].documents.find( art =>{
            return art.title === identif[1];
        });
        return result.name;
    }

    /**
     * 
     * @returns string with political direction in format line 'LL' or 'R' 
     */
    set_political_direction()
    {
        let text = this._name.split["_"];
        return text[1];
    }

    /**
     * Build a text out of the provided Jason dataset 
     * @param {JSON-Object} data - JSON Data 
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
    
    add_entity(ent)
    {
        this._my_entities.push(ent);
    }
    
    mark_entity(ent)
    {
        this._marked_entities.push(ent.identifier);
    }
    
    unmark_entity(ent)
    {
        this._marked_entities = this._marked_entities.filter(function( ele ){
            return ele.identifier !== ent.identifier;
        })
    }

    get text()
    {
        var text_return;
        if(this._marked_entities > 0)
        {
            
        }
        else
        {
           this._text_array.forEach(sentence => {
               sentence.forEach(word => {
                   text_return += word;
               });
           });
        }   
        return text_return;
    }

    get statistics()
}